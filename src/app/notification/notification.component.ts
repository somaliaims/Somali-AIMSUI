import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  constructor(private notificationService: NotificationService) { 
    this.getNotifications();
  }

  ngOnInit() {
  }

  getNotifications() {
    this.notificationService.getUserNotifications().subscribe( data => {
      if (data && data.length) {
        if (data.length > 0) {
          this.notifications = data;
        }
      }
    },
    error => {
      console.log("Request Failed: ", error);
    });
  }

  activateUserAccount(event, id) {
    this.notificationService.activateUserAccount(id).subscribe(data => {
      console.log('Account activated: ' + data);
    },
    error => {
      console.log(error);
    });
  }

}
