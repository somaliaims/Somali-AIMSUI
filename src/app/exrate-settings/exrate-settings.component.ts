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
  inputTextHolder: string = 'Enter currency to search';
  infoMessage: string = null;
  requestNo: number = 0;
  permissions: any = {};
  isExRateSet: boolean = false;
  isAPIKeySet: boolean = false;
  defaultCurrency: string = null;
  currenciesList: any = [];
  manualCurrencyRates: any = [];
  filteredCurrencyRates: any = [];
  criteria: string = null;
  model: any = { isAutoRateSet: false, apiKey: null};
  
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
    this.getDefaultCurrency();
  }

  getExRateSettings() {
    this.currencyService.getExRateSettings().subscribe(
      data => {
        if (data) {
          this.model.isAutoRateSet = data.isAutomatic;
          this.isAPIKeySet = data.isOpenExchangeKeySet;
          this.manualCurrencyRates = data.ManualCurrencyRates ? data.manualCurrencyRates : [];
          if (this.manualCurrencyRates.length == 0) {
            this.isExRateSet = false;
            this.getCurrenciesList();
          }
        }
      }
    )
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
        }
      }
    )
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data) {
          this.currenciesList = data;
          this.currenciesList.forEach(function(cur) {
            var currencyObj = {
              currency: cur.currency,
              rate: 0.0
            }
            this.manualCurrencyRates.push(currencyObj);
            this.filteredCurrencyRates.push(currencyObj);
          }.bind(this));
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
        }
        this.blockUI.stop();
      }
    )
  }

  filterCurrencies() {
    var filtered = this.currenciesList.filter(c => c.currency.toLowerCase() == this.criteria.toLowerCase());
    if (filtered.length > 0) {

    }
  }

  saveExchangeRates() {

  }

}
