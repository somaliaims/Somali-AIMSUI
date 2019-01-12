import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';
import { ProjectService } from '../services/project.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from '../config/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent implements OnInit {
  activeProjectId: number = 0;
  btnProjectText: string = 'Save Project';
  isProjectBtnDisabled: boolean = false;
  requestNo: number = 0;
  isError: boolean = false;
  isForEdit: boolean = false;
  errorMessage: string = '';
  selectedProjects: any = [];
  selectedProjectSectors: any = [];
  currentTab: string = 'project';
  iatiProjects: any = [];
  aimsProjects: any = [];
  startDateModel: NgbDateStruct;
  model = { id: 0, title: '',  startDate: null, endDate: null, description: null };
  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' }
  ];


  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private router: Router) { }

  ngOnInit() {
    var projects = localStorage.getItem('selected-projects');
    if (projects)
    {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;
      
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

  enterProjectAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.title = selectedProject[0].title;
      this.model.description = selectedProject[0].description;
      var sDate = new Date(selectedProject[0].startDate);
      var eDate = new Date(selectedProject[0].endDate);
      this.model.startDate = { year: sDate.getFullYear(), month: sDate.getMonth(), day: sDate.getDay() };
      this.model.endDate = { year: eDate.getFullYear(), month: eDate.getMonth(), day: eDate.getDay() };
    }
  }

  enterProjectIATI(e) {
    var id = e.target.id.split[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.model.title = selectedProject[0].title;
      this.model.description = selectedProject[0].description;
    }
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
            this.storeService.newInfoMessage(message);
            this.activeProjectId = data;
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
            this.storeService.newInfoMessage(message);
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

  /*Reset form states*/
  resetProjectEntry() {
    this.btnProjectText = 'Save Project';
    this.isProjectBtnDisabled = false;
  }

}
