import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { filter } from 'rxjs/operators';

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
  isLoading: boolean = true;
  isAPIKeySet: boolean = false;
  defaultCurrency: string = null;
  currenciesList: any = [];
  exchangeRates: any = [];
  exchangeRateDate: any = null;
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
    this.getLatestExchangeRates();
  }

  getExRateSettings() {
    this.currencyService.getExRateSettings().subscribe(
      data => {
        if (data) {
          this.model.isAutoRateSet = data.isAutomatic;
          this.isAPIKeySet = data.isOpenExchangeKeySet;
          this.manualCurrencyRates = data.manualCurrencyRates ? data.manualCurrencyRates : [];
          if (this.manualCurrencyRates.length == 0) {
            this.isExRateSet = false;
            this.getCurrenciesList();
          } else {
            this.filteredCurrencyRates = this.manualCurrencyRates;
            this.isLoading = false;
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
        this.isLoading = false;
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
    if (!this.criteria) {
      this.filteredCurrencyRates = this.manualCurrencyRates;
    } else {
      if (this.manualCurrencyRates.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredCurrencyRates = this.manualCurrencyRates.filter(c => c.currency.toLowerCase().indexOf(criteria) != -1);
      }
    }
  }

  setCurrencyExRate(e) {
    var currencyName = e.target.id;
    var currency = this.manualCurrencyRates.filter(c => c.currency == currencyName);
    if (currency.length > 0) {
      currency[0].rate = parseFloat(e.target.value);
    }
  }

  saveExchangeRates() {
    if (this.filteredCurrencyRates.length == 0) {
      this.errorMessage = Messages.INVALID_EXRATE_SAVE;
      this.errorModal.openModal();
      return false;
    }

    this.filteredCurrencyRates.forEach(function (cur) {
      var currency = this.manualCurrencyRates.filter(c => c.currency == cur.currency);
      currency.rate = cur.rate;
    }.bind(this));

    this.blockUI.start('Saving exchange rates...');
    var model = {
      rates: this.manualCurrencyRates
    }
    this.currencyService.saveManualCurrencyRates(model).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    )
  }

  getLatestExchangeRates() {
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data) {
          this.exchangeRateDate = this.storeService.getLongDateString(data.dated);
          this.exchangeRates = data.rates;
        }
      }
    )
  }

}
