import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  isLoading: boolean = true;
  showNoFound: boolean = false;
  infoMessage: string = '';

  constructor(private notificationService: NotificationService, private modalService: NgxSmartModalService) { 
    this.getNotifications();
  }

  ngOnInit() {
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
    },
    error => {
      console.log("Request Failed: ", error);
    });
  }

  refreshNotifications(id) {

  }

  activateUserAccount(event, userId, notificationId) {
    this.notificationService.activateUserAccount(userId, notificationId).subscribe(data => {
      this.infoMessage = 'User account is activated successfully';
      this.modalService.getModal('infoModal').open();
    },
    error => {
      console.log(error);
    });
  }

}
