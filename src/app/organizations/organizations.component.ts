import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
import { OrganizationTypeService } from '../services/organization-type.service';
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizationsList: any = [];
  organizationTypes: any = [];
  filteredOrganizationsList: any = [];
  organizationTypeId: number = 0;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};

  constructor(private organizationService: OrganizationService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private organizationTypeService: OrganizationTypeService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getOrganizationTypes();
    this.getOrganizationsList();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.organizationsList = data;
          this.filteredOrganizationsList = data;
          this.sortOrgsByDateUpdatedDesc();
        }
      }
    );
  }

  getOrganizationTypes() {
    this.organizationTypeService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
      }
    );
  }


  searchOrganizations() {
    var organizations = [];
    if (this.organizationTypeId != 0) {
      organizations = this.organizationsList.filter(t => t.organizationTypeId == this.organizationTypeId);
    } else {
      organizations = this.organizationsList;
    }

    if (!this.criteria) {
      this.filteredOrganizationsList = organizations;
    }
    else {
      if (organizations.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredOrganizationsList = organizations.filter(s => (s.organizationName.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  formatDateUKStyle(dated: any) {
    var validDate = Date.parse(dated);
    if (isNaN(validDate)) {
      return 'Invalid date';
    }
    var datesArr = dated.split('/');
    return this.storeService.formatDateInUkStyle(parseInt(datesArr[2]), parseInt(datesArr[0]), parseInt(datesArr[1]));
  }

  sortOrgsByDateUpdatedAsc() {
    this.filteredOrganizationsList.sort(this.sortByDateAsc);
  }

  sortOrgsByDateUpdatedDesc() {
    this.filteredOrganizationsList.sort(this.sortByDateDesc);
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-organization/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('/delete-organization/' + id);
  }

  sortByDateDesc(a,b){  
    var dateA = new Date(a.dateUpdated).getTime();
    var dateB = new Date(b.dateUpdated).getTime();
    return dateB > dateA ? 1 : -1;  
  }; 

  sortByDateAsc(a,b){  
    var dateA = new Date(a.dateUpdated).getTime();
    var dateB = new Date(b.dateUpdated).getTime();
    return dateA > dateB ? 1 : -1;  
  }; 

}
