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
    )
  }

}
