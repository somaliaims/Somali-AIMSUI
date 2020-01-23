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
import { Color } from 'ng2-charts';

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
  humanitarianSummary: any = [];
  developmentSummary: any = [];
  paramChartType: string = null;
  currentYear: number = 0;
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
  isAnyFilterSet: boolean = false;
  errorMessage: string = null;
  chartTypeName: string = 'bar';
  btnReportText: string = 'Update report';

  public lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          stacked: true,
        }
      ]
    }
  };

  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  stackedChartOptions: any = {
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
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value.toLocaleString("en-US");
          }
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

  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Stacked bar' },
    { id: 2, type: 'line', title: 'Stacked line' },
  ];

  chartTypesList: any = [
    { id: 1, type: 'bar', title: 'Stacked bar' },
    { id: 2, type: 'line', title: 'Stacked line' },
  ];

  envelopeTypeCodes: any = {
    HUMANITARIAN: 'Humanitarian',
    DEVELOPMENT: 'Development'
  };

  chartTypes: any = {
    BAR: 'bar',
    LINE: 'line',
  };

  chartTypeCodes: any = {
    BAR: 1,
    LINE: 2,
  };

  chartLabels: any = [];
  doughnutChartLabels: any = [];
  barChartType: string = 'bar';
  chartLegend: boolean = true;
  chartData: any = [];
  doughnutChartData: any = [];
  model: any = {
    funderTypeId: 0, funderIds: [], startingYear: 0, endingYear: 0, envelopeTypes: [],
    envelopeTypeIds: [], chartType: this.chartTypes.BAR, chartTypeName: this.chartTypes.BAR,
    organizationTypeIds: []
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
    this.getDefaultCurrency();
    this.getNationalCurrency();
    
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
          this.paramChartType = (params.ctype) ? params.ctype : this.chartTypeCodes.BAR;
          this.loadReport = true;
        }
      });
    } else {
      this.getEnvelopeReport();
    }

    this.chartType = this.chartTypes.BAR;
    this.getEnvelopeTypes();
    this.getOrganizationTypes();
    this.getOrganizations();
    this.getFinancialYears();
  }

  getEnvelopeReport() {
    this.isShowChart = false;
    this.chartData = [];
    //this.chartType = this.chartTypes.BAR;
    //this.model.chartType = this.chartTypes.BAR;
    var chartType = this.chartTypeCodes.BAR;
    if (this.loadReport) {
      chartType = this.paramChartType;
      var searchType = this.chartTypesList.filter(c => c.id == chartType);
      if (searchType.length > 0) {
        this.chartType = searchType[0].type;
      }
    } else {
      var searchType = this.chartTypesList.filter(c => c.type == this.model.chartType);
      if (searchType.length > 0) {
        chartType = searchType[0].id;
        this.chartType = searchType[0].type;
      }
    }
    this.model.envelopeTypeIds = this.selectedEnvelopeTypes.map(t => t.id);
    this.model.organizationTypeIds = this.selectedOrganizationTypes.map(t => t.id);
    this.model.funderIds = this.selectedOrganizations.map(o => o.id);

    var model = {
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      envelopeTypeIds: this.selectedEnvelopeTypes.map(t => t.id),
      funderTypeIds: this.selectedOrganizationTypes.map(t => t.id),
      funderIds: this.selectedOrganizations.map(o => o.id),
      chartType: chartType
    };
    this.blockUI.start('Loading report...');
    this.reportService.getEnvelopeReport(model).subscribe(
      data => {
        if (data) {
          this.btnReportText = 'Update report';
          this.reportSettings = data.reportSettings;
          if (this.reportSettings && this.reportSettings.excelReportName) {
            this.excelFile = this.reportSettings.excelReportName;
            this.setExcelFile();
          }
          this.envelopeList = data.envelope;
          this.envelopeYearsList = data.envelopeYears;
          this.cellCount = (this.envelopeYearsList.length + 2);
          this.cellPercent = (80 / this.cellCount);
          this.chartLabels = this.envelopeYearsList;
          this.manageDataToDisplay();
        }
        setTimeout(() => {
          this.isLoading = false;
          //if (this.loadReport) {
            var typeName = this.chartTypesList.filter(t => t.id == chartType);
            if (typeName.length > 0) {
              this.model.chartType = typeName[0].type;
            }
          //}
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
    this.storeService.printReport('rpt-envelope', 'Envelope report', this.selectedCurrencyName);
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
    this.organizationService.getOrganizationsHavingEnvelope().subscribe(
      data => {
        if (data) {
          this.organizations = data;
          this.filteredOrganizations = data;
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
      this.filteredOrganizations = this.organizations;
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
          this.currentYear = this.storeService.getCurrentYear();
          var yearsList = [];
          for (var y = (this.currentYear - 1); y <= (this.currentYear + 1); y++) {
            yearsList.push(y);
          }
          if (data.length > 0) {
            this.financialYears = data.filter(f => yearsList.includes(f.financialYear));
          }
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
    this.humanitarianSummary = [];
    this.developmentSummary = [];
    var chartType = this.chartTypes.BAR;
    if (this.loadReport) {
      var searchType = this.chartTypesList.filter(c => c.id == this.paramChartType);
      if (searchType.length > 0) {
        chartType = searchType[0].type;
      }
    }
    this.model.chartTypeName = chartType;
    this.envelopeYearsList.forEach((year) => {
      var humanitarianAmount: number = 0;
      var developmentAmount: number = 0; 
      humanitarianAmount = this.calculateTotalForEnvelopeType(year, this.envelopeTypeCodes.HUMANITARIAN);
      developmentAmount = this.calculateTotalForEnvelopeType(year, this.envelopeTypeCodes.DEVELOPMENT);
      this.humanitarianSummary.push(humanitarianAmount);
      this.developmentSummary.push(developmentAmount);
    });

    this.chartData.push({
      data: this.humanitarianSummary,
      label: 'Humanitarian',
      stack: 'Stack 0'
    });

    this.chartData.push({
      data: this.developmentSummary,
      label: 'Development',
      stack: 'Stack 0'
    });
    this.isShowChart = true;
  }

  manageChartType() {
    this.chartType = this.model.chartType;
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

  calculateTotalForEnvelopeType(year: number, envelopeType: string) {
    var totalAmount = 0;
    this.envelopeList.forEach((e) => {
      var envelopeBreakup = e.envelopeBreakupsByType.filter(b => b.envelopeType.toLowerCase() == envelopeType.toLowerCase());
      envelopeBreakup.forEach((b) => {
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
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-envelope-pdf-view'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
  }

  onChangeStartingYear() {
    if (this.model.startingYear != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onChangeEndingYear() {
    if (this.model.endingYear != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onEnvelopeSelect(item: any) {
    this.setFilter();
  }

  onEnvelopeDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onEnvelopeSelectAll(item: any) {
    this.setFilter();
  }

  onEnvelopeDeSelectAll(items: any) {
    this.selectedEnvelopeTypes = [];
    this.manageResetDisplay();
  }

  onOrganizationTypeSelect(item: any) {
    this.setFilter();
  }

  onOrganizationTypeDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onOrganizationTypeSelectAll(item: any) {
    this.setFilter();
  }

  onOrganizationTypeDeSelectAll(items: any) {
    this.selectedOrganizationTypes = [];
    this.manageResetDisplay();
  }

  onOrganizationSelect(item: any) {
    this.setFilter();
  }

  onOrganizationDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onOrganizationSelectAll(item: any) {
    this.setFilter();
  }

  onOrganizationDeSelectAll(items: any) {
    this.selectedOrganizations = [];
    this.manageResetDisplay();
  }

  manageResetDisplay() {
    if (this.selectedEnvelopeTypes == 0 && this.selectedOrganizationTypes == 0 &&
      this.model.startingYear == 0 && this.model.endingYear == 0 &&
      this.selectedOrganizations.length == 0 &&
      this.model.selectedCurrency == this.defaultCurrency) {
      this.isAnyFilterSet = false;
    } else {
      this.isAnyFilterSet = true;
    }
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  resetFilters() {
    this.selectedEnvelopeTypes = [];
    this.selectedOrganizationTypes = [];
    this.selectedOrganizations = [];
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.isAnyFilterSet = false;
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
