import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.css']
})
export class BudgetReportComponent implements OnInit {
  manualExRate: number = 0;
  oldCurrencyRate: number = 0;
  defaultCurrency: string = null;
  oldCurrency: string = null;
  selectedCurrencyName: string = null;
  nationalCurrency: string = null;
  reportDataList: any = [];
  reportSettings: any = { title: null};
  currenciesList: any = [];
  model: any = { selectedCurrency: null };

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private reportService: ReportService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.blockUI.start('Loading report...');
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();
    this.getBudgetReport();
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    this.currencyService.getManualExRatesByDate(dated).subscribe(
      data => {
        if (data) {
          if (data.exchangeRate) {
            this.manualExRate = data.exchangeRate;
            this.oldCurrencyRate = 1;
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
        }
        this.blockUI.stop();
      }
    )
  }

  getGrandTotalForFunding() {
    return (this.reportDataList.projects.map(p => p.projectValue).reduce(this.storeService.sumValues, 0));
  }

  getGrandTotalForDisbursements() {
    return (this.reportDataList.projects.map(p => p.actualDisbursements).reduce(this.storeService.sumValues, 0));
  }

  printReport() {
    this.storeService.printSimpleReport('rpt-budget-report', 'Budget report');
  }

}
