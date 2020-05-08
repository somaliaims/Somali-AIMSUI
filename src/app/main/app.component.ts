import { Component } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { HomePageService } from '../services/home-page.service';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  aimsTitle = null;
  isLoggedIn: boolean = false;
  isUnAffiliated: boolean = true;
  permissions: any = {};
  notificationsCount: number = 0;
  loggedInAs: string = null;
  loggedInAsFullName: string = null;
  currentUrl: string = null;
  isHomeActive: boolean = false;
  isProjectsActive: boolean = false;
  isReportActive: boolean = false;
  isManagementActive: boolean = false;
  isEntryActive: boolean = false;
  isHelpActive: boolean = false;
  isContactActive: boolean = false;
  isNotificationsActive: boolean = false;
  isBackupActive: boolean = false;
  menuConstants: any = Settings.dropDownMenusConstants;

  constructor(private securityService: SecurityHelperService, private router: Router,
    private notificationService: NotificationService, private homePageService: HomePageService,
    private storeService: StoreService) {

    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }

    this.isLoggedIn = (localStorage.getItem('isLoggedIn') == 'true');
    this.isUnAffiliated = (localStorage.getItem('isUnAffiliated') == 'true');

    if (this.isLoggedIn) {
      if (!this.isUnAffiliated) {
        this.getNotificationsCount();
      }
      this.loggedInAsFullName = this.securityService.getUserOrganization();
      if (this.loggedInAsFullName && this.loggedInAsFullName != undefined) {
        this.loggedInAs = this.truncate(this.loggedInAsFullName, 25, null);
      }
    } 


    this.storeService.currentReportItem.subscribe(menu => {
      setTimeout(() => {
        this.isHomeActive = false;
        this.isManagementActive = false;
        this.isProjectsActive = false;
        this.isEntryActive = false;
        this.isReportActive = false;
        this.isNotificationsActive = false;
        this.isContactActive = false;
        this.isHelpActive = false;
        this.isBackupActive = false;
      }, 500);

      switch (menu) {
        case this.menuConstants.HOME:
          setTimeout(() => {
            this.isHomeActive = true;
          }, 1000);
          break;

        case this.menuConstants.PROJECTS:
          setTimeout(() => {
            this.isProjectsActive = true;
          }, 1000);
          break;

        case this.menuConstants.DATA_ENTRY:
          setTimeout(() => {
            this.isEntryActive = true;
          }, 1000);
          break;

        case this.menuConstants.REPORTS:
          setTimeout(() => {
            this.isReportActive = true;
          }, 1000);
          break;

        case this.menuConstants.MANAGEMENT:
          setTimeout(() => {
            this.isManagementActive = true;
          }, 1000);
          break;

        case this.menuConstants.CONTACT:
          setTimeout(() => {
            this.isContactActive = true;
          }, 1000);
          break;

        case this.menuConstants.HELP:
          setTimeout(() => {
            this.isHelpActive = true;
          }, 1000);
          break;

          case this.menuConstants.BACKUP:
            setTimeout(() => {
              this.isBackupActive = true;
            }, 1000);
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
    this.notificationsCount = 0;
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
