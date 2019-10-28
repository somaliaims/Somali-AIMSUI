import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization-service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { EnvelopeTypeService } from 'src/app/services/envelope-type.service';
import { ReportService } from 'src/app/services/report.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { StoreService } from 'src/app/services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { Settings } from 'src/app/config/settings';

@Component({
  selector: 'app-envelope-report',
  templateUrl: './envelope-report.component.html',
  styleUrls: ['./envelope-report.component.css']
})
export class EnvelopeReportComponent implements OnInit {

  organizationTypes: any = [];
  exchangeRates: any = [];
  organizations: any = [];
  filteredOrganizations: any = [];
  financialYears: any = [];
  envelopeTypes: any = [];
  envelopeList: any = [];
  envelopeYearsList: any = [];
  currenciesList: any = [];
  selectedOrganizationTypes: any = [];
  selectedEnvelopeTypes: any = [];
  selectedOrganizations: any = [];
  paramFunders: any = [];
  paramEnvelopeTypes: any = [];

  reportSettings: any = {};
  envelopeTypeSettings: any = {};
  organizationTypeSettings: any = {};
  organizationSettings: any = {};
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  selectedCurrencyName: string = null;
  excelFile: string = null;
  chartType: string = null;
  oldCurrency: any = null;
  manualExRate: number = 0;
  cellCount: number = 0;
  oldCurrencyRate: number = 0;
  cellPercent: number = 0;
  isShowChart: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  loadReport: boolean = false;
  errorMessage: string = null;
  chartTypeName: string = 'bar';

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return parseInt(tooltipValue).toLocaleString();
        }
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value.toLocaleString("en-US");
          }
        }
      }],
      xAxes: [{
        beginAtZero: true,
        ticks: {
          autoSkip: false
        }
      }],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var dataLabel = data.labels[tooltipItem.index];
          var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
          dataLabel += value;
          return dataLabel;
        }
      }
    }
  }

  radarChartOptions: any = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var dataLabel = data.labels[tooltipItem.index];
          var value = ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
          dataLabel += value;
          return dataLabel;
        }
      }
    }
  }

  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  chartLables: any = [];
  doughnutChartLabels: any = [];
  barChartType: string = 'bar';
  chartLegend: boolean = true;
  chartData: any = [];
  doughnutChartData: any = [];
  model: any = { funderTypeId: 0, funderIds: [], startingYear: 0, endingYear: 0, envelopeTypes: [],
  envelopeTypeIds: [], chartType: 1, chartTypeName: 'bar' };

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'line', title: 'Line chart' },
    { id: 3, type: 'radar', title: 'Radar' },
  ];

  chartTypes: any = {
    BAR: 'bar',
    LINE: 'line',
    RADAR: 'radar',
  };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private organizationService: OrganizationService, 
    private financialYearService: FinancialYearService,
    private envelopeTypeService: EnvelopeTypeService, 
    private reportService: ReportService,
    private currencyService: CurrencyService,
    private storeService: StoreService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.envelopeTypeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'typeName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationTypeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'typeName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    if (this.route.snapshot.queryParams.load) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.model.funderTypeId = (params.funderType) ? params.funderType : null;
          this.model.startingYear = (params.syear) ? params.syear : 0;
          this.model.endingYear = (params.eyear) ? params.eyear : 0;
          this.paramFunders = (params.funders) ? params.funders.split(',') : [];
          this.paramEnvelopeTypes = (params.envelopeTypes) ? params.envelopeTypes.split(',') : [];
          this.loadReport = true;
        } 
      });
    } else {
      this.isLoading = false;
    }

    this.chartType = this.chartTypes.BAR;
    this.getEnvelopeTypes();
    this.getOrganizationTypes();
    this.getOrganizations();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getFinancialYears();
  }

  getEnvelopeReport() {
    this.isShowChart = false;
    this.chartData = [];
    this.chartType = this.chartTypes.BAR;
    this.model.envelopeTypeIds = this.selectedEnvelopeTypes.map(t => t.id);
    this.model.funderIds = this.selectedOrganizations.map(o => o.id);
    this.blockUI.start('Loading report...');
    this.reportService.getEnvelopeReport(this.model).subscribe(
      data => {
        if (data) {
          this.reportSettings = data.reportSettings;
          if (this.reportSettings && this.reportSettings.excelReportName) {
            this.excelFile = this.reportSettings.excelReportName;
            this.setExcelFile();
          }
          this.envelopeList = data.envelope;
          this.envelopeYearsList = data.envelopeYears;
          this.cellCount = (this.envelopeYearsList.length + 2);
          this.cellPercent = (80 / this.cellCount);
          this.chartLables = this.envelopeYearsList;
          this.manageDataToDisplay();
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        this.blockUI.stop();
      }
    );
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  printReport() {
    this.storeService.printReport('rpt-envelope', 'Envelope report');
  }

  getOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
      }
    );
  }

  getOrganizations() {
    this.organizationService.getUserOrganizations().subscribe(
      data => {
        if (data) {
          this.organizations = data;
          if (this.loadReport) {
            if (this.paramFunders.length > 0) {
              var org = this.organizations.filter(o => o.id == this.paramFunders[0]);
              if (org.length > 0) {
                this.model.funderTypeId = org[0].organizationTypeId;
              }
              this.paramFunders.forEach((f) => {
                var funder = this.organizations.filter(o => o.id == f);
                if (funder.length > 0) {
                  this.selectedOrganizations.push(funder[0]);
                }
              });
            }
          }
        }
      }
    );
  }

  getOrganizationsForType(selectionType: number = 2) {
    if (selectionType == 1) {
      this.filteredOrganizations = this.organizations;
    } else if (selectionType == 0) {
      this.selectedOrganizations = [];
      this.filteredOrganizations = [];
    } else if (this.selectedOrganizationTypes && this.selectedOrganizationTypes.length > 0) {
      var ids = this.selectedOrganizationTypes.map(o => o.id);
      this.filteredOrganizations = this.organizations.filter(o => ids.includes(o.organizationTypeId));
    } else {
      this.selectedOrganizations = [];
      this.filteredOrganizations = [];
    }
  }

  getFinancialYears() {
    this.financialYearService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }

        if (this.loadReport) {
          setTimeout(() => {
            this.getEnvelopeReport();
          }, 2000);
        }
      }
    );
  }

  getEnvelopeTypes() {
    this.envelopeTypeService.getAllEnvelopeTypes().subscribe(
      data => {
        if (data) {
          this.envelopeTypes = data;
          if (this.loadReport) {
            if (this.paramEnvelopeTypes.length > 0) {
              this.paramEnvelopeTypes.forEach((t) => {
                var envelopeType = this.envelopeTypes.filter(e => e.id == t);
                if (envelopeType.length > 0) {
                  this.selectedEnvelopeTypes.push(envelopeType[0]);
                }
              });
            }
          }
        }
      }
    );
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
          this.getManualExchangeRateForToday();
        }
        setTimeout(() => {
          this.isDataLoading = false;
        }, 2000);
      }
    );
  }

  manageDataToDisplay() {
    this.chartData = [];
    var funderIds = this.envelopeList.map(e => e.funderId);
    var fundersChartData: any = [];
    var chartType = this.chartOptions.filter(c => c.id == this.model.chartType);
    if (chartType.length > 0) {
      this.model.chartTypeName = chartType[0].type;
    }

    funderIds.forEach((f) => {
      var envelope = this.envelopeList.filter(e => e.funderId == f);
      var yearlySummary: any = [];
      var funderName: string = null;

      if (envelope.length > 0) {
        funderName = envelope[0].funder;
      }

      this.envelopeYearsList.forEach((year) => {
        var totalAmount: number = 0;
        envelope.forEach((e) => {
          e.envelopeBreakupsByType.forEach((b) => {
            var yearlyBreakup = b.yearlyBreakup.filter(y => y.year == year);
            if (yearlyBreakup.length > 0) {
              totalAmount += parseFloat(yearlyBreakup[0].amount);
            }
          });
        });
        yearlySummary.push(totalAmount);
      });

      fundersChartData.push({
        data: yearlySummary,
        label: funderName 
      });
    });

    this.chartData = fundersChartData;
    this.isShowChart = true;
  }

  calculateEnvelopeTypeTotal(funderId: number, envelopeTypeId: number) {
    var totalAmount = 0;
    var envelope = this.envelopeList.filter(e => e.funderId == funderId);
    if (envelope.length > 0) {
      var envelopeBreakup = envelope[0].envelopeBreakupsByType.filter(e => e.envelopeTypeId == envelopeTypeId);
      if (envelopeBreakup.length > 0) {
        envelopeBreakup[0].yearlyBreakup.forEach((y) => {
          totalAmount += parseFloat(y.amount);
        });
      }
    }
    return totalAmount;
  }

  calculateTotalsForYear(year: number, funderId: number) {
    var totalAmount = 0;
    var envelope = this.envelopeList.filter(e => e.funderId == funderId);
    envelope.forEach((e) => {
      e.envelopeBreakupsByType.forEach((b) => {
        var yearlyBreakup = b.yearlyBreakup.filter(y => y.year == year);
        if (yearlyBreakup.length > 0) {
          totalAmount += parseFloat(yearlyBreakup[0].amount);
        }
      });
    });
    return totalAmount;
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    var result = Promise.resolve(this.reportService.generatePDF('rpt-envelope-pdf-view'));
    result.then(() => {
      this.blockUI.stop();
    });
  }

}
