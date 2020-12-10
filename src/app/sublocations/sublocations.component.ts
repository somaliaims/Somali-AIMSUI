import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { LocationService } from '../services/location.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-sublocations',
  templateUrl: './sublocations.component.html',
  styleUrls: ['./sublocations.component.css']
})
export class SublocationsComponent implements OnInit {

  criteria: string = null;
  errorMessage: string = null;
  permissions: any = {};
  locationsList: any = [];
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];
  selectedLocationId: number = 0;
  isLoading: boolean = false;
  requestNo: number = 0;
  pagingSize: number = Settings.rowsPerPage;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private locationService: LocationService,
    private securityService: SecurityHelperService,
    private router: Router,
    private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit(): void {

    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('sectors');
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getLocationsList();
    this.getSubLocationsList();
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
        }
      }
    );
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

  filterLocations() {
    if (this.selectedLocationId == 0) {
      this.filteredSubLocationsList = this.subLocationsList;
    } else {
      this.filteredSubLocationsList = this.subLocationsList.filter(s => s.locationId == this.selectedLocationId);
    }
  }

  searchSubLocations() {
    if (!this.criteria) {
      this.filteredSubLocationsList = this.subLocationsList; 
    } else {
      var stringToMatch = this.criteria.toLowerCase();
      this.filteredSubLocationsList = this.filteredSubLocationsList.filter(s => s.subLocation.toLowerCase().indexOf(stringToMatch) != -1);
    }
  }

  edit(id: number) {
    if (id) {
      this.router.navigateByUrl('manage-sublocation/' + id);
    }
  }

  delete(id: number) {
    if (id) {
      this.blockUI.start('Deleting sub location...');
      this.locationService.deleteSubLocation(id.toString()).subscribe(
        data => {
          if (data) {
            this.subLocationsList = this.subLocationsList.filter(s => s.id != id);
            this.filteredSubLocationsList = this.filteredSubLocationsList.filter(s => s.id != id);
          }
          this.blockUI.stop();
        }
      );
    }
  }

}
