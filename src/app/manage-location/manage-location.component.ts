import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrls: ['./manage-location.component.css']
})
export class ManageLocationComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Location';
  errorMessage: string = '';
  locationTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  permissions: any = {};
  model = { id: 0, location: '', latitude: 0.00, longitude: 0.00 };

  constructor(private locationService: LocationService, private route: ActivatedRoute,
    private router: Router, private storeService: StoreService,
    private securityService: SecurityHelperService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditLocation) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Location';
        this.isForEdit = true;
        this.orgId = id;
        this.locationService.getLocation(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.location = data.location;
            this.model.latitude = data.latitude;
            this.model.longitude = data.longitude;
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  saveLocation() {
    var model = {
      Location: this.model.location,
      Latitude: this.model.latitude,
      Longitude: this.model.longitude
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.locationService.updateLocation(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Location' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('locations');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.resetFormState();
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.locationService.addLocation(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New location' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('locations');
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
  }

  resetFormState() {
    this.isBtnDisabled = false;
    if (this.isForEdit) {
      this.btnText = 'Edit Location';
    } else {
      this.btnText = 'Add Location';
    }
  }

}
