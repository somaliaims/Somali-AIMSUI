import { Component, OnInit, Input } from '@angular/core';
import { OrganizationTypeService } from '../services/organization-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-manage-organization-type',
  templateUrl: './manage-organization-type.component.html',
  styleUrls: ['./manage-organization-type.component.css']
})
export class ManageOrganizationTypeComponent implements OnInit {
  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add organization type';
  errorMessage: string = '';
  organizationTypes: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  iatiOrganizations: any = [];
  filteredIATIOrganizations: any = [];
  model = { id: 0, typeName: '' };

  constructor(private organizationService: OrganizationTypeService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit organization type';
        this.isForEdit = true;
        this.orgId = id;
        this.getOrganizationTypeData();
      }
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getOrganizationTypeData() {
    if (this.orgId) {
      this.organizationService.getOrganizationType(this.orgId.toString()).subscribe(
        data => {
          this.model.typeName = data.typeName;
        }
      );
    }
  }
  
  saveOrganizationType() {
    var model = {
      typeName: this.model.typeName,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.organizationService.updateOrganizationType(this.orgId, model).subscribe(
        data => {
          if (!this.isError) {
            this.router.navigateByUrl('organization-types');
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
      this.organizationService.addOrganizationType(model).subscribe(
        data => {
          if (!this.isError) {
            this.router.navigateByUrl('organization-types');
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
      this.btnText = 'Edit organization type';
    } else {
      this.btnText = 'Add organization type';
    }
  }

}
