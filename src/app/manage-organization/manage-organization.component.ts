import { Component, OnInit, Input } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';

@Component({
  selector: 'manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.css']
})
export class ManageOrganizationComponent implements OnInit {
  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Organization';
  errorMessage: string = '';
  organizationTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  iatiOrganizations: any = [];
  filteredIATIOrganizations: any = [];
  model = { id: 0, organizationName: '' };

  constructor(private organizationService: OrganizationService, private route: ActivatedRoute,
    private router: Router, 
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Organization';
        this.isForEdit = true;
        this.orgId = id;
        this.organizationService.getOrganization(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.organizationName = data.organizationName;
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  fillOrganizationTypes() {
    /*this.organizationService.getOrganizationTypes().subscribe(
      data => {
        this.organizationTypes = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );*/
  }

  saveOrganization() {
    var model = {
      Name: this.model.organizationName,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.organizationService.updateOrganization(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Organization' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('organizations');
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
      this.organizationService.addOrganization(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New organization' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('organizations');
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
      this.btnText = 'Edit Organization';
    } else {
      this.btnText = 'Add Organization';
    }
  }

}
