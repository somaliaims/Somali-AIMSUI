import { Component } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { HomePageService } from '../services/home-page.service';
import { StoreService } from '../services/store-service';

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
  loggedInAs: string = null;
  loggedInAsFullName: string = null;
  currentUrl: string = null;
  isReportActive: boolean = false;

  constructor(private securityService: SecurityHelperService, private router: Router,
    private notificationService: NotificationService, private homePageService: HomePageService,
    private storeService: StoreService) {
    this.isLoggedIn = (localStorage.getItem('isLoggedIn') == 'true');

    if (this.isLoggedIn) {
      this.getNotificationsCount();
      this.loggedInAsFullName = this.securityService.getUserOrganization();
      if (this.loggedInAsFullName && this.loggedInAsFullName != undefined) {
        this.loggedInAs = this.truncate(this.loggedInAsFullName, 25, null);
      }
    }

    this.storeService.currentReportItem.subscribe(menu => {
      switch(menu) {
        case 1:
          
          break;

        case 2:
          setTimeout(() => {
            this.isReportActive = true;
          }, 1000);
          
          break;

        case 3:
          break;
      }
    });
    this.currentUrl = this.router.url;
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

 truncate(string, length, delimiter) {
    delimiter = delimiter || "...";
    return string.length > length ? string.substr(0, length) + delimiter : string;
 };

  
}
