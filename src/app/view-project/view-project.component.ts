import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  requestNo: number = 0;
  errorMessage: string = '';
  isError: boolean = false;
  isLoading: boolean = true;
  isLocationLoading: boolean = false;

  //project data variables
  projectData: any = [];
  projectLocations: any = [];

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.loadProjectData(id);    
      } else {

      }
    }
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  loadProjectData(id) {
    this.projectService.getProject(id).subscribe(
      data => {
        this.hideLoader();
        this.projectData = data;
      },
      error => {
        this.hideLoader();
        console.log(error);
      }
    )
  }

  loadProjectLocations(id) {
    this.projectService.getProjectLocations(id).subscribe(
      data => {
        this.projectLocations = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  hideLoader() {
    this.isLoading = false;
  }

}
