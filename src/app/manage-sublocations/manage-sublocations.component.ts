import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from '../config/settings';
import { LocationService } from '../services/location.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'manage-sublocations',
  templateUrl: './manage-sublocations.component.html',
  styleUrls: ['./manage-sublocations.component.css']
})
export class ManageSubLocationsComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;

  isLoading: boolean = false;
  errorMessage: string = null;
  isBtnDisabled: boolean = false;
  isError: boolean = false;
  permissions: any = {};
  locations: any = [];
  btnText: string = 'Add Sector';
  locationTabText: string = 'Manage sub-location';
  model: any = { id: 0, subLocation: null, locationId: 0 };
  
  constructor(private locationService: LocationService,
    private securityService: SecurityHelperService,
    private router: Router,
    private storeService: StoreService,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('sectors');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.model.id = id;
        this.getSubLocation();
      }
    }
    this.getLocations();
  }

  getLocations() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locations = data;
        }
        this.isLoading = false;
      }
    );
  }

  getSubLocation() {
    this.locationService.getSubLocation(this.model.id).subscribe(
      data => {
        if (data) {
          this.model.locationId = data.locationId;
          this.model.subLocation = data.subLocation;
        }
      }
    );
  }

  saveSubLocation() {
    var model = {
      locationId: parseInt(this.model.locationId.toString()),
      subLocation: this.model.subLocation,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.locationService.updateSubLocation(this.model.id, model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('sectors');
          }
        },
        error => {
          this.errorMessage = error.error;
          this.isError = true;
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.locationService.addSubLocation(model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('sectors');
          }
        },
        error => {
          this.errorMessage = error.error;
          this.isError = true;
        }
      );
    }
  }

}
