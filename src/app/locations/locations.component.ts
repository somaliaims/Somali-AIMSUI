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
  filteredLocationsList: any = null;
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

    this.getLocationsList();
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.locationsList = data;
          this.filteredLocationsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  /*searchLocations() {
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
  }*/

  searchLocations() {
    if (!this.criteria) {
      this.filteredLocationsList = this.locationsList;
    }
    else {
      if (this.locationsList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredLocationsList = this.locationsList.filter(s => (s.location.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-location/' + id);
  }

  closeModal() {
    this.modalService.close('confirmation-modal');
  }

  delete(id) {
    this.router.navigateByUrl('delete-location/' + id);
  }

}
