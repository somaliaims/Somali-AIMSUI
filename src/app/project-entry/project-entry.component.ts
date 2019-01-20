import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';
import { ProjectService } from '../services/project.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from '../config/messages';
import { Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { Sector } from '../models/sector-model';
import { Location } from '../models/location-model';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Settings } from '../config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocationService } from '../services/location.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { OrganizationService } from '../services/organization-service';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent implements OnInit {
  activeProjectId: number = 0;
  selectedSectorId: number = 0;
  selectedLocationId: number = 0;
  selectedParentSectorId: number = 0;
  btnProjectText: string = 'Save Project';
  btnProjectSectorText: string = 'Save Sector';
  btnProjectLocationText: string = 'Save Location';
  btnProjectDocumentText: string = 'Save Document';
  sectorPlaceHolder: string = 'Enter/Select Sector';
  locationPlaceHolder: string = 'Enter/Select Location';
  isProjectBtnDisabled: boolean = false;
  isProjectBtnSectorDisabled: boolean = false;
  isProjectLocationBtnDisabled: boolean = false;
  isProjectDocumentBtnDisabled: boolean = false;
  isSectorVisible: boolean = false;
  requestNo: number = 0;
  isError: boolean = false;
  infoMessage: string = '';
  showMessage: boolean = false;
  isForEdit: boolean = false;
  errorMessage: string = '';
  startDateModel: NgbDateStruct;
  currentTab: string = 'project';
  sectorSelectionForm: FormGroup;
  sectorInput = new FormControl();
  locationSelectionForm: FormGroup;
  locationInput = new FormControl();
  parentSectorInput = new FormControl();
  sectorEntryType: string = null;
  locationEntryType: string = 'aims';
  documentEntryType: string = 'aims';
  funderEntryType: string = 'aims';

  permissions: any = [];
  selectedProjects: any = [];
  selectedProjectSectors: any = [];
  iatiProjects: any = [];
  aimsProjects: any = [];
  currencyList: any = [];
  sectorsList: any = [];
  locationsList: any = [];
  organizationsList: any = [];
  currentProjectSectorsList: any = [];
  currentProjectLocationsList: any = [];
  currentProjectDocumentsList: any = [];
  currentProjectFundersList: any = [];

  model = { id: 0, title: '',  startDate: null, endDate: null, description: null };
  sectorModel = { projectId: 0, sectorId: 0, sectorName: '', parentId: 0, fundsPercentage: 0.0, currency: '', exchangeRate: 0.0 };
  locationModel = { projectId: 0, locationId: null, latitude: 0.0, longitude: 0.0, location: '', fundsPercentage: 0.0 };
  documentModel = { id: 0, projectId: 0, documentTitle: null, documentUrl: null };
  funderModel = { id: 0, projectId: 0, funderName: null, funderId: null, amount: 0.00, currency: null, exchangeRate: 0.00};
  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' }
  ];

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private sectorService: SectorService, 
    private router: Router, private fb: FormBuilder, private infoModal: InfoModalComponent,
    private locationService: LocationService, private securityService: SecurityHelperService,
    private organizationService: OrganizationService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.requestNo = this.storeService.getCurrentRequestId();
    var projectId = localStorage.getItem('active-project');
    if (projectId && projectId != '0') {
      this.isForEdit = true;
      this.activeProjectId = parseInt(projectId);
      this.model.id = this.activeProjectId;
      this.btnProjectText = 'Edit Project';
      this.loadProjectData(this.activeProjectId);
    }

    this.sectorSelectionForm = this.fb.group({
      sectorInput: null,
      parentSectorInput: null
    });

    this.locationSelectionForm = this.fb.group({
      locationInput: null,
    });

    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;

      setTimeout(() => {
        this.storeService.newInfoMessage('');
        this.showMessage = false;
      }, Settings.displayMessageTime);
    }

    var projects = localStorage.getItem('selected-projects');
    if (projects)
    {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;
      this.currencyList = this.storeService.getCurrencyList();

      //Load iati projects
      var filteredIATI = this.selectedProjects.filter(function(project) {
        return project.type == 'IATI';
      });

      var iatiIdsArr = [];
      filteredIATI.forEach(function(project) {
        var obj = { identifier: project.identifier };
        iatiIdsArr.push(obj);
      });
      this.loadIATIProjectsForIds(iatiIdsArr);

      //Load aims projects
      var filteredAIMS = this.selectedProjects.filter(function(project) {
        return project.type == 'AIMS';
      });
      var aimsIdsArr = [];
      filteredAIMS.forEach(function(project) {
        var id = project.identifier;
        aimsIdsArr.push(id);
      });
      this.loadAIMSProjectsForIds(aimsIdsArr);
    }

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });

    this.loadSectorsList();
    this.loadLocationsList();
  }

  loadIATIProjectsForIds(modelArr: any) {
    this.iatiService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.iatiProjects = data;
        console.log(this.iatiProjects);
      },
      error => {
        console.log(error);
      }
    )
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.aimsProjects = data;
        console.log(this.aimsProjects);
      },
      error => {
        console.log(error);
      }
    )
  }

  loadSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectorsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  enterProjectAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.title = selectedProject[0].title;
      this.model.description = selectedProject[0].description;
      var sDate = new Date(selectedProject[0].startDate);
      var eDate = new Date(selectedProject[0].endDate);
      this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
      this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
    }
  }

  enterProjectIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.model.title = selectedProject[0].title;
      this.model.description = selectedProject[0].description;
    }
  }

  enterIATISector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var code = arr[2];
    this.sectorPlaceHolder = 'Select Parent Sector';

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var sectors = selectProject[0].sectors;
      if (sectors && sectors.length > 0) {
        this.sectorEntryType = 'iati';
        var selectSector = sectors.filter(s => s.code == code);
        if (selectSector && selectSector.length > 0) {
          this.isSectorVisible = true;
          this.sectorModel.sectorName = selectSector[0].sectorName;
          this.sectorModel.fundsPercentage = selectSector[0].fundsPercentage;
        }
      }
    }
  }

  enterAIMSSector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var sectorId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var sectors = selectProject[0].sectors;
      if (sectors && sectors.length > 0) {
        var selectSector = sectors.filter(s => s.id == sectorId);
        if (selectSector && selectSector.length > 0) {
          this.sectorEntryType = 'aims';
          this.isSectorVisible = true;
          var sectorObj = { id: selectProject[0].id, sectorName: selectSector[0].sectorName }
          this.sectorInput.setValue(sectorObj);
          this.sectorModel.fundsPercentage = selectSector[0].fundsPercentage;
        }
      }
    }
  }

  enterIATILocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var location = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var locations = selectProject[0].locations;
      this.locationEntryType = 'iati';
      var selectLocation = locations.filter(s => s.name == location);
      if (selectLocation && selectLocation.length > 0) {
        this.locationModel.location = selectLocation[0].name;
        this.locationModel.latitude = selectLocation[0].latitude;
        this.locationModel.longitude = selectLocation[0].longitude;
      }
    }
  }

  enterAIMSLocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var locationId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var locations = selectProject[0].locations;
      if (locations && locations.length > 0) {
        var selectLocation = locations.filter(l => l.id == locationId);
        if (selectLocation && selectLocation.length > 0) {
          this.locationEntryType = 'aims';
          var dbLocation = this.locationsList.filter(l => l.location == selectLocation[0].location);
          if (dbLocation) {
            this.locationModel.locationId = dbLocation[0].id;
          }
        }
      }
    }
  }

  enterIATIDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var documents = selectProject[0].documents;
      this.documentEntryType = 'iati';
      var selectDocument = documents.filter(d => d.id == documentId);
      if (selectDocument && selectDocument.length > 0) {
        this.documentModel.id = selectDocument[0].id;
        this.documentModel.documentTitle = selectDocument[0].documentTitle;
        this.documentModel.documentUrl = selectDocument[0].documentUrl;
      }
    }
  }

  enterAIMSDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var documents = selectProject[0].documents;
      if (documents && documents.length > 0) {
        var selectDocument = documents.filter(d => d.id == documentId);
        if (selectDocument && selectDocument.length > 0) {
          this.locationEntryType = 'aims';
          var dbDocument = documents.filter(d => d.id == documentId);
          if (dbDocument) {
            this.documentModel.documentTitle = dbDocument[0].documentTitle;
            this.documentModel.documentUrl = dbDocument[0].documentUrl;
          }
        }
      }
    }
  }

  enterIATIFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var funders = selectProject[0].participatingOrganizations;
      this.funderEntryType = 'iati';
      var selectFunder = funders.filter(f => f.id == funderId);
      if (selectFunder && selectFunder.length > 0) {
        this.funderModel.funderName = selectFunder[0].name;
      }
    }
  }

  enterAIMSFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var funders = selectProject[0].funders;
      if (funders && funders.length > 0) {
        var selectFunder = funders.filter(f => f.id == funderId);
        if (selectFunder && selectFunder.length > 0) {
          this.funderEntryType = 'aims';
          var dbFunder = funders.filter(f => f.id == funderId);
          if (dbFunder) {
            this.funderModel.funderId = dbFunder[0].funderId;
          }
        }
      }
    }
  }

  loadProjectData(id: number) {
    this.projectService.getProjectProfileReport(id.toString()).subscribe(
      result => {
        if (result.projectProfile) {
          var data = result.projectProfile;
          //Setting project data
          this.model.title = data.title;
          this.model.description = data.description;
          var sDate = new Date(data.startDate);
          var eDate = new Date(data.endDate);
          this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
          this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
          
          //Setting sectors data
          if (data.sectors && data.sectors.length > 0) {
            this.currentProjectSectorsList = data.sectors;
          }

          if (data.locations && data.locations.length > 0) {
            this.currentProjectLocationsList = data.locations;
          }

          if (data.documents && data.documents.length > 0) {
            this.currentProjectDocumentsList = data.documents;
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  showProjects() {
    this.manageTabsDisplay('project');
  }

  showSectors() {
    this.manageTabsDisplay('sector');
  }

  showLocations() {
    this.manageTabsDisplay('location');
  }

  showFunders() {
    this.manageTabsDisplay('funder');
  }

  showImplementers() {
    this.manageTabsDisplay('implementer');
  }

  showDocuments() {
    this.manageTabsDisplay('document');
  }

  manageTabsDisplay(tabIdentity) {
    for(var i=0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  /*Project sectors filtering and display functions*/
  displaySectorFn(sector?: Sector): string | undefined {
    if (sector) {
      this.selectedSectorId = sector.id;
    } else {
      this.selectedSectorId = 0;
    }
    return sector ? sector.sectorName : undefined;
  }

  private filterSectors(value: string): Sector[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.sectorsList.filter(sector => sector.sectorName.toLowerCase().indexOf(filterValue) !== -1);
    }
  }
  /*End of project sectors filtering and display functions*/

  /*Project locations filtering and display functions*/
  displayLocationFn(location?: Location): string | undefined {
    if (location) {
      this.selectedLocationId = location.id;
    } else {
      this.selectedLocationId = 0;
    }
    return location ? location.location : undefined;
  }

  private filterLocations(value: string): Location[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.locationsList.filter(location => location.location.toLowerCase().indexOf(filterValue) !== -1);
    }
  }
  /*End of project locations filtering and display functions*/

  /* Saving different section of project */
  saveProject() {
    var startDate = this.model.startDate.year + '-' + this.model.startDate.month + '-' + 
          this.model.startDate.day;
    var endDate = this.model.endDate.year + '-' + this.model.endDate.month + '-' + 
          this.model.endDate.day;

    var model = {
      Title: this.model.title,
      StartDate: startDate,
      EndDate: endDate,
      Description: this.model.description
    };

    this.isProjectBtnDisabled = true;
    if (this.isForEdit) {
      this.btnProjectText = 'Updating...';
      this.blockUI.start('Updating Project...');
      this.projectService.updateProject(this.activeProjectId, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Project' + Messages.RECORD_UPDATED;
            this.infoMessage = message;
            this.activeProjectId = data;
            this.infoModal.openModal();
            this.resetProjectEntry();
          } else {
            this.resetProjectEntry();
          }
          this.blockUI.stop();
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.blockUI.stop();
        }
      );
    } else {
      this.btnProjectText = 'Saving...';
      this.blockUI.start('Saving Project');
      this.projectService.addProject(model).subscribe(
        data => {
          this.resetProjectEntry();
          if (!this.isError) {
            var message = 'New project' + Messages.NEW_RECORD;
            this.infoMessage = message;
            localStorage.setItem('active-project', data);
            this.infoModal.openModal();
            this.btnProjectText = 'Edit Project';
          } else {
          }
          this.blockUI.stop();
        },
        error => {
          this.resetProjectEntry();
          this.errorMessage = error;
          this.isError = true;
          this.blockUI.stop();
        }
      );
    }
  }

  /** Managing sectors */
  saveProjectSector() {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.sectorModel.projectId = projectId;
    } else {
      //Need to show dialog here
      return false;
    }

    var projectSectorModel = {
      projectId: projectId,
      sectorId: this.selectedSectorId,
      fundsPercentage: this.sectorModel.fundsPercentage,
      currency: this.sectorModel.currency,
      exchangeRate: this.sectorModel.exchangeRate
    };

    var dbSector = this.sectorInput.value;
    var searchSector = '';
    if (dbSector) {
      searchSector = dbSector.sectorName;
    }
    var getSector = this.sectorsList.filter(sector => sector.sectorName == searchSector);

    this.blockUI.start('Saving Sector...');
    if (this.sectorEntryType == 'iati') {
      var sectorModel = {
        sectorName: this.sectorModel.sectorName,
        parentId: 0
      };

      if (this.selectedSectorId != 0 && getSector.length > 0) {
        sectorModel.parentId = this.selectedSectorId;
      }

      this.sectorService.addSector(sectorModel).subscribe(
        data => {
          this.sectorModel.sectorId = data;
          this.selectedSectorId = data;
          projectSectorModel.sectorId = data;
          this.addProjectSector(projectSectorModel);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.addProjectSector(projectSectorModel);
    }
  }

  addProjectSector(model: any) {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.sectorModel.projectId = projectId;
    }

    this.projectService.addProjectSector(model).subscribe(
      data => {
        var sectorObj = {
          projectId: projectId,
          sectorId: model.sectorId,
          sector: this.sectorModel.sectorName,
          fundsPercentage: this.sectorModel.fundsPercentage,
          currency: this.sectorModel.currency,
          exchangeRate: this.sectorModel.exchangeRate
        };
        this.currentProjectSectorsList.push(sectorObj);
        this.resetSectorEntry();
        this.blockUI.stop();
        var message = 'New sector' + Messages.NEW_RECORD;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectSector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var sectorId = arr[2];

    this.blockUI.start('Removing Sector...');
    this.projectService.deleteProjectSector(projectId, sectorId).subscribe(
      data => {
        this.currentProjectSectorsList = this.currentProjectSectorsList.filter(s => s.sectorId != sectorId);
        this.blockUI.stop();
        var message = 'Selected sector ' + Messages.RECORD_DELETED;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }
  /**End of managing sectors */

  /**Managing Locations */
  saveProjectLocation() {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.locationModel.projectId = projectId;
    } else {
      //Need to show dialog here
      return false;
    }

    var projectLocationModel = {
      projectId: projectId,
      locationId: this.locationModel.locationId,
      fundsPercentage: this.locationModel.fundsPercentage,
    };

    var searchLocation = this.locationModel.location;
    if (searchLocation != '') {
      var getLocation = this.locationsList.filter(location => location.location == searchLocation);
      if (getLocation && getLocation.length > 0) {
        projectLocationModel.locationId = getLocation[0].id;
      }
    }

    if (this.locationModel.locationId != 0 || this.locationModel.locationId != null) {
      var getLocation = this.locationsList.filter(location => location.id == this.locationModel.locationId);
      if (getLocation && getLocation.length > 0) {
        this.locationModel.location = getLocation[0].location;
      }
    }
    
    this.blockUI.start('Saving Location...');
    if (this.locationEntryType == 'iati' && projectLocationModel.locationId <= 0) {
      var locationModel = {
        location: searchLocation,
        latitude: this.locationModel.latitude,
        longitude: this.locationModel.longitude
      };

      this.locationService.addLocation(locationModel).subscribe(
        data => {
          this.locationModel.locationId = data;
          this.selectedLocationId = data;
          projectLocationModel.locationId = data;
          this.addProjectLocation(projectLocationModel);
        },
        error => {
          console.log(error);
        }
      )
    } else {
      this.addProjectLocation(projectLocationModel);
    }
  }

  addProjectLocation(model: any) {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.locationModel.projectId = projectId;
    }

    this.projectService.addProjectLocation(model).subscribe(
      data => {
        var locationObj = {
          id: this.locationModel.locationId,
          projectId: projectId,
          sectorId: model.sectorId,
          location: this.locationModel.location,
          latitude: this.locationModel.latitude,
          longitude: this.locationModel.longitude,
          fundsPercentage: this.locationModel.fundsPercentage,
        };
        this.currentProjectLocationsList.push(locationObj);
        this.resetLocationEntry();
        this.blockUI.stop();
        var message = 'New location' + Messages.NEW_RECORD;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectLocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var locationId = arr[2];

    this.blockUI.start('Removing Location...');
    this.projectService.deleteProjectLocation(projectId, locationId).subscribe(
      data => {
        this.currentProjectLocationsList = this.currentProjectLocationsList.filter(l => l.id != locationId);
        this.blockUI.stop();
        var message = 'Selected location ' + Messages.RECORD_DELETED;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project locations */


  /**Managing Documents */
  saveProjectDocument() {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.documentModel.projectId = projectId;
    } else {
      //Need to show dialog here
      return false;
    }
    
    var model = {
      id: 0,
      projectId: this.documentModel.projectId,
      documentTitle: this.documentModel.documentTitle,
      documentUrl: this.documentModel.documentUrl
    }
    this.blockUI.start('Saving Document...');
    this.projectService.addProjectDocument(model).subscribe(
      data => {
        model.id = data;
        this.currentProjectDocumentsList.push(model);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }


  deleteProjectDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    this.blockUI.start('Removing Document...');
    this.projectService.deleteProjectDocument(documentId).subscribe(
      data => {
        this.currentProjectDocumentsList = this.currentProjectDocumentsList.filter(d => d.id != documentId);
        this.blockUI.stop();
        var message = 'Selected document ' + Messages.RECORD_DELETED;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project documents */

  /**Managing Funders */
  saveProjectFunder() {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;
    
    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.funderModel.projectId = projectId;
    } else {
      //Need to show dialog here
      return false;
    }
    
    this.blockUI.start('Saving Funder...');
    var model = {
      id: 0,
      projectId: this.funderModel.projectId,
      funderId: this.funderModel.funderId,
      amount: this.funderModel.amount,
      currency: this.funderModel.currency,
      exchangeRate: this.funderModel.exchangeRate
    }

    if (this.funderEntryType == 'iati') {
      if (this.funderModel.funderName == null || this.funderModel.funderName.length == 0) {
        //Show error dialog
        return false;
      } else {
        var funderModel = {
          Name: this.funderModel.funderName
        }
        this.organizationService.addOrganization(funderModel).subscribe(
          data => {
            model.funderId = data;
            this.addProjectFunder(model);
          },
          error => {
            console.log(error);
          }
        )
      }
    } else {
      this.addProjectFunder(model);
    }
  }

  addProjectFunder(model: any) {
    this.projectService.addProjectFunder(model).subscribe(
      data => {
        model.id = data;
        this.currentProjectFundersList.push(model);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    this.blockUI.start('Removing Funder...');
    this.projectService.deleteProjectFunder(projectId, funderId).subscribe(
      data => {
        this.currentProjectFundersList = this.currentProjectFundersList.filter(f => f.id != funderId);
        this.blockUI.stop();
        var message = 'Selected funder ' + Messages.RECORD_DELETED;
        this.infoMessage = message;
        this.infoModal.openModal();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project documents */


  /*Reset form states*/
  resetProjectEntry() {
    if (this.activeProjectId != null && this.activeProjectId != 0) {
      this.btnProjectText = 'Edit Project';
    } else {
      this.btnProjectText = 'Save Project';
    }
    this.isProjectBtnDisabled = false;
  }

  resetSectorEntry() {
    this.isSectorVisible = false;
    this.sectorPlaceHolder = 'Enter/Select Sector';
    this.sectorModel.currency = '';
    this.sectorModel.exchangeRate = 0.00;
    this.sectorModel.fundsPercentage = 0.00;
    this.sectorModel.parentId = 0;
    this.sectorModel.projectId = 0;
    this.sectorModel.sectorId = 0;
    this.sectorModel.sectorName = '';
  }

  resetLocationEntry() {
    this.locationModel.fundsPercentage = 0.00;
    this.locationModel.projectId = 0;
    this.locationModel.locationId = 0;
    this.locationModel.location = '';
  }

}
