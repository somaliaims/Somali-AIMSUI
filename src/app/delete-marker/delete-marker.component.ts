import { Component, OnInit } from '@angular/core';
import { MarkerService } from '../services/marker.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-delete-marker',
  templateUrl: './delete-marker.component.html',
  styleUrls: ['./delete-marker.component.css']
})

export class DeleteMarkerComponent implements OnInit {
  projectsList: any = [];
  permissions: any = {};
  id: number = 0;
  requestNo: number = 0;
  errorMessage: string = null;
  isLoading: boolean = false;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private markerService: MarkerService, private securityService: SecurityHelperService,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }

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
    this.getMarkerProjects();
  }

  getMarkerProjects() {
    this.markerService.getMarkerProjects(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
      }
    )  
  }

  deleteMarker() {
    this.blockUI.start('Deleting marker...');
    this.markerService.deleteMarker(this.id).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('markers');
        }
        this.blockUI.stop();
      }
    )
  }

}
