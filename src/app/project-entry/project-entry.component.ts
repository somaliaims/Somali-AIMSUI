import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent implements OnInit {
  requestNo: number = 0;
  isError: boolean = false;
  errorMessage: string = '';
  selectedProjects: any = [];
  currentTab: string = 'project';
  iatiProjects: any = [];
  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' }
  ];
  constructor(private storeService: StoreService, private iatiService: IATIService) { }

  ngOnInit() {
    var projects = localStorage.getItem('selected-projects');
    if (projects)
    {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;
      var filtered = this.selectedProjects.filter(function(project) {
        return project.identifier != '';
      });
      var idsArr = [];
      filtered.forEach(function(project) {
        var obj = { identifier: project.identifier };
        idsArr.push(obj);
      });
      this.loadIATIProjectsForIds(idsArr);
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
    for(var i=0; i < this.displayTabs; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
      } else {
        tab.visible = false;
      }
    }
  }

}
