import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-delete-sublocation',
  templateUrl: './delete-sublocation.component.html',
  styleUrl: './delete-sublocation.component.css'
})
export class DeleteSublocationComponent {

  locationsList: any = [];
  projectsList: any = [];
  id: string = null;
  requestNo: number = 0;
  errorMessage: string = null;
  model: any = { locationId: 0};
  isLoading: boolean = true;
  permissions: any = {};
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];

  constructor(private locationService: LocationService, private route: ActivatedRoute,
    private storeService: StoreService, private errorModal: ErrorModalComponent,
    private router: Router, private securityService: SecurityHelperService) { }

  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
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
    this.getSubLocationsList();
    this.getSubLocatioProjects();
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
  getSubLocatioProjects(){
  this.locationService.getSubLocationProjects(this.id).subscribe(
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
    this.locationService.deleteSubLocationWithProject(this.id, this.model.locationId).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('sublocations');
        }
        this.blockUI.stop();
      }
    )
  }
   getSubLocationsList() {
    this.locationService.getSubLocationsList().subscribe(
      data => {
        if (data) {
          this.subLocationsList = data;
          this.filteredSubLocationsList = data;
        }
        this.isLoading = false;
      }
    );
  }
}
