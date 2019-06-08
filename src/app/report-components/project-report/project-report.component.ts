import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

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
  isProcessing: boolean = true;
  model: any = {criteria: null, selectedProjectId: null, projectTitle: null };

  constructor(private projectService: ProjectService) { }

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
        this.isProcessing = false;
      }
    )
  }

  filterProjects() {
    var criteria = this.model.criteria;
    if (!criteria) {
      this.filteredProjects = this.projectsList;
    } else {
      criteria = criteria.toLowerCase();
      this.filteredProjects = this.projectsList.filter(p => p.title.toLowerCase().indexOf(criteria) != -1);
    }
  }

}
