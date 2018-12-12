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

  //project data variables
  projectData: any = null;
  projectLocatoins: any = null;

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
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

      },
      error => {

      }
    )
  }

}
