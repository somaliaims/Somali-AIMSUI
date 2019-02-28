import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
import { ModalService } from '../services/modal.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  permissions: any = {};
  locationsList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  errorMessage: string = '';
  isError: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  selectedLocationId: number = 0;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private locationService: LocationService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditLocation) {
      this.router.navigateByUrl('home');
    }

    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.permissions = this.securityService.getUserPermissions();
    this.getLocationsList();
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.locationsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchLocations() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.locationService.filterLocations(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.locationsList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.getLocationsList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-location/' + id);
  }

  showConfirmation(id: number) {
    this.selectedLocationId = id;
    this.modalService.open('confirmation-modal');
  }

  closeModal() {
    this.modalService.close('confirmation-modal');
  }

  deleteLocation() {
    this.modalService.close('confirmation-modal');
    this.blockUI.start('Deleting location...');
    this.locationService.deleteLocation(this.selectedLocationId).subscribe(
      data => {
        this.locationsList = this.locationsList.filter(l => l.id != this.selectedLocationId);
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.errorMessage = error;
        this.isError = true;
      }
    );
  }

}
