import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { IATIService } from '../services/iati.service';

@Component({
  selector: 'app-merge-projects',
  templateUrl: './merge-projects.component.html',
  styleUrls: ['./merge-projects.component.css']
})
export class MergeProjectsComponent implements OnInit {

  permissions: any = [];
  iatiProjects: any = [];
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  selectedProjects: any = [];
  sourceProjects: any = [];
  aimsProjects: any = [];
  isIatiLoading: boolean = true;
  isAimsLoading: boolean = true;
  model: any = { id: 0, title: '', startDate: null, endDate: null, description: null };

  constructor(private projectService: ProjectService, private iatiService: IATIService) { }

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
      },
      error => {
        console.log(error);
        this.isIatiLoading = false;
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

  mergeAndSaveProject() {
    var Ids = this.selectedProjects.map(p => p.id);
    var model = {
      
    };
  }

  proceedDataEntry() {

  }

}
