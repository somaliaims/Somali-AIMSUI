import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '../config/settings';
import { LocationService } from '../services/location.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-sublocations',
  templateUrl: './sublocations.component.html',
  styleUrls: ['./sublocations.component.css']
})
export class SublocationsComponent implements OnInit {

  permissions: any = {};
  locationsList: any = [];
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];
  selectedLocationId: number = 0;
  isLoading: boolean = false;

  constructor(private locationService: LocationService,
    private securityService: SecurityHelperService,
    private router: Router,
    private storeService: StoreService) { }

  ngOnInit(): void {

    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('sectors');
    }

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
        }
        this.isLoading = true;
      }
    );
  }

}
