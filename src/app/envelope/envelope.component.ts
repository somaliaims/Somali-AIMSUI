import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { EnvelopeService } from '../services/envelope-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  btnText: string = 'Save envelope data';
  permissions: any = {};
  userOrganizationId: number = 0;
  yearsList: any = [];
  currenciesList: any = [];
  exRatesList: any = [];
  selectedCurrency: string = null;
  defaultCurrency: string = null;
  envelopeData: any = {funderId: 0, funderName: '', totalFunds: 0.0, sectors: [], envelopeBreakups: []};
  envelopeBreakups: any = [];
  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }
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
        this.exRatesList = data;
      }
    )
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        this.defaultCurrency = data.currency;
      }
    )
  }

  getFunderEnvelope() {
    this.envelopeService.getEnvelopForFunder().subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
          if (this.envelopeData.envelopeBreakups) {
            this.envelopeBreakups = this.envelopeData.envelopeBreakups;
            this.yearsList = this.envelopeData.envelopeBreakups.map(y => y.year);
          }
        }
      }
    )
  }

  saveEnvelopeData() {
    var model = {
      funderId: this.envelopeData.funderId,
      envelopeBreakups: this.envelopeData.envelopeBreakups
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

  getSectorAllocation(percent: number, totalAmount: number) {
    return ((totalAmount / 100) * percent).toFixed(2);
  }

  convertExRatesToCurrency() {
    if (this.selectedCurrency != null) {
      var currencyRateArr = this.exRatesList.filter(ex => ex.currency == this.selectedCurrency);
      var defaultRateArr = this.exRatesList.filter(ex => ex.currency == this.defaultCurrency);
      var currencyRate = 0;
      var defaultRate = 0;

      if (defaultRateArr.length > 0) {
        defaultRate = defaultRateArr[0].rate;
      }

      if (currencyRateArr.length > 0) {
        currencyRate = currencyRateArr[0].rate;
      }

      if (defaultRate == 1) {
        this.envelopeBreakups.array.forEach(e => {
          e.amount = (e.amount * currencyRate);
        });
      } else {
        var rateInUSD = (1 / currencyRate);
        this.envelopeBreakups.array.forEach(e => {
          e.amount = (e.amount * rateInUSD);
        });
      }
    }
  }

}
