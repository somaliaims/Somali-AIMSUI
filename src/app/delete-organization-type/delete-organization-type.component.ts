import { Component, OnInit } from '@angular/core';
import { Settings } from '../config/settings';
import { StoreService } from '../services/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { OrganizationService } from '../services/organization-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OrganizationTypeService } from '../services/organization-type.service';

@Component({
  selector: 'app-delete-organization-type',
  templateUrl: './delete-organization-type.component.html',
  styleUrls: ['./delete-organization-type.component.css']
})
export class DeleteOrganizationTypeComponent implements OnInit {
  requestNo: number = 0;
  id: number = 0;
  mappingOrganizationTypeId: number = 0;
  errorMessage: string = null;
  deletionMessage: string = null;
  isLoading: boolean = true;
  organizationTypesList: any = [];
  organizationsList: any = [];
  @BlockUI() blockUI: NgBlockUI;

  constructor(private storeService: StoreService, private route: ActivatedRoute,
    private errorModal: ErrorModalComponent, private router: Router,
    private orgranizationService: OrganizationService,
    private organizationTypeService: OrganizationTypeService) { }

  ngOnInit() {
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

    if (!this.id) {
      this.router.navigateByUrl('organization-types');
    }

    this.getOrganizationTypes();
    this.getOrganizationsForType();
  }

  getOrganizationTypes() {
    this.organizationTypeService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          var orgTypes = data;
          this.organizationTypesList = orgTypes.filter(t => t.id != this.id);
        }
      }
    );
  }

  getOrganizationsForType() {
    this.orgranizationService.getOrganizationsForType(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
        }
        this.isLoading = false;
      }
    );
  }

  showList() {
    this.router.navigateByUrl('organization-types');
  }

  delete() {
    this.blockUI.start('Deleting organization type...');
    this.organizationTypeService.deleteOrganizationType(this.id.toString(), this.mappingOrganizationTypeId.toString()).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('organization-types');
        }
        this.blockUI.stop();
      }
    );
  }


}
