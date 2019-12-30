import { Component, OnInit } from '@angular/core';
import { IATIService } from '../services/iati.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-iati-settings',
  templateUrl: './iati-settings.component.html',
  styleUrls: ['./iati-settings.component.css']
})
export class IatiSettingsComponent implements OnInit {

  btnText: string = 'Save IATI Settings';
  errorMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  infoMessage: string = null;
  countriesList: any = [];
  model = { baseUrl: null, countryCode: null };
  permissions: any = {};
  isLoading: boolean = true;

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private iatiService: IATIService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent,
    private securityService: SecurityHelperService,
    private router: Router, private storeService: StoreService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canDoSMTPSettings) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getCountriesList();
  }

  getCountriesList() {
    this.iatiService.getIATICountries().subscribe(
      data => {
        if (data) {
          var countries = data;
          this.countriesList = countries;
          var activeCountry = countries.filter(c => c.isActive == true);
          if (activeCountry.length > 0) {
            setTimeout(() => {
              this.model.countryCode = activeCountry[0].code;
            }, 2000);
          }
        }
        this.isLoading = false;
      }
    );
  }

  setActiveCountry() {
    var countryCode = this.model.countryCode;
    this.blockUI.start('Saving changes...');
    this.iatiService.setActiveCountry(countryCode).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  getIATISettings() {
    this.iatiService.getIATISettings().subscribe(
      data => {
        this.model.baseUrl = data.baseUrl;
      }
    )
  }

  saveIATISettings() {
    if (this.model.baseUrl == null) {
      this.errorMessage = Messages.INVALID_INPUT;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving IATI Settings');
    this.iatiService.setIATISettings(this.model).subscribe(
      data => {
        this.infoMessage = 'IATI Settings' + Messages.SAVED_SUCCESSFULLY;
        this.blockUI.stop();
        this.infoModal.openModal();
      },
      error => {
        this.blockUI.stop();
        this.errorMessage = 'An error occurred: ' + error;
        this.errorModal.openModal();
      }
    )
  }

}
