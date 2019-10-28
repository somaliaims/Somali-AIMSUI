import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { EnvelopeService } from '../services/envelope-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrencyService } from '../services/currency.service';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';
import { EnvelopeTypeService } from '../services/envelope-type.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  btnText: string = 'Save envelope data';
  permissions: any = {};
  userOrganizationId: number = 0;
  manualExchangeRate: number = 0;

  envelopeTypes: any = [];
  yearsList: any = [];
  currenciesList: any = [];
  exchangeRates: any = [];
  isError: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCurrency: string = null;
  exchangeRate: number = 0;
  oldExchangeRate: number = 0;
  defaultExchangeRate: number = 0;
  currentExchangeRate: number = 0;
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  exRateSource: string = null;
  model: any = { currency: null, exchangeRate: 1 };
  envelopeData: any = { funderId: 0, funderName: null, currency: null, yearlyBreakup: [] };
  envelopeBreakups: any = [];
  envelopeSectorsBreakups: any = [];
  previousYear: number = 0
  currentYear: number = 0;
  nextYear: number = 0;
  numberLength: number = 11;
  yearlyTotals: any = {
    previousYear: 0,
    currentYear: 0,
    nextYear: 0
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private envelopeTypeService: EnvelopeTypeService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.entry);
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }

    this.getAverageExchangeRates();
    this.getCurrenciesList();
    this.getEnvelopeData();
    this.currentYear = this.storeService.getCurrentYear();
    this.previousYear = (this.currentYear - 1);
    this.nextYear = (this.currentYear + 1);
  }

  getEnvelopeTypes() {
    this.envelopeTypeService.getAllEnvelopeTypes().subscribe(
      data => {
        if (data) {
          this.envelopeTypes = data;
        }
      }
    );
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
          if (this.defaultCurrency) {
            var exRate = this.exchangeRates.filter(e => e.currency == this.model.currency);
            if (exRate.length > 0) {
              this.defaultExchangeRate = exRate[0].rate;
            }
          }
        }
      }
    );
  }

  getAverageExchangeRates() {
    var model = {
      dated: this.storeService.getCurrentDateSQLFormat()
    };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        this.exchangeRates = data;
        this.getDefaultCurrency();
      }
    );
  }

  getExchangeRateForCurrency() {
    if (this.model.currency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.model.currency);
      if (this.model.exchangeRate > 0) {
        if (exRate.length > 0) {
          if (this.model.exchangeRate > 0) {
            this.envelopeData.envelopeBreakupsByType.forEach((b) => {
              b.yearlyBreakup.forEach((y) => {
                y.amount = parseFloat((y.amount * (exRate[0].rate / this.model.exchangeRate)).toString()).toFixed(2);
              });
            });
          }
          this.model.exchangeRate = exRate[0].rate;
        }
      } else {
        this.model.exchangeRate = exRate[0].rate;
      }
    } else {
      this.model.exchangeRate = 1;
    }
    this.calculateYearlyTotal();
  }

  getEnvelopeData() {
    this.blockUI.start('Loading envelope data...');
    this.envelopeService.getEnvelopForFunder().subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
          if (this.envelopeData.currency) {
            this.model.currency = this.envelopeData.currency;
          }
          this.calculateYearlyTotal();
        }
        this.blockUI.stop();
      }
    );
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesForUser().subscribe(
      data => {
        if (data) {
          this.currenciesList = data;
        }
      }
    );
  }
  
  handleNullAmount(amount: number) {
    if (amount == null) {
      return 0;
    }
    return amount;
  }

  preventInput(event) {
    let value = event.currentTarget.value;
    if (value >= 99999999999) {
      event.preventDefault();
      event.currentTarget.value = parseInt(value.toString().substring(0, 10));
    }

    setTimeout(() => {
      if (value > 0) {
        this.calculateYearlyTotal();
      }
    }, 500);
  }

  saveEnvelopeData() {
    if (!this.model.currency) {
      this.errorMessage = 'Please select a currency for envelope';
      this.errorModal.openModal();
      return false;
    }

    var envelopeBreakups = [];
    this.envelopeData.envelopeBreakupsByType.forEach((b) => {
      var eTypeId = b.envelopeTypeId;
      b.yearlyBreakup.forEach((y) => {
        envelopeBreakups.push({
          envelopeTypeId: eTypeId,
          year: y.year,
          amount: y.amount
        });
      });
    });

    var model = {
      currency: this.model.currency,
      exchangeRate: this.model.exchangeRate,
      envelopeBreakups: envelopeBreakups
    }

    this.blockUI.start('Saving envelope...');
    this.envelopeService.addEnvelope(model).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  calculateYearlyTotal() {
    for (var year = this.previousYear; year <= this.nextYear; year++) {
      var totalAmountForYear = 0;
      if (this.envelopeData.envelopeBreakupsByType) {
        this.envelopeData.envelopeBreakupsByType.forEach((b) => {
          var yearlyData = b.yearlyBreakup.filter(y => y.year == year);
          if (yearlyData.length > 0) {
            var amountToAdd = 0;
            if (isNaN(yearlyData[0].amount)) {
              amountToAdd = 0;
            } else {
              amountToAdd = yearlyData[0].amount;
            }
            totalAmountForYear += Math.round(parseFloat((amountToAdd).toString()));
          }
        });
      }
      this.yearlyTotals[year] = totalAmountForYear.toFixed(2);
    }
  }

  

}
