import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-delete-location',
  templateUrl: './delete-location.component.html',
  styleUrls: ['./delete-location.component.css']
})
export class DeleteLocationComponent implements OnInit {

  locationsList: any = [];
  projectsList: any = [];
  id: string = null;
  requestNo: number = 0;
  errorMessage: string = null;
  model: any = { locationId: 0};
  isLoading: boolean = true;

  constructor(private locationService: LocationService, private route: ActivatedRoute,
    private storeService: StoreService, private errorModal: ErrorModalComponent,
    private router: Router) { }

  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    if (this.route.snapshot.data) {
      this.id = this.route.snapshot.params["{id}"];
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.getLocationsList();
    this.getLocationProjects();
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
          this.locationsList = this.locationsList.filter(o => o.id != this.id);
        }
      }
    )
  }

  getLocationProjects() {
    this.locationService.getLocationProjects(this.id).subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
        this.isLoading = false;
      }
    )
  }

  deleteAndMergeLocation() {
    this.blockUI.start('Deleting location...');
    this.locationService.deleteLocation(this.id, this.model.locationId).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('locations');
        }
        this.blockUI.stop();
      }
    )
  }

}
