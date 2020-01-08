import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { FinancialYearService } from '../services/financial-year.service';

@Component({
  selector: 'app-exrate-settings',
  templateUrl: './exrate-settings.component.html',
  styleUrls: ['./exrate-settings.component.css']
})
export class ExrateSettingsComponent implements OnInit {

  errorMessage: string = null;
  inputTextHolder: string = 'Enter currency to search';
  infoMessage: string = null;
  defaultCurrencyId: number = 0;
  nationalCurrencyId: number = 0;
  requestNo: number = 0;
  permissions: any = {};
  calendarMaxDate: any = {};
  isExRateSet: boolean = false;
  isLoading: boolean = true;
  isAPIKeySet: boolean = false;
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  selectedCurrency: string = null;
  
  currenciesList: any = [];
  exchangeRates: any = [];
  currentForm: any = null;
  exchangeRateDate: any = null;
  manualCurrencyRates: any = [];
  manualExchangeRates: any = [];
  filteredManualExchangeRates: any = [];
  filteredCurrencyRates: any = [];
  financialYearsList: any = [];

  criteria: string = null;
  pagingSize: number = Settings.rowsPerPage;
  model: any = { exchangeRate: null, searchYear: null, currency: null, newYear: null, exRateLabel: null};
  currentTab: string = 'exrates';
  manualExRateLabel: string = 'Central Bank exchange rate';

  displayTabs: any = [
    { visible: true, identity: 'exrates' },
    { visible: false, identity: 'open-exrates' },
    { visible: false, identity: 'label-setting' }
  ];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private currencyService: CurrencyService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private securityService: SecurityHelperService, private router: Router,
    private yearService: FinancialYearService) { }

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

    this.calendarMaxDate = this.storeService.getCalendarUpperLimit();
    this.getFinancialYears();
    this.getExRateSettings();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getCurrenciesList();
    this.getLatestExchangeRates();
    this.getManualExchangeRates();
  }

  getExRateSettings() {
    this.currencyService.getExRateSettings().subscribe(
      data => {
        if (data) {
          this.model.isAutoRateSet = data.isAutomatic;
          this.isAPIKeySet = data.isOpenExchangeKeySet;
          this.manualExRateLabel = data.manualExchangeRateSource;
          this.model.exRateLabel = this.manualExRateLabel;
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
          this.defaultCurrencyId = data.id;
        }
      }
    )
  }

  getNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency = data.currency;
          this.nationalCurrencyId = data.id;
          this.getManualExchangeRates();
        }
      }
    )
  }

  getManualExchangeRates() {
    this.currencyService.getManualExchangeRates().subscribe(
      data => {
        if (data) {
          this.manualExchangeRates = data;
          this.filteredManualExchangeRates = data;
        }
        this.isLoading = false;
      }
    );
  }

  getExRateForSelectedCurrency() {
    if (this.model.currency) {
      var findExRate = this.exchangeRates.filter(c => c.currency == this.model.currency);
      if (findExRate.length > 0) {
        this.model.exchangeRate = findExRate[0].rate;
      }
    }
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

  getFinancialYears() {
    this.yearService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYearsList = data;
        }
      }
    );
  }

  onChangeYear() {
    if (this.model.newYear) {
      this.filteredManualExchangeRates = this.manualExchangeRates.filter(r => r.year == this.model.newYear);
    } else {
      this.filteredManualExchangeRates = this.manualExchangeRates;
    }
  }

  saveRate(frm: any) {
    this.currentForm = frm;
    if (!this.model.exchangeRate || this.model.currency == 'null') {
      this.errorMessage = "Exchange rate is required";
      this.errorModal.openModal();
      return false;
    } else if (!this.model.currency || this.model.currency == 'null') {
      this.errorMessage = "Currency is required";
      this.errorModal.openModal();
      return false;
    } else if (!this.model.newYear || this.model.newYear == 'null') {
      this.errorMessage = "Year is required";
      this.errorModal.openModal();
      return false;
    }

    var model = {
      exchangeRate: this.model.exchangeRate,
      currency: this.model.currency,
      defaultCurrency: this.defaultCurrency,
      year: this.model.newYear
    }

    this.blockUI.start('Saving exchange rate...');
    this.currencyService.saveManualExchangeRates(model).subscribe(
      data => {
        if (data) {
          var isRateExist = this.manualExchangeRates.filter(m => m.year == model.year && m.currency == model.currency);
          if (isRateExist.length > 0) {
            isRateExist[0].exchangeRate = model.exchangeRate;
          } else {
            this.manualExchangeRates.push(model);
            this.filteredManualExchangeRates.push(model);
            this.model.searchYear = null;
          }
          //this.currentForm.resetForm();
          this.model.searchYear = null;
          this.model.exchangeRate = null;
          //this.model.newYear = null;
          this.model.currency = null;
        }
        this.blockUI.stop();
      }
    )
  }

  deleteRate(e) {
    var id = e.currentTarget.id.split('-')[1];

    if (id) {
      this.blockUI.start('Deleting exchange rate...');
      this.currencyService.deleteManualExchangeRate(id).subscribe(
        data => {
          if (data) {
            this.manualExchangeRates = this.manualExchangeRates.filter(r => r.id != id);
            this.filteredManualExchangeRates = this.manualExchangeRates;
            this.model.searchDate = null;
          }
          this.blockUI.stop();
        }
      )
    }
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

  filterExchangeRates() {
    if (!this.model.searchYear || this.model.searchYear == 'null') {
      this.filteredManualExchangeRates = this.manualExchangeRates;
    } else {
      if (this.manualExchangeRates.length > 0) {
        var searchYear = this.model.searchYear;
        this.filteredManualExchangeRates = this.manualExchangeRates.filter(m => m.year == searchYear);
      }
    }
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
          if (data.rates) {
            this.exchangeRates = data.rates;
          }
        }
      }
    );
  }

  formatDate(dated: string) {
    return (this.storeService.getLongDateString(dated));
  }

  showAllManualRates() {
    this.model.searchYear = null;
    this.filteredManualExchangeRates = this.manualExchangeRates;
  }

  searchManualRates() {
    if (!this.model.searchDate) {
      this.filteredManualExchangeRates = this.manualExchangeRates;
    }
    var dated = new Date(this.model.searchDate.year + '-' + this.model.searchDate.month + '-' +
    this.model.searchDate.day);
    var longDate = this.storeService.getLongDateString(dated);
    this.filteredManualExchangeRates = this.manualExchangeRates.filter(r => this.storeService.getLongDateString(r.dated) == longDate);
  }

  showExRates() {
    this.manageTabsDisplay('exrates');
  }

  showOpenExRates() {
    this.manageTabsDisplay('open-exrates');
  }

  showLabelSetting() {
    this.manageTabsDisplay('label-setting');
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  saveManualRatesLabel(frm) {
    if (!this.model.exRateLabel) {
      this.errorMessage = 'Enter valid label for manual entry of exchange rates';
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Setting label...');
    this.currencyService.setLabelForManualExRates(this.model.exRateLabel).subscribe(
      data => {
        if (data) {
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
        frm.resetForm();
      }
    );
    
  }

}
