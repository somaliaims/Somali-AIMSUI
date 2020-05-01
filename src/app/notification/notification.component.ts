import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { OrganizationService } from '../services/organization-service';
import { Messages } from '../config/messages';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  projectRequests: any = [];
  projectDeletionRequests: any = [];
  organizationMergeRequests: any = [];
  isLoading: boolean = true;
  showNoFound: boolean = false;
  infoMessage: string = null;
  errorMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  displayOption: number = null;
  permissions: any = {};
  currentTab: string = 'notifications';
  @BlockUI() blockUI: NgBlockUI;

  tabConstants: any = {
    'NOTIFICATIONS': 'notifications',
    'REQUESTS': 'requests',
    'DELETION_REQUESTS': 'deletionRequests',
    'MERGE_ORGS_REQUESTS': 'organizationMergeRequests'
  };

  deletionStatus: any = {
    'REQUESTED': 'Requested',
    'APPROVED': 'Approved',
    'CANCELLED': 'Cancelled'
  };

  displayTabs: any = [
    { visible: true, identity: 'notifications' },
    { visible: false, identity: 'requests' },
    { visible: false, identity: 'deletionRequests' },
    { visible: false, identity: 'organizationMergeRequests' }
  ];

  notificationTypeCodes: any = {
    'ALL': 0,
    'NOTIFICATIONS': 1,
    'MEMBERSHIP_REQUESTS': 2,
    'PROJECT_DELETION_REQUESTS': 3,
    'MERGE_ORGS_REQUESTS': 4
  };

  notificationTypes: any = [
    { id: 0, text: '--All notifications--' },
    { id: 1, text: 'General notifications' },
    { id: 2, text: 'Project membership requests' },
    { id: 3, text: 'Project deletion requests' },
    { id: 4, text: 'Merge organizations requests' }
  ];

  constructor(private notificationService: NotificationService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private modalService: ModalService) {

  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditNotifications) {
      this.router.navigateByUrl('home');
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
        this.errorModal.openModal();
        this.blockUI.stop();
      }
    });

    this.displayOption = this.notificationTypeCodes.ALL;
    this.getNotifications();
    this.getProjectRequests();
    this.getProjectDeletionRequests();
    this.getMergeOrganizationRequestsForUser();
  }

  showNotificationType() {
  }

  getNotifications() {
    this.notificationService.getUserNotifications().subscribe(data => {
      if (data && data.length) {
        if (data.length > 0) {
          this.notifications = data;
        }
      }
    });
  }

  activateUserAccount(event, userId, notificationId) {
    if (userId && notificationId) {
      this.blockUI.start('Activating account...');
      this.notificationService.activateUserAccount(userId, notificationId).subscribe(data => {
        if (data) {
          this.reloadPage();
        }
        this.stopScreenBlocker();
      });
    }
  }

  activateUserWithInactiveOrganization(event, userId, notificationId) {
    if (userId && notificationId) {
      this.blockUI.start('Activating account...');
      this.notificationService.activateUserWithInactiveOrganization(userId, notificationId).subscribe(data => {
        if (data) {
          this.reloadPage();
        }
        this.stopScreenBlocker();
      });
    }
  }

  showNotifications() {
    this.manageTabsDisplay(this.tabConstants.NOTIFICATIONS);
  }

  showRequests() {
    this.manageTabsDisplay(this.tabConstants.REQUESTS);
  }

  showDeletionRequests() {
    this.manageTabsDisplay(this.tabConstants.DELETION_REQUESTS);
  }

  showMergeOrganizationsRequests() {
    this.manageTabsDisplay(this.tabConstants.MERGE_ORGS_REQUESTS);
  }

  reloadPage() {
    location.reload();
  }

  getProjectRequests() {
    this.projectService.getProjectMembershipRequests().subscribe(
      data => {
        if (data) {
          this.projectRequests = data;
        }
        this.isLoading = false;
      }
    );
  }

  getMergeOrganizationRequestsForUser() {
    this.organizationService.getMergeOrganizationRequestsForUser().subscribe(
      data => {
        if (data) {
          this.organizationMergeRequests = data;
        }
      }
    );
  }

  getProjectDeletionRequests() {
    this.projectService.getProjectDeletionActiveRequests().subscribe(
      data => {
        if (data) {
          this.projectDeletionRequests = data;
        }
      }
    );
  }

  getLongDateString(dated) {
    return this.storeService.getLongDateString(dated);
  }

  approveRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var model = {
      projectId: arr[2],
      userId: arr[3]
    };

    if (model.projectId && model.userId) {
      this.blockUI.start('Wait submitting request...');
      this.projectService.approveProjectMembership(model).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.stopScreenBlocker();
        }
      );
    }
  }

  unApproveRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var model = {
      projectId: arr[2],
      userId: arr[3]
    };

    if (model.projectId && model.userId) {
      this.blockUI.start('Wait submitting request...');
      this.projectService.unApproveProjectMembership(model).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.stopScreenBlocker();
        }
      );
    }
  }

  approveOrganizationsMergeRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var requestId = arr[2];
    if (requestId) {
      this.blockUI.start('Wait approving and merging organizations');
      this.organizationService.approveMergeOrganizationsRequest(requestId).subscribe(
        data => {
          if (data) {
            this.infoMessage = Messages.ORGANIZATIONS_MERGED;
            this.modalService.open('readonly-message-modal');
            this.securityService.clearLoginSession();
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
          this.blockUI.stop();
        }
      );
    }
  }

  unApproveOrganizationsMergeRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var requestId = arr[2];
    if (requestId) {
      this.blockUI.start('Wait rejecting merge organizations request');
      this.organizationService.rejectMergeOrganizationsRequest(requestId).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.blockUI.stop();
        }
      );
    }
  }

  approveDeletionRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var projectId = arr[2];
    if (projectId) {
      this.blockUI.start('Approving request...');
      this.projectService.approveProjectDeletion(projectId).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.stopScreenBlocker();
        }
      );
    }
  }

  unApproveDeletionRequest(e) {
    var arr = e.currentTarget.id.split('-');
    var projectId = arr[2];
    if (projectId) {
      this.blockUI.start('Cancelling request...');
      this.projectService.cancelProjectDeletion(projectId).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.stopScreenBlocker();
        }
      );
    }
  }

  deleteProject(e) {
    var arr = e.currentTarget.id.split('-');
    var projectId = arr[2];
    if (projectId) {
      this.blockUI.start('Deleting project...');
      this.projectService.deleteProject(projectId).subscribe(
        data => {
          if (data) {
            this.reloadPage();
          }
          this.stopScreenBlocker();
        }
      );
    }
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

  formatMergeOrganizations(orgs: any) {
    var resultStr = '';
    if (orgs && orgs.length) {
      var orgsList = orgs.map(o => o.organizationName);
      if (orgsList.length > 0) {
        var strList = [];
        strList.push('<ul>');
        orgsList.forEach((o) => {
          strList.push('<li>' + o + '</li>');
        });
        strList.push('</ul>');
        resultStr = strList.join('');
      }
    }
    return resultStr;
  }

  stopScreenBlocker() {
    setTimeout(() => {
      this.blockUI.stop();
    }, 1000);
  }

}
