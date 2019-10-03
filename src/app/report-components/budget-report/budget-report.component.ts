import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Messages } from 'src/app/config/messages';
import { Settings } from 'src/app/config/settings';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.css']
})
export class BudgetReportComponent implements OnInit {
  manualExRate: number = 0;
  oldExRateToDefault: number = 0;
  oldCurrencyRate: number = 0;
  defaultCurrency: string = null;
  oldCurrency: string = null;
  selectedCurrencyName: string = null;
  nationalCurrency: string = null;
  excelFile: string = null;
  nationalCurrencyName: string = null;
  reportDataList: any = [];
  reportSettings: any = { title: null};
  currenciesList: any = [];
  model: any = { selectedCurrency: null };
  errorMessage: string = null;
  grandTotalFunding: number = 0;
  grandTotalDisbursements: number = 0;
  datedToday: string = null;
  chartDataList: any = [];
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
    this.reportService.getBudgetReport().subscribe(
      data => {
        if (data) {
          this.reportDataList = data;
          if (this.reportDataList.projects) {
            this.reportDataList.projects.forEach((p) => {
              if (p.yearlyDisbursements) {
                var labels = p.yearlyDisbursements.map(y => y.year);
                var disbursements = p.yearlyDisbursements.map(y => y.disbursements);
                var eDisbursements = p.yearlyDisbursements.map(y => y.expectedDisbursements);
                this.chartDataList.push(
                  {
                    id: p.id,
                    labels: labels,
                    disbursements: disbursements,
                    expectedDisbursements: eDisbursements
                  }
                );
              }
            });
          }
        }
        this.blockUI.stop();
      }
    );
  }

  getChartData(id: number) {
    var data = this.chartDataList.filter(d => d.id == id);
    if (data.length > 0) {
      return [{ 
        data: data[0].disbursements, label: 'Disbursements', stack: '1' 
      }, {
        data: data[0].expectedDisbursements, label: 'Expected disbursements', stack: '2' 
      }];
    }
    return [];
  }

  getChartLabels(id: number) {
    var data = this.chartDataList.filter(d => d.id == id);
    if (data.length > 0) {
      return data[0].labels;
    }
    return [];
  }

  /*getGrandTotalForFunding() {
    this.grandTotalFunding = (this.reportDataList.projects.map(p => p.projectValue).reduce(this.storeService.sumValues, 0));
  }

  getGrandTotalForDisbursements() {
    this.grandTotalDisbursements = (this.reportDataList.projects.map(p => p.actualDisbursements).reduce(this.storeService.sumValues, 0));
  }*/

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
