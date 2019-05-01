import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizationsList: any = [];
  filteredOrganizationsList: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};

  constructor(private organizationService: OrganizationService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }

    this.getOrganizationsList();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.organizationsList = data;
          this.filteredOrganizationsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchOrganizations() {
    if (!this.criteria) {
      this.filteredOrganizationsList = this.organizationsList;
    }
    else {
      if (this.organizationsList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredOrganizationsList = this.organizationsList.filter(s => (s.organizationName.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-organization/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('/delete-organization/' + id);
  }

}
