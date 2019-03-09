import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: []
})
export class NewProjectComponent implements OnInit {

  @Input()
  displayTime: number = Settings.displayMessageTime;
  isProjectLoaded: boolean = false;
  isIATILoading: boolean = true;
  isAIMSLoading: boolean = false;
  isBtnDisabled: boolean = false;
  isTextReadOnly: boolean = true;
  selectedProjectDescription: string = '';
  inputTextHolder: string = 'Setting up IATI...';
  counter: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  requestNo: number = 0;
  isError: boolean = false;
  isSearchingProjects: boolean = false;
  isSearchedResults: boolean = false;
  startDateModel: NgbDateStruct;
  projectIdCounter: number = 0;
  timerCounter: number = 0;
  timeoutForSearch: number = 2000;
  isAIMSSearchInProgress: boolean = false;
  timer: any = null;

  permissions: any = [];
  iatiProjects: any = [];
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  selectedProjects: any = [];
  aimsProjects: any = [];

  model = { id: 0, title: '', startDate: null, endDate: null, description: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private calendar: NgbCalendar,
    private storeService: StoreService, private iatiService: IATIService,
    private modalService: ModalService, private securityService: SecurityHelperService,
    private errorModal: ErrorModalComponent) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.requestNo = this.storeService.getCurrentRequestId();
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
  }

  loadIATIProjects() {
    this.isIATILoading = true;
    var projectTitle = 'Enter keywords to search existing and source projects';
    this.iatiService.getProjects().subscribe(
      data => {
        if (data) {
          this.iatiProjects = data;
          this.filteredIatiProjects = data;
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
    )
  }

  filterMatchingProjects(e) {
    this.filterAIMSMatchingProjects(e);
    this.filterIATIMatchingProjects(e);
  }

  filterIATIMatchingProjects(e) {
    this.isIATILoading = true;
    var str = e.target.value.toLowerCase();
    if (this.iatiProjects.length > 0) {
      this.filteredIatiProjects = this.iatiProjects.filter(project =>
        project.title.toLowerCase().indexOf(str) != -1);
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
    var id = e.target.id;
    var selectedProject = this.filteredIatiProjects.filter(
      iati => iati.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var iatiProject = { id: this.projectIdCounter, title: '', identifier: '', description: '', type: 'IATI' };
      iatiProject.title = selectedProject[0].title;
      iatiProject.description = selectedProject[0].description;
      iatiProject.identifier = selectedProject[0].iatiIdentifier;
      this.addProject(iatiProject);
    }
  }

  selectAIMSProject(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.filteredAIMSProjects.filter(
      aims => aims.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var aimsProject = { id: this.projectIdCounter, identifier: '', title: '', description: '', type: 'AIMS' };
      aimsProject.title = selectedProject[0].title;
      aimsProject.description = selectedProject[0].description;
      aimsProject.identifier = selectedProject[0].id;
      this.addProject(aimsProject);
    }
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
        console.log(error);
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
      this.selectedProjectDescription = project[0].description;
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

  removeSelectedProject(e) {
    var id = e.target.id;
    this.selectedProjects = this.selectedProjects.filter(p => p.id != id);
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
    if (this.selectedProjects.length == 0) {
      this.modalService.open('confirmation-modal');
    } else {
      this.proceedToDataEntry();
    }
  }

  closeConfirmationModal() {
    this.modalService.close('confirmation-modal');
  }

}
