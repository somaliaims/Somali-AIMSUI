import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-project-location',
  templateUrl: './project-location.component.html',
  styleUrls: ['./project-location.component.css']
})
export class ProjectLocationComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  projectId: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  locations: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { projectId: 0, locationId: null,  percentage: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private locationService: LocationService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Add Location for Project';
        this.projectId = id;
      } else {
        this.router.navigateByUrl('/');
      }
    }
    
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  loadLocations() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locations = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveProjectLocation() {
    var model = {
      ProjectId: this.model.projectId,
      LocationId: this.model.locationId,
      Percentage: this.model.percentage,
    };

    this.isBtnDisabled = true;
      this.btnText = 'Saving...';
      this.projectService.addProjectLocation(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project location ' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('projects');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Project Location';
  }

}
