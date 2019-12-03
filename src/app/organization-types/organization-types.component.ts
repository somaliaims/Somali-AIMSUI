import { Component, OnInit } from '@angular/core';
import { OrganizationTypeService } from '../services/organization-type.service';
import { Settings } from '../config/settings';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-organization-types',
  templateUrl: './organization-types.component.html',
  styleUrls: ['./organization-types.component.css']
})
export class OrganizationTypesComponent implements OnInit {

  organizationTypesList: any = [];
  filteredOrganizationTypesList: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};

  constructor(private organizationTypeService: OrganizationTypeService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getOrganizationTypesList();
  }

  getOrganizationTypesList() {
    this.organizationTypeService.getOrganizationTypes().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.organizationTypesList = data;
          this.filteredOrganizationTypesList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchOrganizationTypes() {
    if (!this.criteria) {
      this.filteredOrganizationTypesList = this.organizationTypesList;
    }
    else {
      if (this.organizationTypesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredOrganizationTypesList = this.organizationTypesList.filter(t => (t.typeName.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-organization-type/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('/delete-organization-type/' + id);
  }

}
