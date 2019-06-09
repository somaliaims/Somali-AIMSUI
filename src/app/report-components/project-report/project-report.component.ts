import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  projectsList: any = [];
  filteredProjects: any = [];
  reportView: string = 'search';
  btnText: string = 'View report';
  isLoading: boolean = true;
  projectProfile: any = {
    locations: [],
    sectors: [],
    funders: [],
    implementers: [],
    documents: [],
    customFields: []
  };
  model: any = {criteria: null, selectedProjectId: 0, projectTitle: null };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private projectService: ProjectService, private errorModal: ErrorModalComponent,
    private storeService: StoreService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjectsList().subscribe(
      data => {
        if (data) {
          this.projectsList = data;
          this.filteredProjects = data;
        }
        this.isLoading = false;
      }
    )
  }

  filterProjects() {
    var criteria = this.model.projectTitle;
    if (!criteria) {
      this.filteredProjects = this.projectsList;
    } else {
      criteria = criteria.toLowerCase();
      this.filteredProjects = this.projectsList.filter(p => p.title.toLowerCase().indexOf(criteria) != -1);
    }
  }

  selectProject(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      var selectedProject = this.projectsList.filter(p => p.id == id);
      if (selectedProject.length > 0) {
        this.model.selectedProjectId = id;
        this.model.projectTitle = selectedProject[0].title; 
      }
    }
  }

  viewProjectProfileReport() {
    if (this.model.selectedProjectId) {
      this.blockUI.start('Loading report');
      
      this.projectService.getProjectProfileReport(this.model.selectedProjectId).subscribe(
        data => {
          if (data) {
            if (data.projectProfile) {
              this.projectProfile = data.projectProfile;
            }
          }
          this.reportView = 'report';
          this.blockUI.stop();
        }
      );
    } 
  }

  reset() {
    this.model.selectedProjectId = 0;
    this.model.projectTitle = null;
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  printReport() {
    this.storeService.printSimpleReport('rpt-project-report', 'Project profile report');
  }

}
