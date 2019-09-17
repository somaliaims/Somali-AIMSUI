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

  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private storeService: StoreService,
    private envelopeTypeService: EnvelopeTypeService) { }

  ngOnInit() {
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

  getAverageExchangeRates() {
    var model = {
      dated: this.storeService.getCurrentDateSQLFormat()
    };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        this.exchangeRates = data;
      }
    );
  }

  getExchangeRateForCurrency() {
    if (this.model.currency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.model.currency);
      if (exRate.length > 0) {
        this.model.exchangeRate = exRate[0].rate;
      }
    } else {
      this.model.exchangeRate = 1;
    }
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

  

}
