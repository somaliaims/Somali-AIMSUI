import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { SectorService } from 'src/app/services/sector.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import { LocationService } from 'src/app/services/location.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Settings } from 'src/app/config/settings';
import { Color } from 'ng2-charts';

@Component({
  selector: 'time-trend-report',
  templateUrl: './time-trend-report.component.html',
  styleUrls: ['./time-trend-report.component.css']
})
export class TimeTrendReportComponent implements OnInit {
  sectorsSettings: any = [];
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  selectedDataOptions: any = [];
  projects: any = [];

  selectedChartType: number = 1;
  organizationsSettings: any = {};
  dataOptionSettings: any = {};
  locationsSettings: any = {};
  projectsSettings: any = {};
  oldCurrencyRate: number = 0;
  oldCurrency: string = null;
  currencyRate: number = 0;
  yearsList: any = [];
  sectorsList: any = [];
  subSectorsList: any = [];
  organizationsList: any = [];
  currenciesList: any = [];
  locationsList: any = [];
  exchangeRatesList: any = [];
  exchangeRates: any = [];
  manualExRate: any = 0;
  defaultCurrency: string = null;
  defaultCurrencyRate: number = 0;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  selectedCurrencyName: string = null;
  errorMessage: string = null;
  showChart: boolean = true;
  excelFile: string = null;
  chartCategory: number = 1;
  multiDataDisplay: boolean = true;
  datedToday: string = null;
  paramSectorIds: any = [];
  paramOrgIds: any = [];
  paramLocationIds: any = [];
  paramProjectIds: any = [];
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  isAnyFilterSet: boolean = false;
  //chartTypeName: string = 'bar';
  chartType: string = 'bar';
  btnReportText: string = 'View report';

  chartTypesList: any = [
    { id: 1, type: 'bar', title: 'Stacked bar' },
    { id: 2, type: 'line', title: 'Stacked line' },
  ];

  chartTypes: any = {
    BAR: 'bar',
    LINE: 'line',
  };

  chartTypeCodes: any = {
    BAR: 1,
    LINE: 2,
  };

  chartOptions: any = {
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
  reportDataList: any = [];
  dropdownSettings: any = {};

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
  
  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  chartLabels: any = [];
  doughnutChartLabels: any = [];
  barChartType: string = this.chartTypes.BAR;
  chartLegend: boolean = true;
  chartData: any = [];
  doughnutChartData: any = [];
  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0, chartType: this.chartTypes.BAR,
    sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: [],
    selectedCurrency: null, exRateSource: null, dataOption: 1, selectedDataOptions: [],
    selectedDataOption: 1, chartTypeName: 'bar', selectedProjects: []
  };

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private locationService: LocationService,
    private currencyService: CurrencyService, private errorModal: ErrorModalComponent,
    private route: ActivatedRoute, private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    if (this.route.snapshot.queryParams.load) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.model.title = (params.title) ? params.title : null;
          this.model.startingYear = (params.syear) ? params.syear : 0;
          this.model.endingYear = (params.eyear) ? params.eyear : 0;
          this.paramProjectIds = (params.projects) ? params.projects.split(',') : [];
          this.paramSectorIds = (params.sectors) ? params.sectors.split(',') : [];
          this.paramOrgIds = (params.orgs) ? params.orgs.split(',') : [];
          this.paramLocationIds = (params.locations) ? params.locations.split(',') : [];
          this.loadReport = true;
        } 
      });
    } else {
      this.isLoading = false;
    }

    this.getProjectTitles();
    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();
    this.datedToday = this.storeService.getLongDateString(new Date());

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.projectsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dataOptionSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  getProjectTitles() {
    this.projectService.getProjectTitles().subscribe(
      data => {
        if (data) {
          this.projects = data;
          if (this.loadReport) {
            if (this.paramProjectIds.length > 0) {
              this.paramProjectIds.forEach(function (id) {
                var project = this.projects.filter(p => p.id == id);
                if (project.length > 0) {
                  this.model.selectedProjects.push(project[0]);
                }
              }.bind(this));
            }
          }
        }
      }
    );
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

  searchProjectsByCriteriaReport() {
    this.blockUI.start('Searching Projects...');

    this.chartLabels = [];
    this.chartData = [];
    var projectIds = [];
    if (this.model.selectedProjects.length > 0) {
      projectIds = this.model.selectedProjects.map(p => p.id);
    }

    var searchModel = {
      projectIds: projectIds,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.model.selectedOrganizations.map(o => o.id),
      sectorIds: this.model.selectedSectors.map(s => s.id),
    };

    this.resetSearchResults();
    this.reportService.getYearlyProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        this.btnReportText = 'Update report';
        if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
          this.reportDataList.yearlyProjectsList.forEach((y) => {
            y.isDisplay = false;
          });
          var years = this.reportDataList.yearlyProjectsList.map(y => y.year);
          this.chartLabels = years;
          if (this.reportDataList.reportSettings) {
            this.excelFile = this.reportDataList.reportSettings.excelReportName;
            this.setExcelFile();
          }

          this.model.selectedCurrency = this.defaultCurrency;
          this.selectCurrency();
          this.setupChartData();
        }
        this.blockUI.stop();
      }
    )

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  manageDataToDisplay() {
    this.chartType = this.model.chartType;
  }

  setupChartData() {
    this.chartData = [];
    var yearlyProjects = this.reportDataList.yearlyProjectsList;
    this.chartLabels = yearlyProjects.map(y => y.year);
    var actualDisbursements = yearlyProjects.map(y => y.totalActualDisbursements);
    var plannedDisbursements = yearlyProjects.map(y => y.totalPlannedDisbursements);

    this.chartData.push({
      data: actualDisbursements,
      label: 'Actual disbursements',
      stack: 'Stack 0'
    });

    this.chartData.push({
      data: plannedDisbursements,
      label: 'Planned disbursements',
      stack: 'Stack 0'
    });
  }

  resetSearchResults() {
    this.chartData = [];
    this.chartLabels = [];
    this.reportDataList = [];
  }

  formatFunders(funders: any = null) {
    var fundersStr = '';
    if (funders && funders.length > 0) {
      var funderNames = funders.map(f => f.funder);
      fundersStr = funderNames.join(', ');
    }
    return fundersStr;
  }

  formatImplementers(implementers: any = null) {
    var implementersStr = '';
    if (implementers && implementers.length > 0) {
      var implementerNames = implementers.map(i => i.implementer);
      implementersStr = implementerNames.join(', ');
    }
    return implementersStr;
  }

  loadFinancialYears() {
    this.fyService.getYearsList().subscribe(
      data => {
        if (data) {
          this.yearsList = data;
        }
      }
    );
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    var result = Promise.resolve(this.reportService.generatePDF('rpt-timetrend-pdf-view'));
    result.then(() => {
      this.blockUI.stop();
    });
  }

  printReport() {
    this.storeService.printReport('rpt-time-trend-report', 'Time trend report', this.selectedCurrencyName);
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  displayHideRow(year) {
    if (this.reportDataList.yearlyProjectsList) {
      var yearList = this.reportDataList.yearlyProjectsList.filter(p => p.year == year);
      if (yearList.length > 0) {
        yearList[0].isDisplay = !yearList[0].isDisplay;
      }
    }
  }

  getSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        var sectorsList = data;
        this.sectorsList = sectorsList.filter(s => s.parentSectorId == 0);
        this.subSectorsList = [];
        if (this.loadReport) {
          if (this.paramSectorIds.length > 0) {
            this.paramSectorIds.forEach(function (id) {
              var sector = this.sectorsList.filter(s => s.id == id);
              if (sector.length > 0) {
                this.model.selectedSectors.push(sector[0]);
              }
            }.bind(this));
          }
        }
      },
      error => {
        console.log(error);
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


  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsHavingEnvelope().subscribe(
      data => {
        this.organizationsList = data;

        if (this.loadReport) {
          if (this.paramOrgIds.length > 0) {
            this.paramOrgIds.forEach(function (id) {
              var org = this.organizationsList.filter(o => o.id == id);
              if (org.length > 0) {
                this.model.selectedOrganizations.push(org[0]);
              }
            }.bind(this));
          }
          this.searchProjectsByCriteriaReport();
        }
      }
    );
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

  onSectorSelect(item: any) {
    this.setFilter();
  }

  onSectorDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onSectorSelectAll(items: any) {
    this.setFilter();
  }

  onSectorDeSelectAll(items: any) {
    this.model.selectedSectors = [];
    this.manageResetDisplay();
  }

  onProjectSelect(item: any) {
    this.setFilter();
  }

  onProjectDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onProjectSelectAll(items: any) {
    this.setFilter();
  }

  onProjectDeSelectAll(items: any) {
    this.model.selectedProjects = [];
    this.manageResetDisplay();
  }

  onOrganizationSelect(item: any) {
    this.setFilter();
  }

  onOrganizationDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onOrganizationSelectAll(items: any) {
    this.setFilter();
  }

  onOrganizationDeSelectAll(items: any) {
    this.model.selectedOrganizations = [];
    this.manageResetDisplay();
  }

  onLocationSelect(item: any) {
    this.setFilter();
  }

  onLocationDeSelect(item: any) {
    this.manageResetDisplay();
  }

  onLocationSelectAll(items: any) {
    this.setFilter();
  }

  onLocationDeSelectAll(items: any) {
    this.model.locations = [];
    this.manageResetDisplay();
  }

  /*onDataOptionSelect(item: any) {
    var id = item.id;
    if (this.selectedDataOptions.indexOf(id) == -1) {
      this.selectedDataOptions.push(id);
    }
  }

  onDataOptionDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedDataOptions.indexOf(id);
    this.selectedDataOptions.splice(index, 1);
  }

  onDataOptionSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedDataOptions.indexOf(id) == -1) {
        this.selectedDataOptions.push(id);
      }
    }.bind(this));
    //this.manageDataOptions();
  }

  onDataOptionDeSelectAll(items: any) {
    this.selectedDataOptions = [];
    //this.manageDataOptions();
  }*/


  getGrandTotalFundingForYear() {
    var totalFunding = 0;
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (p) {
        totalFunding += p.totalFunding;
      });
    }
    return totalFunding;
  }

  getGrandTotalProjectValueForYear() {
    var projectValue = 0;
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (p) {
        projectValue += p.totalProjectValue;
      });
    }
    return projectValue;
  }

  getGrandTotalDisbursementForYear() {
    var totalDisbursement = 0;
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (p) {
        totalDisbursement += p.totalDisbursements;
      });
    }
    return totalDisbursement;
  }

  getGrandTotalPlannedDisbursementForYear() {
    var totalDisbursement = 0;
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (p) {
        totalDisbursement += p.totalPlannedDisbursements;
      });
    }
    return totalDisbursement;
  }

  convertAmountsToCurrency() {
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (p) {
        p.totalDisbursements = 0;
      });
    }
  }

  selectCurrency() {
    if (this.model.selectedCurrency == null || this.model.selectedCurrency == 'null') {
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

    if (calculatedRate > 0 && calculatedRate != 1) {
      this.applyRateOnFinancials(calculatedRate);
    }
  }

  applyRateOnFinancials(calculatedRate: number) {
    if (this.reportDataList && this.reportDataList.yearlyProjectsList) {
      this.reportDataList.yearlyProjectsList.forEach(function (year) {
        year.totalFunding = Math.round(parseFloat(((year.totalFunding * calculatedRate).toFixed(2))));
        year.totalDisbursements = Math.round(parseFloat(((year.totalDisbursements * calculatedRate).toFixed(2))));
        year.totalActualDisbursements = Math.round(parseFloat(((year.totalActualDisbursements * calculatedRate).toFixed(2))));
        year.totalPlannedDisbursements = Math.round(parseFloat(((year.totalPlannedDisbursements * calculatedRate).toFixed(2))));

        if (year.projects && year.projects.length > 0) {
          year.projects.forEach(function (project) {
            project.projectCost = Math.round(parseFloat(((project.projectCost * calculatedRate).toFixed(2))));
            project.actualDisbursements = Math.round(parseFloat(((project.actualDisbursements * calculatedRate).toFixed(2))));
            project.plannedDisbursements = Math.round(parseFloat(((project.plannedDisbursements * calculatedRate).toFixed(2))));
          });
        }
      });

      this.getGrandTotalFundingForYear();
      this.getGrandTotalDisbursementForYear();
      
      this.showChart = false;
      setTimeout(() => {
        this.showChart = true;
      }, 1000);
    }
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  manageResetDisplay() {
    if (this.model.selectedProjects.length == 0 && this.model.startingYear == 0 &&
      this.model.endingYear == 0 && this.model.selectedSectors.length == 0 && 
      this.model.selectedOrganizations.length == 0 && 
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
    this.model.selectedProjects = [];
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.model.parentSectorId = 0;
    this.model.selectedSectors = [];
    this.model.selectedOrganizations = [];
    this.isAnyFilterSet = false;
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
