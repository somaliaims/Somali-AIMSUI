import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';
import { ProjectService } from '../services/project.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from '../config/messages';
import { Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { Sector } from '../models/sector-model';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent implements OnInit {
  activeProjectId: number = 0;
  selectedSectorId: number = 0;
  selectedParentSectorId: number = 0;
  btnProjectText: string = 'Save Project';
  btnProjectSectorText: string = 'Save Sector';
  sectorPlaceHolder: string = 'Enter/Select Sector';
  isProjectBtnDisabled: boolean = false;
  isProjectBtnSectorDisabled: boolean = false;
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
  parentSectorInput = new FormControl();
  sectorEntryType: string = null;

  selectedProjects: any = [];
  selectedProjectSectors: any = [];
  iatiProjects: any = [];
  aimsProjects: any = [];
  currencyList: any = [];
  sectorsList: any = [];
  currentProjectSectorsList: any = [];

  model = { id: 0, title: '',  startDate: null, endDate: null, description: null };
  sectorModel = { projectId: null, sectorId: 0, sectorName: '', parentId: 0, fundsPercentage: 0.0, currency: '', exchangeRate: 0.0 };
  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' }
  ];

  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private sectorService: SectorService, 
    private router: Router, private fb: FormBuilder, private infoModal: InfoModalComponent) { }

  ngOnInit() {
    var projectId = localStorage.getItem('active-project');
    if (projectId && projectId != '0') {
      this.isForEdit = true;
      this.activeProjectId = parseInt(projectId);
      this.btnProjectText = 'Edit Project';
      this.loadProjectData(this.activeProjectId);
    }

    this.sectorSelectionForm = this.fb.group({
      sectorInput: null,
      parentSectorInput: null
    });

    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
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
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectSectors(id) {
    this.projectService.getProjectSectors(id).subscribe(
      data => {

      },
      error => {

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

  /*Project sectors functions*/
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
  /*End of project sectors functions*/

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
      this.projectService.updateProject(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Project' + Messages.RECORD_UPDATED;
            this.infoMessage = message;
            this.activeProjectId = data;
            this.infoModal.openModal();
          } else {
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
        }
      );
    } else {
      this.btnProjectText = 'Saving...';
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
        },
        error => {
          this.resetProjectEntry();
          this.errorMessage = error;
          this.isError = true;
        }
      );
    }
  }

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

    var dbSector = this.sectorInput.value;
    var searchSector = '';
    if (dbSector) {
      searchSector = dbSector.sectorName;
    }
    var getSector = this.sectorsList.filter(sector => sector.sectorName == searchSector);
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
        },
        error => {
          console.log(error);
        }
      )
    }

    var projectSectorModel = {
      projectId: projectId,
      sectorId: this.selectedSectorId,
      fundsPercentage: this.sectorModel.fundsPercentage,
      currency: this.sectorModel.currency,
      exchangeRate: this.sectorModel.exchangeRate
    };

    this.projectService.addProjectSector(projectSectorModel).subscribe(
      data => {
        var sectorObj = {
          projectId: projectId,
          sectorId: data,
          sector: this.sectorModel.sectorName,
          fundsPercentage: this.sectorModel.fundsPercentage,
          currency: this.sectorModel.currency,
          exchangeRate: this.sectorModel.exchangeRate
        };
        this.currentProjectSectorsList.push(sectorObj);
        this.resetSectorEntry();
      },
      error => {
      }
    )
  }

  /*Reset form states*/
  resetProjectEntry() {
    this.btnProjectText = 'Save Project';
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

}
