import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merge-organization',
  templateUrl: './merge-organization.component.html',
  styleUrls: ['./merge-organization.component.css']
})
export class MergeOrganizationComponent implements OnInit {

  organizationsList: any = [];
  isLoading: boolean = true;
  filteredOrganizationsList: any = [];
  selectedOrganizations: any = [];
  model = {title: null, name: null };
  errorMessage: string = null;
  isTextReadOnly: boolean = false;
  inputTextHolder: string = 'Enter organization name to search';

  @BlockUI() blockUI: NgBlockUI;
  constructor(private organizationService: OrganizationService, 
    private errorModal: ErrorModalComponent, private router: Router) { 
  }

  ngOnInit() {
    this.loadOrganizations();
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
  }

  mergeOrganizations() {
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

    this.blockUI.start('Merging organizations...');
    var ids = this.selectedOrganizations.map(org => org.id);
    var model = {
      newName: this.model.name,
      Ids: ids
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
          /*var renameOrg = this.organizationsList.filter(o => o.id == id);
          if (renameOrg.length > 0) {
            renameOrg[0].organizationName = model.name;
          }*/
          this.router.navigateByUrl('organizations');
        }
        this.blockUI.stop();
      }
    );
  }

}
