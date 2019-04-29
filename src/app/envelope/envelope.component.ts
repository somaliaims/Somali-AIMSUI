import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { EnvelopeService } from '../services/envelope-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrencyService } from '../services/currency.service';
import { Messages } from '../config/messages';

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
  yearsList: any = [];
  currenciesList: any = [];
  exRatesList: any = [];
  isError: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedCurrency: string = null;
  defaultCurrency: string = null;
  oldCurrency: string = null;
  envelopeData: any = { funderId: 0, funderName: '', totalFunds: 0.0, sectors: [] };
  envelopeBreakups: any = [];
  envelopeSectorsBreakups: any = [];
  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }

    this.errorMessage = Messages.INVALID_ENVELOPE;
    this.getFunderEnvelope();
    this.getCurrenciesList();
    this.getDefaultCurrency();
    this.getExchangeRates();
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

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
        }
      }
    )
  }

  getFunderEnvelope() {
    this.envelopeService.getEnvelopForFunder().subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
          if (this.envelopeData.envelopeBreakups) {
            this.totalFundingAmount = this.envelopeData.expectedFunds;
            this.selectedCurrency = this.envelopeData.currency;
            this.oldCurrency = this.selectedCurrency;
            this.envelopeBreakups = this.envelopeData.envelopeBreakups;
            this.envelopeSectorsBreakups = this.envelopeData.sectors;
            this.yearsList = this.envelopeData.envelopeBreakups.map(y => y.year);
            //this.checkIfFundsAllocationNormal();
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
    var totalAmount = 0;
    this.envelopeBreakups.forEach(function (e) {

    });

    var model = {
      funderId: this.envelopeData.funderId,
      currency: this.selectedCurrency,
      envelopeBreakups: this.envelopeBreakups
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
    /*var amounts = this.envelopeBreakups.map(e => e.actualAmount);
    var amountsTotal = amounts.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    if (amountsTotal < this.totalFundingAmount) {
      this.isError = true;
    } else {
      this.isError = false;
    }*/
    var sectorActualAllocation = 0;
    var sectorManualAllocation = 0;
    var sectorAllocations = this.envelopeSectorsBreakups.filter(e => e.sectorId == sectorId);
    var yearlyAllocation = sectorAllocations.filter(a => a.year == year);
    if (yearlyAllocation.length > 0) {
      sectorActualAllocation = yearlyAllocation[0].actualAmount;
    }
  }

  updateEnvelpeManualValue(e) {
    var newValue = e.target.value;
    if (newValue <= 0) {
      return false;
    }

    var arr = e.target.id.split('-');
    var year = arr[1];
    var sectorId = arr[2];

    if (year) {
      var envelopeArr = this.envelopeSectorsBreakups.filter(e => e.sectorId == sectorId && e.year == year);
      if (envelopeArr.length > 0) {
        envelopeArr[0].manualAmount = newValue;
      }
    }
    this.checkIfFundsAllocationNormal(year, sectorId);
  }

  /*updateEnvelpeExpectedValue(e) {
    var newValue = e.target.value;
    var year = e.target.id.split('-')[1];
    if (year) {
      var envelopeArr = this.envelopeBreakups.filter(e => e.year == year);
      if (envelopeArr.length > 0) {
        envelopeArr[0].expectedAmount = newValue;
      }
    }
    this.checkIfFundsAllocationNormal();
  }*/

  getSectorAllocation(percent: number, totalAmount: number) {
    return ((totalAmount / 100) * percent).toFixed(2);
  }

  convertExRatesToCurrency() {
    if (this.selectedCurrency != null && this.exRatesList.length > 0) {
      var currencyRateArr = this.exRatesList.filter(ex => ex.currency == this.selectedCurrency);
      var defaultRateArr = this.exRatesList.filter(ex => ex.currency == this.defaultCurrency);
      var oldCurrencyRateArr = this.exRatesList.filter(ex => ex.currency == this.oldCurrency);
      var currencyRate = 0;
      var defaultRate = 0;
      var oldCurrencyRate = 0;

      if (defaultRateArr.length > 0) {
        defaultRate = defaultRateArr[0].rate;
      }

      if (currencyRateArr.length > 0) {
        currencyRate = currencyRateArr[0].rate;
      }

      if (oldCurrencyRateArr.length > 0) {
        oldCurrencyRate = oldCurrencyRateArr[0].rate;
      }

      var calculatedRate = 0;
      calculatedRate = (currencyRate / oldCurrencyRate);

      this.envelopeBreakups.forEach(e => {
        e.actualAmount = Math.round(parseFloat((e.actualAmount * calculatedRate).toFixed(2)));
        e.expectedAmount = Math.round(parseFloat((e.expectedAmount * calculatedRate).toFixed(2)));
      });

      var sectors = this.envelopeData.sectors;
      sectors.forEach(function (sector) {
        var allocation = sector.yearlyAllocation.forEach(function (a) {
          a.amount = Math.round(parseFloat((a.amount * calculatedRate).toFixed(2)));
        });
      });

      this.oldCurrency = this.selectedCurrency;
    }
  }

  getSectorTotalForYear(year: number) {
    var sectors = this.envelopeData.sectors;
    var sectorAllocation = 0;
    sectors.forEach(function (sector) {
      var allocation = sector.yearlyAllocation.filter(a => a.year == year);
      if (allocation.length > 0) {
        sectorAllocation += allocation[0].amount;
      }
    });
    return sectorAllocation;
  }

}
