import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Messages } from 'src/app/config/messages';
import { Settings } from 'src/app/config/settings';
import { ModalService } from 'src/app/services/modal.service';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { UrlHelperService } from 'src/app/services/url-helper-service';

@Component({
  selector: 'budget-report',
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
  nationalCurrencyName: string = null;
  reportDataList: any = [];
  reportSettings: any = { title: null};
  currenciesList: any = [];
  exchangeRates: any = [];
  model: any = { selectedCurrency: null };
  errorMessage: string = null;
  grandTotalFunding: number = 0;
  grandTotalDisbursements: number = 0;
  datedToday: string = null;
  selectedYearlyDisbursements: any = [];
  selectedProject: string = null;
  excelFile: string = null;
  isDataLoading: boolean = true;
  btnReportText: string = 'View report';
  arrangementConstant: number = 1;
  currentArrangement: string = null;

  chartDescriptiveLabels: any = [];
  isChartLoading: boolean = true;
  chartLabels: Label[] = [];
  chartData: ChartDataSets[] = [];
  chartLegend: boolean = true;
  chartType: ChartType = 'bar';
  barChartPlugins: any = [];
  pagingSize: number = Settings.rowsPerPage;
  reportArrangements: any = [
    { id: 1, label: 'By sectors' },
    { id: 2, label: 'By locations' }
  ];
  
  arrangementConstants: any = {
    SECTORS: 1,
    LOCATIONS: 2
  };

  arrangementConstantLabels: any = {
    SECTORS: "Sectors",
    LOCATIONS: "Locations"
  }

  chartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return parseFloat(tooltipValue.toString()).toLocaleString();
        }
      }
    },
    scales: {
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value.toLocaleString("en-US");
          }.bind(this)
        }
      }],
      xAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private currencyService: CurrencyService,
    private modalService: ModalService,
    private urlService: UrlHelperService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.currentArrangement = this.arrangementConstantLabels.SECTORS;
    this.arrangementConstant = this.arrangementConstants.SECTORS;
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();
    this.getBudgetReport();
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    var model = {
      dated: dated
    };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        if (data) {
          this.exchangeRates = data;
          var nationalCurrencyRate = this.exchangeRates.filter(c => c.currency == this.nationalCurrencyName);
          if (nationalCurrencyRate.length > 0) {
            this.manualExRate = nationalCurrencyRate[0].rate;
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
          this.nationalCurrencyName = data.currency;
          this.currenciesList.push(data);
        }

        setTimeout(() => {
          this.isDataLoading = false;
        }, 2000);
      }
    );
  }

  getBudgetReport() {
    this.blockUI.start('Loading report...');
    this.isChartLoading = true;
    this.reportService.getBudgetReport().subscribe(
      data => {
        if (data) {
          this.reportDataList = data;
          if (this.reportDataList.years) {
            this.chartLabels = this.reportDataList.years.map(y => y.year);
          }
          this.datedToday = this.storeService.getLongDateString(new Date());
          this.btnReportText = 'Update report';
          if (this.reportDataList.reportSettings) {
            this.excelFile = this.reportDataList.reportSettings.excelReportName;
            this.setExcelFile();
          }

          if (this.reportDataList.years) {
            this.setupChartData();
          }
        }
        this.blockUI.stop();
      }
    );
  }

  manageDataDisplayArrangements() {
    if (this.arrangementConstant == this.arrangementConstants.SECTORS) {
      this.currentArrangement = this.arrangementConstantLabels.SECTORS;
    } else if (this.arrangementConstant == this.arrangementConstants.LOCATIONS) {
      this.currentArrangement = this.arrangementConstantLabels.LOCATIONS;
    }
    this.setupChartData();
  }

  displayHideRow(id) {
    if (this.reportDataList.projects) {
      var selectProject = this.reportDataList.projects.filter(p => p.id == id);
      if (selectProject.length > 0) {
        selectProject[0].isDisplay = !selectProject[0].isDisplay;
      }
    }
  }

  setupChartData() {
    this.chartData = [];
    this.chartDescriptiveLabels = [];

    if (this.arrangementConstant == this.arrangementConstants.SECTORS) {
      this.chartDescriptiveLabels = this.reportDataList.parentSectorDisbursements.map(s => s.sectorName);
      this.reportDataList.parentSectorDisbursements.forEach((s) => {
        this.chartData.push({
          data: s.disbursements.map(d => d.totalValue),
          label: s.sectorName,
          stack: 'a'
        });
      });
    } else if (this.arrangementConstant == this.arrangementConstants.LOCATIONS) {
      this.chartDescriptiveLabels = this.reportDataList.locationDisbursements.map(s => s.sectorName);
      this.reportDataList.locationDisbursements.forEach((l) => {
        this.chartData.push({
          data: l.disbursements.map(d => d.totalValue),
          label: l.locationName,
          stack: 'a'
        });
      });
    } 
    this.isChartLoading = false;
  }

  showDetail(id: number) {
    var filteredProject = this.reportDataList.projects.filter(p => p.id == id);
    if (filteredProject.length > 0) {
      this.selectedProject = filteredProject[0].title;
      this.selectedYearlyDisbursements = filteredProject[0].yearlyDisbursements;

      this.modalService.open('disbursement-info-modal');
    }
  }

  closeDetail() {
    this.modalService.close('disbursement-info-modal');
  }

  printReport() {
    this.storeService.printReport('rpt-budget-report', 'Budget report', this.selectedCurrencyName);
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
    this.applyRateOnFinancials(calculatedRate, exRate);
  }

  applyRateOnFinancials(calculatedRate = 1, defaultRate = 1) {
    if (calculatedRate != 1) {
      if (this.reportDataList.projects && this.reportDataList.projects.length > 0) {
        this.reportDataList.projects.forEach(p => {
          if (p.yearlyDisbursements) {
            p.yearlyDisbursements.forEach((d) => {
              d.disbursements = Math.round(parseFloat((d.disbursements * calculatedRate).toFixed(2)));
              d.actualDisbursements = Math.round(parseFloat((d.actualDisbursements * calculatedRate).toFixed(2)));
              d.expectedDisbursements = Math.round(parseFloat((d.expectedDisbursements * calculatedRate).toFixed(2)));
            });
          }
        });
      }

      if (this.reportDataList.parentSectorDisbursements) {
        this.reportDataList.parentSectorDisbursements.forEach((p) => {
          if (p.disbursements) {
            p.disbursements.forEach((d) => {
              d.totalValue = Math.round(parseFloat((d.totalValue * calculatedRate).toFixed(2)));
            });
          }
        });
      }

      if (this.reportDataList.locationDisbursements) {
        this.reportDataList.locationDisbursements.forEach((p) => {
          if (p.disbursements) {
            p.disbursements.forEach((d) => {
              d.totalValue = Math.round(parseFloat((d.totalValue * calculatedRate).toFixed(2)));
            });
          }
        });
      }

      if (this.reportDataList.totalYearlyDisbursements && this.reportDataList.totalYearlyDisbursements.length > 0) {
          this.reportDataList.totalYearlyDisbursements.forEach((t) => {
            t.totalDisbursements = Math.round(parseFloat((t.totalDisbursements * calculatedRate).toFixed(2)));
            t.totalExpectedDisbursements = Math.round(parseFloat((t.totalExpectedDisbursements * calculatedRate).toFixed(2)));
          });

          this.setupChartData();
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

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.urlService.getExcelFilesUrl() + this.excelFile;
    }
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-budget-report'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
