import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { EnvelopeService } from '../services/envelope-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrencyService } from '../services/currency.service';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  btnText: string = 'Save envelope data';
  permissions: any = {};
  userOrganizationId: number = 0;
  totalFundingAmount: number = 0;
  totalActualAmount: number = 0;
  totalExpectedAmount: number = 0;
  totalManualAmount: number = 0;
  manualExchangeRate: number = 0;
  yearsList: any = [];
  currenciesList: any = [];
  exRatesList: any = [];
  isError: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCurrency: string = null;
  exchangeRate: number = 0;
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  exRateSource: string = null;
  oldCurrency: string = null;
  envelopeData: any = { funderId: 0, funderName: '', totalFunds: 0.0, sectors: [] };
  envelopeBreakups: any = [];
  envelopeSectorsBreakups: any = [];

  exRateSources: any = [
    { id: 1, value: 'Open exchange api' },
    { id: 2, value: 'African bank' }
  ];

  exRateSourceCodes: any = {
    'OPEN_EXCHANGE': 1,
    'AFRICAN_BANK': 2
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private storeService: StoreService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }

    this.errorMessage = Messages.INVALID_ENVELOPE;
    this.getFunderEnvelope();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getExchangeRates();
    this.getManualExchangeRateForToday();
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data) {
          this.currenciesList = data;
        }
      }
    )
  }

  getExchangeRates() {
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data) {
          this.exRatesList = data.rates;
        }
      }
    )
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    this.currencyService.getManualExRatesByDate(dated).subscribe(
      data => {
        if (data) {
          if (data.exchangeRate) {
            this.manualExchangeRate = data.exchangeRate;
          }
        }
      });
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
          this.currenciesList.push(data);
        }
      }
    )
  }

  getNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency = data.currency;
          this.currenciesList.push(data);
        }
      }
    );
  }

  getFunderEnvelope() {
    this.envelopeService.getEnvelopForFunder().subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
          if (this.envelopeData.envelopeBreakups) {
            this.totalFundingAmount = this.envelopeData.expectedFunds;
            this.selectedCurrency = this.envelopeData.currency;
            this.exchangeRate = this.envelopeData.exchangeRate;
            this.oldCurrency = this.selectedCurrency;
            this.envelopeBreakups = this.envelopeData.envelopeBreakups;
            this.envelopeSectorsBreakups = this.envelopeData.sectors;
            this.yearsList = this.envelopeData.envelopeBreakups.map(y => y.year);

            if (!this.exchangeRate) {
              this.exchangeRate = this.getExchangeRate(this.selectedCurrency);
            }
          }
        }
        this.isLoading = false;
      }
    )
  }

  handleNullAmount(amount: number) {
    if (amount == null) {
      return 0;
    }
    return amount;
  }

  saveEnvelopeData() {
    if (this.isError) {
      this.errorModal.openModal();
      return false;
    }
    
    var model = {
      funderId: this.envelopeData.funderId,
      currency: this.selectedCurrency,
      sectorBreakups: this.envelopeSectorsBreakups,
      exchangeRate: this.getExchangeRate(this.selectedCurrency)
    }

    this.blockUI.start('Saving envelope...');
    this.envelopeService.addEnvelope(model).subscribe(
      data => {
        if (data) {

        }
        this.blockUI.stop();
      }
    )
  }

  checkIfFundsAllocationNormal(year: number, sectorId: number) {
    var sectorActualAllocation = 0;
    var sectorExpectedAmount = 0;
    var sectorManualAllocation = 0;
    var differenceInAmount = 0;
    var sectorAllocations = this.envelopeSectorsBreakups.filter(e => e.sectorId == sectorId);
    var yearlyAllocation = sectorAllocations.filter(a => a.year == year);
    if (yearlyAllocation.length > 0) {
      sectorActualAllocation = yearlyAllocation[0].actualAmount;
      sectorExpectedAmount = yearlyAllocation[0].expectedAmount;
      sectorManualAllocation = yearlyAllocation[0].manualAmount;

      if (sectorExpectedAmount > sectorActualAllocation) {
        differenceInAmount = sectorExpectedAmount - sectorActualAllocation;
      }

      if (sectorManualAllocation < differenceInAmount) {
        this.errorMessage = Messages.INVALID_ENVELOPE_MANUAL_AMOUNT;
        this.isError = true;
      } else {
        this.isError = false;
      }
    }
  }

  updateEnvelopeManualValue(e) {
    var newValue = e.target.value;
    if (newValue <= 0) {
      this.errorMessage = Messages.CANNOT_BE_ZERO;
      this.isError = true;
      return false;
    }

    this.isError = false;
    var arr = e.target.id.split('-');
    var year = arr[1];
    var sectorId = arr[2];

    if (year) {
      var envelopeArr = this.envelopeSectorsBreakups.filter(e => e.sectorId == sectorId);
      if (envelopeArr.length > 0) {
        var allocationArr = envelopeArr[0].yearlyAllocation.filter(a => a.year == year);
        if (allocationArr.length > 0) {
          allocationArr[0].manualAmount = newValue;

          var actualAmount = allocationArr[0].amount;
          var expectedAmount = allocationArr[0].expectedAmount;
          var amountDifference = 0;
          if (expectedAmount > actualAmount) {
            amountDifference = expectedAmount - actualAmount;
          }

          if (newValue < amountDifference) {
            this.errorMessage = Messages.INVALID_ENVELOPE_MANUAL_AMOUNT;
            this.isError = true;
            this.errorModal.openModal();
          }
        }
      }
    }
  }

  getSectorAllocation(percent: number, totalAmount: number) {
    return ((totalAmount / 100) * percent).toFixed(2);
  }

  selectExRateSource() {
    if (this.exRateSource != null) {
      this.getCurrencyRates(this.exRateSource);
    }
  }

  getCurrencyRates(eSource: string) {
    var exRate = 0;
    if (eSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
      this.convertExRatesToCurrency();
    } else if (eSource == this.exRateSourceCodes.AFRICAN_BANK) {
      if (this.selectedCurrency != this.nationalCurrency) {
        var calculatedRate = 0;

        if (this.oldCurrency != null) {
          calculatedRate = (1 / this.exchangeRate);
        } else {
          calculatedRate = 1;
        }
        exRate = calculatedRate;
      } else {
        calculatedRate = this.manualExchangeRate;
        if (calculatedRate == this.exchangeRate) {
          return false;
        } else if (this.selectedCurrency == this.oldCurrency) {
          var oldCurrencyRateArr = this.exRatesList.filter(ex => ex.currency == this.oldCurrency);
          if (oldCurrencyRateArr.length > 0) {
            exRate = calculatedRate;
            calculatedRate = (calculatedRate / oldCurrencyRateArr[0].rate);
          }
        }
      }
      if (exRate != 0) {
        this.exchangeRate = exRate;
      } else {
        this.exchangeRate = calculatedRate;
      }
      this.applyRateOnEnvelope(calculatedRate);
    }
  }

  convertExRatesToCurrency() {
    var currencyRate = 0;
    var defaultRate = 0;
    var oldCurrencyRate = 0;

    if (this.exRatesList.length > 0) {
      var currencyRateArr = this.exRatesList.filter(ex => ex.currency == this.selectedCurrency);
      var defaultRateArr = this.exRatesList.filter(ex => ex.currency == this.defaultCurrency);
      oldCurrencyRate = this.exchangeRate;

      if (defaultRateArr.length > 0) {
        defaultRate = defaultRateArr[0].rate;
      }

      if (currencyRateArr.length > 0) {
        currencyRate = currencyRateArr[0].rate;
        this.exchangeRate = currencyRate;
      }
      
    }
      
    if (this.selectedCurrency == this.oldCurrency && this.selectedCurrency == this.defaultCurrency) {
      return false; 
    }

    if (this.selectedCurrency != null && this.exRatesList.length > 0) {
      var calculatedRate = 0;
      calculatedRate = (currencyRate / oldCurrencyRate);
      this.applyRateOnEnvelope(calculatedRate);
    }
  }

  applyRateOnEnvelope(calculatedRate: number) {
    this.envelopeBreakups.forEach(e => {
      e.actualAmount = Math.round(parseFloat((e.actualAmount * calculatedRate).toFixed(2)));
      e.expectedAmount = Math.round(parseFloat((e.expectedAmount * calculatedRate).toFixed(2)));
      e.manualAmount = Math.round(parseFloat((e.manualAmount * calculatedRate).toFixed(2)));
    });

    var sectors = this.envelopeSectorsBreakups;
    sectors.forEach(function (sector) {
      var allocation = sector.yearlyAllocation.forEach(function (a) {
        a.amount = Math.round(parseFloat((a.amount * calculatedRate).toFixed(2)));
        a.expectedAmount = Math.round(parseFloat((a.expectedAmount * calculatedRate).toFixed(2)));
        a.manualAmount = Math.round(parseFloat((a.manualAmount * calculatedRate).toFixed(2)));
      });
    });

    this.totalFundingAmount = Math.round(parseFloat((this.totalFundingAmount * calculatedRate).toFixed(2)));
    this.oldCurrency = this.selectedCurrency;
  }

  getSectorActualTotalForYear(year: number) {
    var sectors = this.envelopeData.sectors;
    var sectorAllocation = 0;

    sectors.forEach(function (sector) {
      var allocation = sector.yearlyAllocation.filter(a => a.year == year);
      if (allocation.length > 0) {
        sectorAllocation += Math.round(parseFloat((allocation[0].amount).toFixed(2)));
      }
    });
    this.totalActualAmount = Math.round(parseFloat(sectorAllocation.toFixed(2)));
    return sectorAllocation;
  }

  getSectorExpectedTotalForYear(year: number) {
    var sectors = this.envelopeData.sectors;
    var sectorExpectedAllocation = 0;

    sectors.forEach(function (sector) {
      var allocation = sector.yearlyAllocation.filter(a => a.year == year);
      if (allocation.length > 0) {
        sectorExpectedAllocation += Math.round(parseFloat((allocation[0].expectedAmount).toFixed(2)));
      }
    });
    this.totalExpectedAmount = Math.round(parseFloat(sectorExpectedAllocation.toFixed(2)));
    return sectorExpectedAllocation;
  }

  getSectorManualTotalForYear(year: number) {
    var sectors = this.envelopeData.sectors;
    var sectorManualAllocation = 0;

    sectors.forEach(function (sector) {
      var allocation = sector.yearlyAllocation.filter(a => a.year == year);
      if (allocation.length > 0) {
        sectorManualAllocation += Math.round(parseFloat((allocation[0].manualAmount).toFixed(2)));
      }
    });
    this.totalManualAmount = Math.round(parseFloat(sectorManualAllocation.toFixed(2)));
    return sectorManualAllocation;
  }

  getExchangeRate(currency: string) {
    if (currency != null) {
      var exRate = this.exRatesList.filter(ex => ex.currency == currency);
      return exRate.length > 0 ? exRate[0].rate : 1;
    }
    return 1;
  }

}
