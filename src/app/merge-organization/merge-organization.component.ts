import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { OrganizationTypeService } from '../services/organization-type.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-merge-organization',
  templateUrl: './merge-organization.component.html',
  styleUrls: ['./merge-organization.component.css']
})
export class MergeOrganizationComponent implements OnInit {

  requestNo: number = 0;
  envelopeOrganizationId: number = 0;
  permissions: any = {};
  organizationTypes: any = [];
  organizationsList: any = [];
  organizationsAppliedForMerge: any = [];
  isLoading: boolean = true;
  filteredOrganizationsList: any = [];
  selectedOrganizations: any = [];
  model = {title: null, name: null, organizationTypeId: 0 };
  errorMessage: string = null;
  successMessage: string = null;
  isTextReadOnly: boolean = false;
  inputTextHolder: string = 'Enter organization name to search';

  @BlockUI() blockUI: NgBlockUI;
  constructor(private organizationService: OrganizationService, 
    private errorModal: ErrorModalComponent, private router: Router, 
    private storeService: StoreService,
    private organizationTypeService: OrganizationTypeService,
    private infoModal: InfoModalComponent,
    private securityService: SecurityHelperService) { 
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.loadOrganizationsAppliedForMerge();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  loadOrganizationsAppliedForMerge() {
    this.organizationService.getOrganizationsAppliedForMerge().subscribe(
      data => {
        if (data) {
          this.organizationsAppliedForMerge = data.map(d => d.id);
        }
        this.loadOrganizationTypes();
      }
    )
  }

  loadOrganizationTypes() {
    this.organizationTypeService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
        this.loadOrganizations();
      }
    );
  }

  loadOrganizations() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
          this.filteredOrganizationsList = data;
        }
        this.isLoading = false;
      }
    )
  }

  filterOrganizations() {
    this.filteredOrganizationsList = this.organizationsList.filter(o => o.organizationName.toLowerCase().indexOf(this.model.title.toLowerCase()) != -1);
  }

  selectOrganization(e) {
    var id = e.target.id.split('-')[1];
    var selectedOrganization = this.filteredOrganizationsList.filter(o => o.id == id);
    if (selectedOrganization.length > 0) {
      this.selectedOrganizations.push(selectedOrganization[0]);
    }
    this.filteredOrganizationsList = this.filteredOrganizationsList.filter(o => o.id != id);
  }

  deSelectOrganization(e) {
    var id = e.target.id.split('-')[1];
    var deSelectOrganization = this.selectedOrganizations.filter(o => o.id == id);
    if (deSelectOrganization.length > 0) {
      this.filteredOrganizationsList.push(deSelectOrganization[0]);
    }
    this.selectedOrganizations = this.selectedOrganizations.filter(o => o.id != id);
    if (id == this.envelopeOrganizationId) {
      this.envelopeOrganizationId = 0;
    }
  }

  checkIfOrganizationsHaveUsers() {
    if (this.model.organizationTypeId == 0) {
      this.errorMessage = 'Organization type is required';
      this.errorModal.openModal();
      return false;
    }

    if (!this.model.name || this.model.name.length < 2 ) {
      this.errorMessage = Messages.INVALID_ORG_NAME;
      this.errorModal.openModal();
      return false;
    }

    if (this.selectedOrganizations.length < 2) {
      this.errorMessage = Messages.ATLEAST_ORGANIZATION_MERGE;
      this.errorModal.openModal();
      return false;
    }
    var ids = this.selectedOrganizations.map(org => org.id);
    var model = {
      ids: ids
    };

    if (ids.length > 1 && this.envelopeOrganizationId == 0) {
      this.errorMessage = 'Selection for organization is required whose data must be used for Envelope after merge.';
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Wait working on merge...');
    this.organizationService.checkIfOrganizationsHaveUsers(model).subscribe(
      data => {
        if (data) {
          if (data.returnedId && data.returnedId > 0) {
            this.mergeOrganizationsRequest();
          } else if (data.returnedId == 0) {
            this.mergeOrganizations();
          } else {
            this.blockUI.stop();
          }
        }
      }
    );
  }

  mergeOrganizationsRequest() {
    var ids = this.selectedOrganizations.map(org => org.id);
    var model = {
      newName: this.model.name,
      Ids: ids,
      organizationTypeId: this.model.organizationTypeId,
      envelopeOrganizationId: this.envelopeOrganizationId
    };
    this.organizationService.addMergeOrganizationsRequest(model).subscribe(
      data => {
        if (data) {
          this.successMessage = Messages.MERGE_ORG_REQUESTED;
          this.infoModal.openModal();
          this.selectedOrganizations = [];
          this.model.name = null;
          this.model.organizationTypeId = 0;
          this.envelopeOrganizationId = 0;
        }
        this.blockUI.stop();
      }
    );
  }

  mergeOrganizations() {
    var ids = this.selectedOrganizations.map(org => org.id);
    var model = {
      newName: this.model.name,
      Ids: ids,
      organizationTypeId: this.model.organizationTypeId,
      envelopeOrganizationId: this.envelopeOrganizationId
    };

    this.organizationService.mergeOrganizations(model).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('organizations');
        }
        this.blockUI.stop();
      }
    );
  }

  renameOrganization() {
    if (this.selectedOrganizations.length == 0) {
      this.errorMessage = 'Select an organization to rename';
      this.errorModal.openModal();
      return false;
    } else if (this.selectedOrganizations.length > 1) {
      this.errorMessage = Messages.ONLY_ONE_ORGANIZATION_RENAME;
      this.errorModal.openModal;
      return false;
    }

    var id = this.selectedOrganizations.map(org => org.id)[0];
    var model = {
      name: this.model.name
    };
    this.blockUI.start('Renaming organization...');
    this.organizationService.renameOrganization(id, model).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('organizations');
        }
        this.blockUI.stop();
      }
    );
  }

  setEnvelopeOrganization(id: number) {
    this.envelopeOrganizationId = id;
  }

  isOrganizationAppliedForMerge(id: number) {
    return (this.organizationsAppliedForMerge.includes(id));
  }

}
