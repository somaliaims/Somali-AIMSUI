import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-exrate-settings',
  templateUrl: './exrate-settings.component.html',
  styleUrls: ['./exrate-settings.component.css']
})
export class ExrateSettingsComponent implements OnInit {

  errorMessage: string = null;
  infoMessage: string = null;
  requestNo: number = 0;
  permissions: any = {};
  isAPIKeySet: boolean = false;
  model: any = { isAutoRateSet: false, apiKey: null, manualCurrencyRates: []};
  
  @BlockUI() blockUI: NgBlockUI;
  constructor(private currencyService: CurrencyService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.getExRateSettings();
  }

  getExRateSettings() {
    this.currencyService.getExRateSettings().subscribe(
      data => {
        if (data) {
          this.model.isAutoRateSet = data.isAutomatic;
          this.isAPIKeySet = data.isOpenExchangeKeySet;
          this.model.manualCurrencyRates = data.ManualCurrencyRates ? data.manualCurrencyRates : [];
        }
      }
    )
  }

  toggleAuto() {
    if (this.model.isAutoRateSet) {
      this.model.isAutoRateSet = false;
    } else {
      this.model.isAutoRateSet = true;
    }
  }

  saveRateSettings() {
    this.blockUI.start('Saving ex. rate settings...')
    this.currencyService.saveExchangeRateAutoSettings(this.model.isAutoRateSet).subscribe(
      data => {
        if (data) {
          //this.infoMessage = 'Settings for exchange rates conversion saved successfully';
          //this.infoModal.openModal();
        }
        this.blockUI.stop();
      }
    );
  }

  saveAPIKey() {
    if (!this.model.apiKey) {
      this.errorMessage = Messages.INVALID_API_KEY;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving api key...');
    this.currencyService.saveAPIKeyOpenExchange(this.model.apiKey).subscribe(
      data => {
        if (data) {
          this.isAPIKeySet = true;
          this.model.apiKey = null;
          //this.infoMessage = 'New api key set successfully';
          //this.infoModal.openModal();
        }
        this.blockUI.stop();
      }
    )
  }

}
