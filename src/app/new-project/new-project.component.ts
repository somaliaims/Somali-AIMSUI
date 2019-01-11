import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { IATIService } from '../services/iati.service';
import { ModalService } from '../services/modal.service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: []
})
export class NewProjectComponent implements OnInit {

  @Input()
  isProjectLoaded: boolean = false;
  isIATILoading: boolean = false;
  isBtnDisabled: boolean = false;
  isTextReadOnly: boolean = true;
  selectedProjectDescription: string = '';
  inputTextHolder: string = 'Setting up IATI...';
  counter: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  iatiProjects: any = [];
  filteredIatiProjects: any = [];
  matchingProjects: any = [];
  selectedProjects: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  isSearchingProjects: boolean = false;
  isSearchedResults: boolean = false;
  displayTime: number = 5000;
  startDateModel: NgbDateStruct;
  projectIdCounter: number = 0;
  model = { id: 0, title: '',  startDate: null, endDate: null, description: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private calendar: NgbCalendar,
    private storeService: StoreService, private iatiService: IATIService,
    private modalService: ModalService) {
  }

  ngOnInit() {
    this.loadIATIProjects();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    localStorage.setItem('selected-projects', null);
  }

  loadIATIProjects() {
    this.isIATILoading = true;
    var projectTitle = 'Enter project title to proceed';
    this.iatiService.getProjects().subscribe(
      data => {
        this.iatiProjects = data;
        this.filteredIatiProjects = data;
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
    this.searchProjects();
    this.isIATILoading = true;
    var str = e.target.value.toLowerCase();
    if (this.iatiProjects.length > 0) {
      this.filteredIatiProjects = this.iatiProjects.filter(project =>
        project.title.toLowerCase().indexOf(str) != -1);
      
    }
    this.isIATILoading = false;
  }

  selectIATIProject(e) {
    var id = e.target.id;
    var selectedProject = this.filteredIatiProjects.filter(
      iati => iati.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var iatiProject = {id: this.projectIdCounter, title: '', identifier: '', description: '', type: 'IATI'};
      iatiProject.title = selectedProject[0].title;
      iatiProject.description = selectedProject[0].description;
      iatiProject.identifier = selectedProject[0].iatiIdentifier;
      this.addProject(iatiProject);
    }
  }

  selectAIMSProject(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.matchingProjects.filter(
      iati => iati.id == id
    );

    if (selectedProject.length && selectedProject.length > 0) {
      ++this.projectIdCounter;
      var iatiProject = {id: this.projectIdCounter, identifier: '', title: '', description: '', type: 'AIMS'};
      iatiProject.title = selectedProject[0].title;
      iatiProject.description = selectedProject[0].description;
      this.addProject(iatiProject);
    }
  }

  searchProjects() {
    if (this.model.title != null) {
      this.isSearchingProjects = true;
      
      this.projectService.filterProjects(this.model.title).subscribe(
        data => {
          this.isSearchingProjects = false;
          if (data && data.length) {
            this.matchingProjects = data
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
    var project = this.matchingProjects.filter(project => project.id == id);
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

}
