import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  projectRequests: any = [];
  projectDeletionRequests: any = [];
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
    'DELETION_REQUESTS': 'deletionRequests'
  };

  deletionStatus: any = {
    'REQUESTED': 'Requested',
    'APPROVED': 'Approved',
    'CANCELLED': 'Cancelled'
  };

  displayTabs: any = [
    { visible: true, identity: 'notifications' },
    { visible: false, identity: 'requests' },
    { visible: false, identity: 'deletionRequests' }
  ];

  notificationTypeCodes: any = {
    'NOTIFICATIONS': 1,
    'REQUESTS': 2,
    'PROJECT_DELETION_REQUESTS': 3
  };

  notificationTypes: any = [
    { id: 1, text: 'Notifications' },
    { id: 2, text: 'Project permission requests' },
    { id: 3, text: 'Project deletion requests' },
  ];

  constructor(private notificationService: NotificationService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router,
    private projectService: ProjectService) {

  }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
        this.errorModal.openModal();
        this.blockUI.stop();
      }
    });

    this.getNotifications();
    this.getProjectRequests();
    this.getProjectDeletionRequests();
    this.displayOption = this.notificationTypeCodes.NOTIFICATIONS;
  }

  showNotificationType() {
    if (this.displayOption == this.notificationTypeCodes.NOTIFICATIONS) {
      this.showNotifications();
    } else if (this.displayOption == this.notificationTypeCodes.REQUESTS) {
      this.showRequests();
    } else if (this.displayOption == this.notificationTypeCodes.PROJECT_DELETION_REQUESTS) {
      this.showDeletionRequests();
    }
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

  showNotifications() {
    this.manageTabsDisplay(this.tabConstants.NOTIFICATIONS);
  }

  showRequests() {
    this.manageTabsDisplay(this.tabConstants.REQUESTS);
  }

  showDeletionRequests() {
    this.manageTabsDisplay(this.tabConstants.DELETION_REQUESTS);
  }

  reloadPage() {
    location.reload();
  }

  getProjectRequests() {
    this.projectService.getProjectMembershipRequests().subscribe(
      data => {
        console.log(data);
        if (data) {
          this.projectRequests = data;
        }
        this.isLoading = false;
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

  stopScreenBlocker() {
    setTimeout(() => {
      this.blockUI.stop();
    }, 1000);
  }

}
