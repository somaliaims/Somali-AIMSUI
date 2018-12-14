import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projectsList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;

  constructor(private projectService: ProjectService, private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getProjectsList();
  }

  getProjectsList() {
    this.projectService.getProjectsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.projectsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchProjects() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.projectService.filterProjects(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.projectsList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.projectsList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-project/' + id);
  }

  viewDetails(id: string) {
    this.router.navigateByUrl('/view-project/' + id);
  }

}
