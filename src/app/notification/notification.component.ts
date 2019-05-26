import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  isLoading: boolean = true;
  showNoFound: boolean = false;
  infoMessage: string = null;
  errorMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  permissions: any = {};
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private notificationService: NotificationService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router) { 
    
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
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

    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getUserNotifications().subscribe( data => {
      this.isLoading = false;
      if (data && data.length) {
        if (data.length > 0) {
          this.notifications = data;
          this.showNoFound = false;
        } 
      } else {
        this.showNoFound = true;
      }
    });
  }

  refreshNotifications(id) {

  }

  activateUserAccount(event, userId, notificationId) {
    if (userId && notificationId) {
      this.blockUI.start('Activating account...');
      this.notificationService.activateUserAccount(userId, notificationId).subscribe(data => {
        if (data) {
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      });
    }
  }

}
