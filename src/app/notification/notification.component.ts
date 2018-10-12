import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private notificationService: NotificationService) { 
    this.getNotifications();
  }

  ngOnInit() {
  }

  getNotifications() {
    this.notificationService.getUserNotifications().subscribe( data => {
      console.log(data);
      if (data) {
        
      }
    },
    error => {
      console.log("Request Failed: ", error);
    });
  }

}
