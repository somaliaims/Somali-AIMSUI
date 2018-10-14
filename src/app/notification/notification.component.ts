import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any = [];
  isLoading: boolean = true;
  showNoFound: boolean = false;
  constructor(private notificationService: NotificationService) { 
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

  activateUserAccount(event, id) {
    this.notificationService.activateUserAccount(id).subscribe(data => {
      console.log('Account activated: ' + data);
    },
    error => {
      console.log(error);
    });
  }

}
