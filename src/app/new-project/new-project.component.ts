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
  selectedProjectOrgs: any = [];
  inputTextHolder: string = 'Setting up IATI...';
  counter: number = 0;
  btnText: string = 'Manual entry only';
  errorMessage: string = null;
  successMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  isSearchingProjects: boolean = false;
  isSearchedResults: boolean = false;
  startDateModel: NgbDateStruct;
  projectIdCounter: number = 0;
  timerCounter: number = 0;
  timeoutForSearch: number = 2000;
  isAIMSSearchInProgress: boolean = false;
  isProjectPermitted: boolean = true;
  timer: any = null;

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

  model = { id: 0, title: '', startDate: null, endDate: null, description: null, startingYear: 0, 
  endingYear: 0, selectedOrganizations: [], selectedSectors: [], selectedLocations: [] };

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
        this.isIATILoading = true;
        return event.target.value;
      })
      //,filter(res => res.length > 0)
      ,debounceTime(1000)        
      ,distinctUntilChanged()
      ).subscribe((text: string) => {
        this.filterIATIMatchingProjects(text);
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

  loadIATIProjects() {
    this.isIATILoading = true;
    var projectTitle = 'Enter keywords to search existing and source projects';
    this.iatiService.getProjects().subscribe(
      data => {
        if (data) {
          this.iatiProjects = data;
          this.filteredIatiProjects = data;
          console.log(data);
          this.filteredIatiProjects.forEach(function (p) {
            p.isMatched = false;
          }.bind(this));
        }
        this.isProjectLoaded = true;
        this.isTextReadOnly = false;
        this.inputTextHolder = projectTitle;
        this.isIATILoading = false;
      },
      error => {
        this.isProjectLoaded = true;
        this.isTextReadOnly = false;
        this.inputTextHolder = projectTitle;
        this.isIATILoading = false;
      }
    );
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectorsList = data;
      }
    );
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      }
    );
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      }
    );
  }

  filterMatchingProjects(e) {
    this.filterAIMSMatchingProjects(e);
    //this.filterIATIMatchingProjects(e);
  }

  filterIATIMatchingProjects(str) {
    var str = str.toLowerCase();
    if (this.iatiProjects.length > 0) {
      this.filteredIatiProjects = this.iatiProjects.filter(function (project) {
        if ((project.title.toLowerCase().indexOf(str) != -1) || (project.organizations.map(p => p.name).indexOf(str) != -1)) {
          //project.isMatched = true;
          return project;
        } 
      });
    }
    this.isIATILoading = false;
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
    this.isProjectPermitted = true;
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
    this.isProjectPermitted = true;
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
        },
        error => {
          this.isSearchingProjects = false;
        }
      );
    }
  }

  loadAIMSProjects() {
    this.isAIMSLoading = true;
    this.projectService.getProjectsList().subscribe(
      data => {
        this.aimsProjects = data;
        this.filteredAIMSProjects = data;
        this.isAIMSLoading = false;
      },
      error => {
        this.isAIMSLoading = false;
      }
    )
  }

  showProjectProfile(e) {
    var id = e.target.id;
    if (id) {
      this.closeModal('matching-projects');
      this.router.navigateByUrl('view-project/' + id);
    }
  }

  showProjectDescription(e) {
    var id = e.target.id;
    var project = this.filteredIatiProjects.filter(project => project.id == id);
    if (project && project.length) {
      this.selectedProjectTitle = project[0].title;
      this.selectedProjectDescription = (project[0].description) ? project[0].description : 'Not available';
      this.selectedProjectOrgs = project[0].organizations;
    }
    this.openModal('project-description');
  }

  showAIMSProjectDescription(e) {
    var id = e.target.id.split('-')[1];
    var project = this.filteredAIMSProjects.filter(project => project.id == id);
    if (project && project.length) {
      this.selectedProjectDescription = project[0].description;
    }
    this.openModal('project-description');
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

  editProject() {
    var aimsProject = this.selectedProjects.filter(p => p.type == 'AIMS');
    if (aimsProject.length > 0) {
      var id = aimsProject[0].identifier;
      localStorage.setItem('active-project', id);
      this.selectedProjects = this.selectedProjects.filter(p => p.identifier != id);
      var projects = JSON.stringify(this.selectedProjects);
      localStorage.setItem("selected-projects", projects);
      this.router.navigateByUrl('project-entry');
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
    this.router.navigateByUrl('project-entry');
  }

  proceedConfirmation() {
    this.proceedToDataEntry();
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
          setTimeout(() => {
            this.projectInfoModal.openModal();
            this.blockUI.stop();
          }, 1000);
        }
      );
    }



  }
}
