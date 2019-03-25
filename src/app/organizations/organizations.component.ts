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
  organizationsList: any = null;
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

    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getOrganizationsList();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.organizationsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchOrganizations() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.organizationService.filterOrganizations(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.organizationsList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.organizationsList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-organization/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('/delete-organization/' + id);
  }

}
