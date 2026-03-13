import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Settings } from '../config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  loggedInUserId: string = null;
  userEmail: string = null;
  permissions: any = {};
  usersList: any = [];
  managerUsers: any = [];
  standardUsers: any = [];
  selectedEmails: any = [];
  isManagersLoading: boolean = true;
  isStandardUsersLoading: boolean = true;
  currentTab: string = null;
  pagingSize: number = Settings.rowsPerPage;
  userTypeConstants: any = {
    MANAGER_USER: 'manager',
    STANDARD_USER: 'standard'
  };
  userTypeCodes: any = {
    MANAGER_USER: 1,
    STANDARD_USER: 2
  };
  isCreateContactEmails: boolean = false;
  selectedManagerOrganizationFilter: string = '';
  selectedStandardOrganizationFilter: string = '';
  searchManagerText: string = '';
  searchStandardText: string = '';
  managerOrganizations: any = [];
  standardOrganizations: any = [];
  m: number = 1;
  s: number = 1;

  displayTabs: any = [
    { visible: true, identity: 'manager' },
    { visible: false, identity: 'standard' },
  ];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private userService: UserService, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canManageUsers) {
      this.router.navigateByUrl('home');
    }

    this.userEmail = this.securityService.getUserEmail();
    this.loggedInUserId = this.securityService.getUserId();
    this.currentTab = this.userTypeConstants.MANAGER_USER;
    this.getManagerUsers();
    this.getStandardUsers();
  }

  getUsersList() {
    this.userService.getUsersList().subscribe(
      data => {
        if (data) {
          this.usersList = data;
        }
      }
    );
  }

  getManagerUsers() {
    this.userService.getManagerUsers().subscribe(
      data => {
        if (data) {
          this.managerUsers = data;
          this.managerOrganizations = this.getUniqueOrganizations(this.managerUsers);
          this.selectedManagerOrganizationFilter = '';
        }
        this.isManagersLoading = false;
      }
    );
  }

  getStandardUsers() {
    this.userService.getStandardUsers().subscribe(
      data => {
        if (data) {
          this.standardUsers = data;
          this.standardOrganizations = this.getUniqueOrganizations(this.standardUsers);
          this.selectedStandardOrganizationFilter = '';
        }
        this.isStandardUsersLoading = false;
      }
    );
  }

  showManagerUsers() {
    this.manageTabsDisplay(this.userTypeConstants.MANAGER_USER);
  }

  showStandardUsers() {
    this.manageTabsDisplay(this.userTypeConstants.STANDARD_USER);
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  promoteUser(id) {
    if (id) {
      this.blockUI.start('Wait promoting user....');
      this.userService.promoteUser(id).subscribe(
        data => {
          if (data) {
            var userPromoted = this.standardUsers.filter(u => u.id == id);
            this.standardUsers = this.standardUsers.filter(u => u.id != id);
            if (userPromoted.length > 0) {
              this.managerUsers.push(userPromoted[0]);
            }
          }
          this.blockUI.stop();
        }
      );
    }
  }

  demoteUser(id) {
    if (id) {
      this.blockUI.start('Wait demoting user....');
      this.userService.demoteUser(id).subscribe(
        data => {
          if (data) {
            var userDemoted = this.managerUsers.filter(u => u.id == id);
            this.managerUsers = this.managerUsers.filter(u => u.id != id);
            if (userDemoted.length > 0) {
              this.standardUsers.push(userDemoted[0]);
            }
          }
          this.blockUI.stop();
        }
      );
    }
  }

  exportContactEmails() {
    if (this.currentTab == this.userTypeConstants.STANDARD_USER) {
      this.selectedEmails = this.standardUsers.filter(u => u.email != this.userEmail).map(u => u.email); 
    } else if (this.currentTab == this.userTypeConstants.MANAGER_USER) {
      this.selectedEmails = this.managerUsers.filter(u => u.email != this.userEmail).map(u => u.email); 
    }
    this.isCreateContactEmails = true;
  }

  showUsers($event) {
    this.isCreateContactEmails = false;
  }

  getUniqueOrganizations(users: any[]): string[] {
    const uniqueOrganizations = [...new Set(users.map(u => u.organization).filter(org => org))].sort();
    return uniqueOrganizations;
  }

  getFilteredManagerUsers(): any[] {
    let filtered = this.managerUsers;

    // Apply organization filter
    if (this.selectedManagerOrganizationFilter) {
      filtered = filtered.filter(u => u.organization === this.selectedManagerOrganizationFilter);
    }

    // Apply email search filter
    if (this.searchManagerText && this.searchManagerText.trim()) {
      const searchTerm = this.searchManagerText.toLowerCase();
      filtered = filtered.filter(u => u.email.toLowerCase().includes(searchTerm));
    }

    return filtered;
  }

  getFilteredStandardUsers(): any[] {
    let filtered = this.standardUsers;

    // Apply organization filter
    if (this.selectedStandardOrganizationFilter) {
      filtered = filtered.filter(u => u.organization === this.selectedStandardOrganizationFilter);
    }

    // Apply email search filter
    if (this.searchStandardText && this.searchStandardText.trim()) {
      const searchTerm = this.searchStandardText.toLowerCase();
      filtered = filtered.filter(u => u.email.toLowerCase().includes(searchTerm));
    }

    return filtered;
  }

  onManagerOrganizationFilterChange() {
    // Reset pagination when filter changes
    this.m = 1;
  }

  onStandardOrganizationFilterChange() {
    // Reset pagination when filter changes
    this.s = 1;
  }

  onManagerSearchChange() {
    // Reset pagination when search changes
    this.m = 1;
  }

  onStandardSearchChange() {
    // Reset pagination when search changes
    this.s = 1;
  }

}
