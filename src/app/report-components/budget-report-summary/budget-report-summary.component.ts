import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Messages } from 'src/app/config/messages';
import { Settings } from 'src/app/config/settings';

@Component({
  selector: 'budget-report-summary',
  templateUrl: './budget-report-summary.component.html',
  styleUrls: ['./budget-report-summary.component.css']
})
export class BudgetReportSummaryComponent implements OnInit {
  manualExRate: number = 0;
  oldExRateToDefault: number = 0;
  oldCurrencyRate: number = 0;
  defaultCurrency: string = null;
  oldCurrency: string = null;
  selectedCurrencyName: string = null;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  reportDataList: any = [];
  reportSettings: any = { title: null};
  currenciesList: any = [];
  model: any = { selectedCurrency: null };
  errorMessage: string = null;
  grandTotalFunding: number = 0;
  grandTotalDisbursements: number = 0;
  datedToday: string = null;

  chartLabels: any = [];
  chartData: any = [];
  chartLegend: boolean = true;
  chartType: string = 'bar';
  pagingSize: number = Settings.rowsPerPage;

  chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        stacked: true
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
        },
        stacked: true
      }],
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    }
  };

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private reportService: ReportService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.blockUI.start('Loading report...');
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();
    this.getBudgetReport();
    this.datedToday = this.storeService.getLongDateString(new Date());
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    this.currencyService.getManualExRatesByDate(dated).subscribe(
      data => {
        if (data) {
          if (data.exchangeRate) {
            this.manualExRate = data.exchangeRate;
            this.oldCurrencyRate = 1;
            this.oldExRateToDefault = 1;
          }
        }
      });
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
          this.model.selectedCurrency = data.currency;
          this.oldCurrency = this.model.selectedCurrency;
          this.selectedCurrencyName = data.currencyName;
          this.currenciesList.push(data);
        }
      }
    );
  }

  getNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency = data;
          this.nationalCurrencyName = data.currency;
          this.currenciesList.push(data);
        }
      }
    );
  }

  getBudgetReport() {
    this.blockUI.start('Wait loading report');
    this.reportService.getBudgetSummaryReport().subscribe(
      data => {
        if (data) {
          this.reportDataList = data;
          if (this.reportDataList.totalYearlyDisbursements) {
            var yearlyDisbursements = this.reportDataList.totalYearlyDisbursements;
            this.chartLabels = yearlyDisbursements.map(y => y.year);
            var disbursements = yearlyDisbursements.map(y => y.totalDisbursements);
            var expectedDisbursements = yearlyDisbursements.map(y => y.totalExpectedDisbursements);
          
            this.chartData.push({
              data: disbursements,
              label: 'Total disbursements',
              stack: '1'
            });

            this.chartData.push({
              data: expectedDisbursements,
              label: 'Total expected disbursements',
              stack: '2'
            });
          }
        }
        this.blockUI.stop();
      }
    );
  }

  printReport() {
    this.storeService.printSimpleReport('rpt-budget-report', 'Budget report');
  }

  selectCurrency() {
    if (this.model.selectedCurrency == null || this.model.selectCurrency == 'null') {
      return false;
    } else {
      var selectedCurrency = this.currenciesList.filter(c => c.currency == this.model.selectedCurrency);
      if (selectedCurrency.length > 0) {
        this.selectedCurrencyName = selectedCurrency[0].currencyName;
      }
    }
    if (this.model.selectedCurrency) {
      this.getCurrencyRates();
    }
  }

  getCurrencyRates() {
    var exRate: number = 0;
    var calculatedRate = 0;
    if (this.manualExRate == 0) {
      this.errorMessage = Messages.EX_RATE_NOT_FOUND;
      this.errorModal.openModal();
      return false;
    }

    if (this.model.selectedCurrency == this.defaultCurrency) {
      exRate = 1;
    } else {
      exRate = this.manualExRate;
    }

    calculatedRate = (exRate / this.oldCurrencyRate);
    this.oldCurrencyRate = exRate;
    this.oldCurrency = this.model.selectedCurrency;
    this.oldExRateToDefault = exRate;

    //if (calculatedRate > 0 && calculatedRate != 1) {
      this.applyRateOnFinancials(calculatedRate, exRate);
    //}
  }

  applyRateOnFinancials(calculatedRate = 1, defaultRate = 1) {
    if (calculatedRate != 1) {
      if (this.reportDataList.projects && this.reportDataList.projects.length > 0) {
        this.reportDataList.projects.forEach(p => {
          p.projectValue = Math.round(parseFloat((p.projectValue * calculatedRate).toFixed(2)));
          p.moneyLeftForYears = Math.round(parseFloat((p.moneyLeftForYears * calculatedRate).toFixed(2)));
          p.moneyPreviousTwoYears = Math.round(parseFloat((p.moneyPreviousTwoYears * calculatedRate).toFixed(2)));
          p.expectedDisbursementsCurrentYear = Math.round(parseFloat((p.expectedDisbursementsCurrentYear * calculatedRate).toFixed(2)));

          if (p.funding) {
            p.funding.forEach(f => {
              f.exchangeRateToDefault = defaultRate;
              f.amount = Math.round(parseFloat((f.amount * calculatedRate).toFixed(2)));
              f.amountInDefault = Math.round(parseFloat((f.amountInDefault * calculatedRate).toFixed(2)));
            });
          }

          if (p.disbursements) {
            p.disbursements.forEach(d => {
                d.exchangeRateToDefault = defaultRate;
                d.disbursements = Math.round(parseFloat((d.amount * calculatedRate).toFixed(2)));
                d.amountInDefault = Math.round(parseFloat((d.amountInDefault * calculatedRate).toFixed(2)));
            });
          }

          if (p.yearlyDisbursements) {
            p.yearlyDisbursements.forEach(d => {
                d.disbursements = Math.round(parseFloat((d.disbursements * calculatedRate).toFixed(2)));
                d.expectedDisbursements = Math.round(parseFloat((d.expectedDisbursements * calculatedRate).toFixed(2)));
            });
          }

        });
        /*this.getGrandTotalForFunding();
        this.getGrandTotalForDisbursements();*/
      }
    }
  }

  getCurrentYear() {
    return this.storeService.getCurrentYear();
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getLongDateString(dated: string) {
    return this.storeService.getLongDateString(dated);
  }

}
