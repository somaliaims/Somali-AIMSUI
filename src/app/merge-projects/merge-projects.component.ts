import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { IATIService } from '../services/iati.service';
import { ProjectInfoModalComponent } from '../project-info-modal/project-info-modal.component';
import { ProjectiInfoModalComponent } from '../projecti-info-modal/projecti-info-modal.component';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-merge-projects',
  templateUrl: './merge-projects.component.html',
  styleUrls: ['./merge-projects.component.css']
})
export class MergeProjectsComponent implements OnInit {

  isProjectBtnDisabled: boolean = true;
  errorMessage: string = '';
  permissions: any = [];
  iatiProjects: any = [];
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  selectedProjects: any = [];
  sourceProjects: any = [];
  aimsProjects: any = [];

  viewProject: any = {};
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewParticipatingOrganizations: any = [];
  viewProjectDisbursements: any = [];

  isIatiLoading: boolean = true;
  isAimsLoading: boolean = true;
  model: any = { id: 0, title: '', startDate: null, endDate: null, description: null };

  constructor(private projectService: ProjectService, private iatiService: IATIService,
    private projectInfoModal: ProjectInfoModalComponent,
    private projectIATIInfoModal: ProjectiInfoModalComponent,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    var projects = localStorage.getItem('merge-projects');
    if (projects) {
      var parsedProjects = JSON.parse(projects);
      //this.selectedProjects = parsedProjects;
      //Load iati projects
      var filteredIATI = parsedProjects.filter(function (project) {
        return project.type == 'IATI';
      });

      var iatiIdsArr = [];
      filteredIATI.forEach(function (project) {
        var obj = { identifier: project.identifier };
        iatiIdsArr.push(obj);
      }.bind(this));
      this.loadIATIProjectsForIds(iatiIdsArr);

      //Load aims projects
      var filteredAIMS = parsedProjects.filter(function (project) {
        return project.type == 'AIMS';
      });
      var aimsIdsArr = [];
      filteredAIMS.forEach(function (project) {
        var id = project.identifier;
        aimsIdsArr.push(id);
      });

      this.loadIATIProjectsForIds(iatiIdsArr);
      this.loadAIMSProjectsForIds(aimsIdsArr);
    }
  }

  loadIATIProjectsForIds(modelArr: any) {
    this.isIatiLoading = true;
    this.iatiService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.sourceProjects = data;
        this.isIatiLoading = false;
        this.isProjectBtnDisabled = false;
      },
      error => {
        this.isIatiLoading = false;
        this.isProjectBtnDisabled = false;
      }
    )
  }

  selectForMerge(e) {
    var id = e.target.id.split('-')[1];
    var project = this.aimsProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.selectedProjects.push(project);
    }
    this.aimsProjects = this.aimsProjects.filter(p => p.id != id);
  }

  deSelectForMerge(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.aimsProjects.push(project);
    }
    this.selectedProjects = this.selectedProjects.filter(p => p.id != id);
  }

  enterTitle(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.title = project[0].title;
    }
  }

  enterDescription(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.description = project[0].description;
    }
  }

  enterStartDate(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    var sDate = new Date(project[0].startDate);
    this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
  }

  enterEndDate(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    var eDate = new Date(project[0].endDate);
    this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.isAimsLoading = true;
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.selectedProjects = data;
        this.isAimsLoading = false;
      },
      error => {
        this.isAimsLoading = false;
      }
    )
  }

  viewAIMSProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.selectedProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          startDate: projectData.startDate,
          endDate: projectData.endDate
        }
        this.viewProject = projectData;
        this.viewProjectFunders = projectData.funders;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewProjectImplementers = projectData.implementers;
        this.viewProjectDocuments = projectData.documents;
        this.projectInfoModal.openModal();
      }
    }
    return false;
  }

  viewIATIProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.sourceProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          defaultCurrency: projectData.defaultCurrency,
        }
        this.viewProject = project;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewParticipatingOrganizations = projectData.participatingOrganizations;
        this.viewProjectDocuments = projectData.documents;
        this.projectIATIInfoModal.openModal();
      }
    }
    return false;
  }

  mergeAndSaveProject() {
    if (this.selectedProjects.length <= 1) {
      this.errorMessage = Messages.INVALID_PROJECT_MERGE;
      this.errorModal.openModal();
      return false;
    }

    var Ids = this.selectedProjects.map(p => p.id);
    var model = {
      title: this.model.title,
      description: this.model.description,
      startDate: this.model.startDate,
      endDate: this.model.endDate,
      projectsIds: Ids
    };

    this.projectService.mergeProjects(model).subscribe(
      data => {
        if (data) {
          var projects = JSON.stringify(this.sourceProjects);
          localStorage.setItem('active-project', data);
          localStorage.setItem('selected-projects', projects);
        }
      }
    )
  }

}
