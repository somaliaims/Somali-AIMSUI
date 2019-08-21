import { Component } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { HomePageService } from '../services/home-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  aimsTitle = null;
  isLoggedIn: boolean = false;
  permissions: any = {};
  notificationsCount: number = 0;


  constructor(private securityService: SecurityHelperService, private router: Router,
    private notificationService: NotificationService, private homePageService: HomePageService) {
    this.isLoggedIn = (localStorage.getItem('isLoggedIn') == 'true');

    if (this.isLoggedIn) {
      this.getNotificationsCount();
    }
  }

  ngOnInit() {
    this.getHomePageSettings();
    this.permissions = this.securityService.getUserPermissions();
  }

  getNotificationsCount() {
    this.notificationService.getNotificationsCount().subscribe(
      data => {
        if (data) {
          this.notificationsCount = data;
        }
      }
    );
  }

  logout(e) {
    this.securityService.clearLoginSession();
    this.router.navigateByUrl('/home');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  getHomePageSettings() {
    this.homePageService.getHomePageSettings().subscribe(
      data => {
        if (data) {
          this.aimsTitle = data.aimsTitle;
        }
      }
    );
  }

  
}
