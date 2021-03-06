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
import { FinancialYearService } from '../services/financial-year.service';

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
  yearsLoading: boolean = false;

  envelopeTypes: any = [];
  yearsList: any = [];
  financialYears: any = [];
  yearHelpLabels: any = [];
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
  areSettingsLoading: boolean = true;
  financialYearSettings: any = { 
    nextFinancialYearLabel: '', 
    month: 1, day: 1 };
  fyPreviousStartingDate: any = null;
  fyPreviousEndingDate: any = null;
  fyStartingDate: any = null;
  fyEndingDate: any = null;
  fyNextStartingDate: any = null;
  fyNextEndingDate: any = null;
  model: any = { currency: null, exchangeRate: 1 };
  envelopeData: any = { funderId: 0, funderName: null, currency: null, yearlyBreakup: [] };
  envelopeBreakups: any = [];
  envelopeSectorsBreakups: any = [];
  secondPreviousYear: number = 0;
  previousYear: number = 0
  currentYear: number = 0;
  nextYear: number = 0;
  numberLength: number = 11;
  yearlyTotals: any = {
    secondPreviousYear: 0,
    previousYear: 0,
    currentYear: 0,
    nextYear: 0
  };

  tooltipOptions = {
    'placement': 'top',
    'show-delay': 500
  }

  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private envelopeTypeService: EnvelopeTypeService,
    private yearsService: FinancialYearService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.entry);
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }

    this.getFinancialYearSettings();
    this.getFinancialYears();
    this.getAverageExchangeRates();
    this.getCurrenciesList();
    this.getEnvelopeData();
    this.currentYear = this.storeService.getCurrentYear();
    this.secondPreviousYear = (this.currentYear - 2);
    this.previousYear = (this.currentYear - 1);
    this.nextYear = (this.currentYear + 1);
    
  }

  getFinancialYearSettings() {
    this.yearsService.getSettings().subscribe(
      data => {
        if (data) {
          this.financialYearSettings.month = data.month;
          this.financialYearSettings.day = data.day;
          //this.financialYearSettings.currentFinancialYearLabel = data.currentFinancialYearLabel;

          var year = data.currentFinancialYear;
          var yearLabel = data.currentFinancialYearLabel;
          var previousYear = data.previousFinancialYear;
          var previousYearLabel = data.previousFinancialYearLabel;
          var secondPreviousYear = data.secondPreviousFinancialYear;
          var secondPreviousYearLabel = data.secondPreviousFinancialYearLabel;
          var nextYear = data.nextFinancialYear;
          var nextYearLabel = data.nextFinancialYearLabel;
          var month = data.month;
          var day = data.day;
          
          var secondPreviousStartingDate = new Date(secondPreviousYear, (month - 1), day).toDateString();
          var spEndDate = new Date(secondPreviousYear, (month - 1), day - 1);
          var secondPreviousEndingDate = new Date(secondPreviousYear, spEndDate.getMonth(), spEndDate.getDate()).toDateString();
          this.yearHelpLabels.push({
            year: secondPreviousYear,
            label: secondPreviousYearLabel,
            startingDate: secondPreviousStartingDate,
            endingDate: secondPreviousEndingDate
          });

          var previousStartingDate = new Date(previousYear, (month - 1), day).toDateString();
          var pEndDate = new Date(previousYear, (month - 1), day - 1);
          var previousEndingDate = new Date(previousYear, pEndDate.getMonth(), pEndDate.getDate()).toDateString();
          this.yearHelpLabels.push({
            year: previousYear,
            label: previousYearLabel,
            startingDate: previousStartingDate,
            endingDate: previousEndingDate
          });

          var startingDate = new Date(year, (month - 1), day).toDateString();
          var endDate = new Date(year, (month - 1), day - 1);
          var endingDate = new Date(year, endDate.getMonth(), endDate.getDate()).toDateString();
          this.yearHelpLabels.push({
            year: year,
            label: yearLabel,
            startingDate: startingDate,
            endingDate: endingDate
          });
          

          var nextStartingDate = new Date(nextYear, (month - 1), day).toDateString();
          var nEndDate = new Date(nextYear, (month - 1), day - 1);
          var nextEndingDate = new Date(nextYear, nEndDate.getMonth(), nEndDate.getDate()).toDateString();
          this.yearHelpLabels.push({
            year: nextYear,
            label: nextYearLabel,
            startingDate: nextStartingDate,
            endingDate: nextEndingDate
          });
        }
        this.areSettingsLoading = false;
      }
    );
  }

  getFinancialYearLabel(year) {
    var yearLabel = '';
    var label = this.yearHelpLabels.filter(y => y.year == year);
    if (label.length > 0) {
      yearLabel = label[0].label + ' starts on ' + label[0].startingDate + ' and ends on ' + label[0].endingDate;
    }
    return yearLabel;
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

  getFinancialYears() {
    this.yearsService.getYearsForEnvelopeEntry().subscribe(
      data => {
        this.yearsList = data
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
          envelopeTypeId: parseInt(eTypeId),
          year: parseInt(y.year),
          amount: parseFloat(y.amount)
        });
      });
    });

    var model = {
      currency: this.model.currency,
      exchangeRate: parseFloat(this.model.exchangeRate),
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
    for (var year = this.secondPreviousYear; year <= this.nextYear; year++) {
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

  formatNumber(value: number) {
    value = Math.trunc(value);
    return this.storeService.getNumberWithCommas(value);
  }

}
