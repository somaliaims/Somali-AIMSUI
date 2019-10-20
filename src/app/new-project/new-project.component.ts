import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { IATIService } from '../services/iati.service';
import { ModalService } from '../services/modal.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ProjectInfoModalComponent } from '../project-info-modal/project-info-modal.component';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FinancialYearService } from '../services/financial-year.service';
import { LocationService } from '../services/location.service';
import { SectorService } from '../services/sector.service';
import { OrganizationService } from '../services/organization-service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: []
})
export class NewProjectComponent implements OnInit {

  @ViewChild('title') title: ElementRef;
  @Input()
  displayTime: number = Settings.displayMessageTime;
  isProjectLoaded: boolean = false;
  isIATILoading: boolean = true;
  isAIMSLoading: boolean = false;
  isBtnDisabled: boolean = false;
  isTextReadOnly: boolean = true;
  selectedProjectTitle: string = null;
  selectedProjectDescription: string = null;
  selectedProjectOrganizations: any = [];
  selectedProjectLocations: any = [];
  selectedProjectSectors: any = [];
  inputTextHolder: string = 'Setting up IATI...';
  counter: number = 0;
  btnText: string = 'Manual entry only';
  errorMessage: string = null;
  successMessage: string = null;
  requestNo: number = 0;
  viewProjectId: number = 0;
  isError: boolean = false;
  isSearchingProjects: boolean = false;
  isSearchedResults: boolean = false;
  startDateModel: NgbDateStruct;
  projectIdCounter: number = 0;
  timerCounter: number = 0;
  timeoutForSearch: number = 1000;
  currentProjectId: number = 0;
  isAIMSSearchInProgress: boolean = false;
  isProjectPermitted: boolean = true;
  timer: any = null;
  pagingSize: number = Settings.rowsPerPage;
  isShowContact: boolean = false;
  userOrganizationId: number = 0;

  sectorsSettings: any = {};
  locationsSettings: any = {};
  organizationsSettings: any = {};
  yearsList: any = [];
  sectorsList: any = [];
  selectedSectors: any = [];
  organizationsList: any = [];
  selectedOrganizations: any = [];
  locationsList: any = [];
  selectedLocations: any = [];
  permissions: any = {};
  iatiProjects: any = [];
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  selectedProjects: any = [];
  selectedAIMSProjects: any = [];
  selectedIATIProjects: any = [];
  aimsProjects: any = [];
  userProjectIds: any = [];
  viewProject: any = [];
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewProjectDisbursements: any = [];
  viewProjectFields: any = [];

  @BlockUI() blockUI: NgBlockUI;

  model = {
    id: 0, title: '', startDate: null, endDate: null, description: null, startingYear: 0,
    endingYear: 0, selectedOrganizations: [], selectedSectors: [], selectedLocations: []
  };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private calendar: NgbCalendar,
    private storeService: StoreService, private iatiService: IATIService,
    private modalService: ModalService, private securityService: SecurityHelperService,
    private errorModal: ErrorModalComponent, private infoModal: InfoModalComponent,
    private projectInfoModal: ProjectInfoModalComponent, private locationService: LocationService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.userOrganizationId = (this.securityService.getUserOrganizationId()) ? parseInt(this.securityService.getUserOrganizationId()) : 0;
    this.requestNo = this.storeService.getCurrentRequestId();
    this.getFinancialYearsList();
    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadUserProjects();
    this.loadIATIProjects();
    this.loadAIMSProjects();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    localStorage.setItem('selected-projects', null);
    localStorage.setItem('active-project', '0');

    //Register keyup event for search bar
    fromEvent(this.title.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      //,filter(res => res.length > 0)
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.filterProjectMatches();
    });

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      data => {
        if (data) {
          this.userProjectIds = data;
        }
      }
    );
  }

  checkIfPermitted(id) {
    return (this.userProjectIds.map(p => p.id).indexOf(id) == -1) ? true : false;
  }

  checkIfCanMerge() {
    var canMerge = true;
    if (this.userProjectIds.length == 0) {
      return false;
    }
    
    var selectedIds = this.selectedAIMSProjects.map(p => p.id);
    selectedIds.forEach((id) => {
      if (this.userProjectIds.map(p => p.id).indexOf(id) == -1) {
        canMerge = false;
      }
    });
    return canMerge;
  }

  loadIATIProjects() {
    this.isIATILoading = true;
    var projectTitle = 'Enter keywords to search existing and source projects';
    this.iatiService.getProjects().subscribe(
      data => {
        if (data) {
          this.iatiProjects = data;
          this.filteredIatiProjects = data;
          this.filteredIatiProjects.forEach(function (p) {
            p.isMatched = false;
          }.bind(this));
        }
        this.isProjectLoaded = true;
        this.isTextReadOnly = false;
        this.inputTextHolder = projectTitle;
        this.isIATILoading = false;

        if (!this.isAIMSLoading) {
          if (this.organizationsList && this.organizationsList.length > 0) {
            var org = this.organizationsList.filter(o => o.id == this.userOrganizationId);
            this.model.selectedOrganizations.push(org[0]);
            if (org.length > 0) {
              setTimeout(() => {
                this.filterProjectMatches();
              }, 1000);
              
            }
          }
        }
      }
    );
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        if (data) {
          this.sectorsList = data;
        }
      }
    );
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
        }
      }
    );
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
        }
      }
    );
  }

  onItemSelect() {
      this.filterProjectMatches();
  }

  onItemDeSelect() {
    this.filterProjectMatches();
  }

  onItemSelectAll() {
    setTimeout(() => {
      this.filterProjectMatches();
    }, 500);
  }

  onItemDeSelectAll() {
    setTimeout(() => {
      this.filterProjectMatches();
    }, 500);
  }

  filterProjectMatches() {
    var str = this.model.title;

    if (this.model.title) {
      str = str.toLowerCase();
      this.filteredIatiProjects = this.iatiProjects.filter(project => project.title.toLowerCase().indexOf(str) != -1);
      this.filteredAIMSProjects = this.aimsProjects.filter(project => project.title.toLowerCase().indexOf(str) != -1);
    } else {
      this.filteredIatiProjects = this.iatiProjects;
      this.filteredAIMSProjects = this.aimsProjects;
    }

    if (this.model.selectedOrganizations.length > 0) {
      var orgs = this.model.selectedOrganizations.map(o => o.organizationName);
      //IATI
      this.filteredIatiProjects = this.iatiProjects.filter(function (project) {
        var isMatched = false;
        var projectOrgs = project.organizations.map(o => o.name);
        for (var i = 0; i < projectOrgs.length; i++) {
          if (orgs.includes(projectOrgs[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));

      //AIMS
      this.filteredAIMSProjects = this.aimsProjects.filter(function (project) {
        var isMatched = false;
        var projectOrgs = project.organizations.map(o => o.name);
        for (var i = 0; i < projectOrgs.length; i++) {
          if (orgs.includes(projectOrgs[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));
    }

    //IATI
    if (this.model.selectedSectors.length > 0) {
      var sectors = this.model.selectedSectors.map(s => s.sectorName);
      //IATI
      this.filteredIatiProjects = this.iatiProjects.filter(function (project) {
        var isMatched = false;
        var projectSectors = project.sectors.map(o => o.name);
        for (var i = 0; i < projectSectors.length; i++) {
          if (sectors.includes(projectSectors[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));

      //AIMS
      this.filteredAIMSProjects = this.aimsProjects.filter(function (project) {
        var isMatched = false;
        var projectSectors = project.sectors.map(o => o.name);
        for (var i = 0; i < projectSectors.length; i++) {
          if (sectors.includes(projectSectors[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));
    }

    //IATI
    if (this.model.selectedLocations.length > 0) {
      var locations = this.model.selectedLocations.map(l => l.location);
      //IATI
      this.filteredIatiProjects = this.iatiProjects.filter(function (project) {
        var isMatched = false;
        var projectLocations = project.locations.map(o => o.name);
        for (var i = 0; i < projectLocations.length; i++) {
          if (locations.includes(projectLocations[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));

      //AIMS
      this.filteredAIMSProjects = this.aimsProjects.filter(function (project) {
        var isMatched = false;
        var projectLocations = project.locations.map(o => o.name);
        for (var i = 0; i < projectLocations.length; i++) {
          if (locations.includes(projectLocations[i])) {
            isMatched = true;
            break;
          }
        }
        if (isMatched) {
          return project;
        }
      }.bind(this));
    }

    if (this.model.startingYear != 0) {
      this.filteredIatiProjects = this.iatiProjects.filter((project) => {
        if (Date.parse(project.startDate)) {
          var dated = new Date(project.startDate);
          var year = dated.getFullYear();
          if (year >= this.model.startingYear) {
            return project;
          }
        }
      });

      this.filteredAIMSProjects = this.aimsProjects.filter((project) => {
        var dated = new Date(project.startDate);
        var year = dated.getFullYear();
        if (year >= this.model.startingYear) {
          return project;
        }
      });
    }

    if (this.model.endingYear != 0) {
      this.filteredIatiProjects = this.iatiProjects.filter((project) => {
        if (Date.parse(project.startDate)) {
          var dated = new Date(project.startDate);
          var year = dated.getFullYear();
          if (year <= this.model.endingYear) {
            return project;
          }
        }
      });

      this.filteredAIMSProjects = this.aimsProjects.filter((project) => {
        var dated = new Date(project.endDate);
        var year = dated.getFullYear();
        if (year <= this.model.endingYear) {
          return project;
        }
      });
    }
  }

  filterAIMSMatchingProjects(e) {
    this.isAIMSLoading = true;
    var str = e.target.value.toLowerCase();
    if (this.aimsProjects.length > 0) {
      this.filteredAIMSProjects = this.aimsProjects.filter(project =>
        project.title.toLowerCase().indexOf(str) != -1);
    }
    this.isAIMSLoading = false;
  }

  selectIATIProject(e) {
    //this.isProjectPermitted = true;
    var id = e.target.id;
    var selectedProject = this.filteredIatiProjects.filter(
      iati => iati.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var iatiProject = { id: this.projectIdCounter, pid: 0, title: '', identifier: '', description: '', type: 'IATI' };
      iatiProject.title = selectedProject[0].title;
      iatiProject.description = selectedProject[0].description;
      iatiProject.identifier = selectedProject[0].iatiIdentifier;
      iatiProject.pid = selectedProject[0].id;
      this.addProject(iatiProject);
      this.selectedIATIProjects.push(selectedProject[0]);
    }
  }

  selectAIMSProject(e) {
    //this.isProjectPermitted = true;
    var id = e.target.id.split('-')[1];
    var selectedProject = this.filteredAIMSProjects.filter(
      aims => aims.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var aimsProject = { id: this.projectIdCounter, pid: 0, identifier: '', title: '', description: '', type: 'AIMS' };
      aimsProject.title = selectedProject[0].title;
      aimsProject.description = selectedProject[0].description;
      aimsProject.identifier = selectedProject[0].id;
      aimsProject.pid = selectedProject[0].id;
      this.addProject(aimsProject);
      this.selectedAIMSProjects.push(selectedProject[0]);
      if (this.selectedAIMSProjects.length == 1) {
        this.isProjectPermitted = this.checkIfProjectPermittedToUser(id);
      }
    }
  }

  getFinancialYearsList() {
    this.fyService.getYearsList().subscribe(
      data => {
        if (data) {
          this.yearsList = data;
        }
      }
    );
  }

  searchAIMSProject() {
    if (this.model.title != null) {
      this.isSearchingProjects = true;

      this.projectService.filterProjects(this.model.title).subscribe(
        data => {
          this.isSearchingProjects = false;
          if (data && data.length) {
            this.filteredAIMSProjects = data
            this.isSearchingProjects = false;
          } else {
            setTimeout(() => {
              this.isSearchingProjects = false;
            }, this.displayTime);
          }
        }
      );
    }
  }

  loadAIMSProjects() {
    this.isAIMSLoading = true;
    this.projectService.getProjectsWithDetail().subscribe(
      data => {
        if (data) {
          this.aimsProjects = data;
          this.filteredAIMSProjects = data;
          this.isAIMSLoading = false;

          if (!this.isIATILoading) {
            if (this.organizationsList && this.organizationsList.length > 0) {
              var org = this.organizationsList.filter(o => o.id == this.userOrganizationId);
              if (org.length > 0) {
                this.model.selectedOrganizations.push(org[0]);
                setTimeout(() => {
                  this.filterProjectMatches();
                }, 1000);
              }
            }
          }
        }
      }
    );
  }

  showProjectProfile(e) {
    var id = e.target.id;
    if (id) {
      this.closeModal('matching-projects');
      this.router.navigateByUrl('view-project/' + id);
    }
  }

  showProjectDescription(e) {
    this.blockUI.start('Loading...');
    setTimeout(() => {
    }, 1000);
    var id = e.target.id;
    this.currentProjectId = id;
    var project = this.filteredIatiProjects.filter(project => project.id == id);
    if (project && project.length) {
      this.selectedProjectTitle = project[0].title;
      this.selectedProjectDescription = (project[0].description) ? project[0].description : 'Not available';
      this.selectedProjectOrganizations = project[0].organizations;
      this.selectedProjectSectors = project[0].sectors;
      this.selectedProjectLocations = project[0].locations;
    }
    this.openModal('project-description');
    this.blockUI.stop();
  }

  showAIMSProjectDescription(e) {
    this.blockUI.start('Loading...');
    setTimeout(() => {
    }, 1000);
    var id = e.target.id.split('-')[1];
    this.currentProjectId = id;
    var project = this.filteredAIMSProjects.filter(project => project.id == id);
    if (project && project.length) {
      this.selectedProjectTitle = project[0].title;
      this.selectedProjectDescription = (project[0].description) ? project[0].description : 'Not available';
      this.selectedProjectOrganizations = project[0].organizations;
      this.selectedProjectSectors = project[0].sectors;
      this.selectedProjectLocations = project[0].locations;
    }
    this.isShowContact = this.isShowContactToUser(parseInt(id));
    this.openModal('project-description');
    this.blockUI.stop();
  }

  contactProject(id) {
    if (id != 0) {
      this.router.navigateByUrl('contact-project/' + id);
    }
  }

  addProject(project) {
    this.selectedProjects.push(project);
  }

  showSelectedProjectDescription(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);

    if (project.length > 0) {
      this.selectedProjectDescription = project[0].description;
    }
    this.openModal('project-description');
  }

  countAIMSProjects() {
    if (this.selectedProjects.length == 0)
      return 0;

    var aimsProjects = this.selectedProjects.filter(p => p.type == 'AIMS');
    return aimsProjects.length;
  }

  countIATIProjects() {
    if (this.selectedProjects.length == 0)
      return 0;

    var iatiProjects = this.selectedProjects.filter(p => p.type == 'IATI');
    return iatiProjects.length;
  }

  editProject() {
    var aimsProject = this.selectedProjects.filter(p => p.type == 'AIMS');
    if (aimsProject.length > 0) {
      var id = aimsProject[0].identifier;
      localStorage.setItem('active-project', id);
      this.selectedProjects = this.selectedProjects.filter(p => p.identifier != id);
      var projects = JSON.stringify(this.selectedProjects);
      localStorage.setItem("selected-projects", projects);
      //this.router.navigateByUrl('project-entry');
      this.router.navigateByUrl('data-entry');
    }
  }

  applyForMembership() {
    var aimsProject = this.selectedProjects.filter(p => p.type == 'AIMS');
    if (aimsProject.length > 0) {
      var id = aimsProject[0].identifier;
      if (id) {
        this.router.navigateByUrl('/project-membership/' + id);
      }
    }
  }

  mergeProjects() {
    var projects = JSON.stringify(this.selectedProjects);
    localStorage.setItem("merge-projects", projects);
    this.router.navigateByUrl('merge-projects');
  }

  removeSelectedProject(e) {
    var id = e.target.id;
    var projectArr = this.selectedProjects.filter(p => p.pid == id);
    if (projectArr.length > 0) {
      var project = projectArr[0];
      if (project.type == 'AIMS') {
        this.selectedAIMSProjects = this.selectedAIMSProjects.filter(p => p.id != id);
        if (this.selectedAIMSProjects.length == 1) {
          this.isProjectPermitted = this.checkIfProjectPermittedToUser(this.selectedAIMSProjects[0].id);
        }
      } else {
        this.selectedIATIProjects = this.selectedIATIProjects.filter(p => p.id != id);
      }
    }
    this.selectedProjects = this.selectedProjects.filter(p => p.pid != id);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  proceedToDataEntry() {
    var projects = JSON.stringify(this.selectedProjects);
    localStorage.setItem("selected-projects", projects);
    //this.router.navigateByUrl('project-entry');
    this.router.navigateByUrl('data-entry');
  }

  closeConfirmationModal() {
    this.modalService.close('confirmation-modal');
  }

  checkIfIATIAdded(title) {
    var isAddedAims = this.aimsProjects.filter(p => p.title == title);
    if (isAddedAims.length > 0) {
      return 'Use again';
    }
    return 'Select';
  }

  checkIfIATIEntered(title) {
    var isAddedSelected = this.selectedIATIProjects.filter(p => p.title == title);
    if (isAddedSelected.length > 0) {
      return true;
    }
    return false;
  }

  checkAIMSAdded(title) {
    var isAddedSelected = this.selectedAIMSProjects.filter(p => p.title == title);
    if (isAddedSelected.length > 0) {
      return true;
    }
    return false;
  }

  checkIfProjectPermittedToUser(id) {
    return this.userProjectIds.filter(p => p.id == id).length > 0 ? true : false;
  }

  applyForProjectMembership(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId) {
      this.blockUI.start('Wait submitting request...');
      this.projectService.applyForProjectMembership(projectId).subscribe(
        data => {
          if (data) {
            this.successMessage = Messages.MEMBERSHIP_REQUEST_MESSAGE;
            this.infoModal.openModal();
          }
          this.blockUI.stop();
        }
      );
    }
  }

  loadAIMSProjectData(e) {
    var projectId = e.target.id.split('-')[1];

    if (projectId) {
      this.viewProjectId = projectId;
      this.blockUI.start('Loading project data...')
      this.projectService.getProjectProfileReport(projectId).subscribe(
        result => {
          if (result && result.projectProfile) {
            var data = result.projectProfile;
            this.viewProject = data;

            //Setting sectors data
            if (data.sectors && data.sectors.length > 0) {
              this.viewProjectSectors = data.sectors;
            }

            if (data.locations && data.locations.length > 0) {
              this.viewProjectLocations = data.locations;
            }

            if (data.documents && data.documents.length > 0) {
              this.viewProjectDocuments = data.documents;
            }

            if (data.funders && data.funders.length > 0) {
              this.viewProjectFunders = data.funders;
            }

            if (data.implementers && data.implementers.length > 0) {
              this.viewProjectImplementers = data.implementers;
            }

            if (data.disbursements && data.disbursements.length > 0) {
              this.viewProjectDisbursements = data.disbursements;
            }

            if (data.customFields && data.customFields.length > 0) {
              this.viewProjectFields = data.customFields;
            }
          }
          this.isShowContact = this.isShowContactToUser(projectId);
          
          setTimeout(() => {
            this.projectInfoModal.openModal();
            this.blockUI.stop();
          }, 1000);
        }
      );
    }
  }

  isShowContactToUser(id: number) {
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? false : true;
  }

  getLongDateString(dated) {
    return this.storeService.getLongDateString(dated);
  }
}
