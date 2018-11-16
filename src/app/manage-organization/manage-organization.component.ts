import { Component, OnInit, Input } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';

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
  model = { id: 0, organizationName: '', organizationTypeId: 0};

  constructor(private organizationService: OrganizationService, private route: ActivatedRoute,
    private router: Router, private modalService: NgxSmartModalService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);
    this.fillOrganizationTypes();
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
            this.model.organizationTypeId = data.organizationTypeId;
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }
  }

  fillOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        this.organizationTypes = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveOrganization() {
    var model = { 
      OrganizationName: this.model.organizationName, 
      OrganizationTypeId: this.model.organizationTypeId
    };

    if (this.isForEdit) {
      this.organizationService.updateOrganization(this.model.id, model).subscribe(
        data => {
          var message = 'New organization' + Messages.NEW_RECORD;
          this.storeService.newInfoMessage(message);
          this.router.navigateByUrl('organizations');
        },
        error => {
          this.errorMessage = error;
          this.modalService.getModal('error-modal').open();
        }
      );
    } else {
      this.organizationService.updateOrganization(this.model.id, model).subscribe(
        data => {
          var message = 'Selected organization' + Messages.RECORD_UPDATED;
          this.storeService.newInfoMessage(message);
          this.router.navigateByUrl('organizations');
        },
        error => {
          this.errorMessage = error;
          this.modalService.getModal('error-modal').open();
        }
      );
    }
  }

}
