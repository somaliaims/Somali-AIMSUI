import { Component, OnInit } from '@angular/core';
import { Settings } from '../config/settings';
import { HomePageService } from '../services/home-page.service';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-home-page-settings',
  templateUrl: './home-page-settings.component.html',
  styleUrls: ['./home-page-settings.component.css']
})
export class HomePageSettingsComponent implements OnInit {
  introductionLimit: number = Settings.introductionLimit;
  introductionLimitLeft: number = Settings.introductionLimit;
  permissions: any = {};
  requestNo: number = 0;
  errorMessage: string = null;
  isSuccess: boolean = false;
  successMessage: string = 'Home page settings saved successfully';
  model: any = { aimsTitle: null, introductionHeading: null, introductionText: null };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private homePageService: HomePageService, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.getHomePageSettings();
  }

  getHomePageSettings() {
    this.blockUI.start('Loading data...');
    this.homePageService.getHomePageSettings().subscribe(
      data => {
        if (data) {
          this.model = data;
        }
        this.blockUI.stop();
      }
    );
  }

  saveHomePageSettings() {
    this.isSuccess = false;
    this.blockUI.start('Saving settings');
    this.homePageService.setHomePageSettings(this.model).subscribe(
      data => {
        if (data) {
          this.isSuccess = true;
        }
        this.blockUI.stop();
      }
    );
  }

  getIntroductionLimitInfo() {
    this.introductionLimitLeft = (this.introductionLimit - this.model.introductionText.length);
    if (this.introductionLimitLeft < 0) {
      this.model.introductionText = this.model.introductionText.substring(0, (this.introductionLimit - 1));
    }
  }

}
