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
import { MarkerService } from 'src/app/services/marker.service';
import { UrlHelperService } from 'src/app/services/url-helper-service';

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
  markerValuesSettings: any = {};
  oldCurrencyRate: number = 0;
  oldCurrency: string = null;
  currencyRate: number = 0;
  yearsList: any = [];
  allSectorsList: any = [];
  sectorsList: any = [];
  markersList: any = [];
  markerValues: any = [];
  sectorIds: any = [];
  subSectorIds: any = [];
  subSubSectorIds: any = [];
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
  paramChartType: string = null;
  paramLocationIds: any = [];
  paramProjectIds: any = [];
  paramMarkerValues: any = [];
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  isAnyFilterSet: boolean = false;
  chartType: string = 'bar';
  btnReportText: string = 'Update report';

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

  sectorLevels: any = [
    { "id": 1, "level": "Parent sectors" },
    { "id": 2, "level": "Sub sectors" },
  ];

  sectorLevelCodes: any = {
    NO_SECTORS: 4,
    SECTORS: 1,
    SUB_SECTORS: 2,
    SUB_SUB_SECTORS: 3
  }

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
    selectedDataOption: 1, chartTypeName: 'bar', selectedProjects: [], locationId: 0,
    sectorLevel: this.sectorLevelCodes.SECTORS,
    markerId: 0, markerValue: null, markerValues: []
  };

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private locationService: LocationService,
    private currencyService: CurrencyService, private errorModal: ErrorModalComponent,
    private route: ActivatedRoute, private projectService: ProjectService,
    private markerService: MarkerService,
    private urlService: UrlHelperService
  ) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();

    if (this.route.snapshot.queryParams.load) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.model.title = (params.title) ? params.title : null;
          this.model.startingYear = (params.syear) ? params.syear : 0;
          this.model.endingYear = (params.eyear) ? params.eyear : 0;
          this.paramProjectIds = (params.projects) ? params.projects.split(',') : [];
          this.paramSectorIds = (params.sectors) ? params.sectors.split(',') : [];
          this.model.locationId = (params.locationId) ? params.locationId : 0;
          this.model.markerId = (params.mid) ? params.mid : 0;
          this.paramOrgIds = (params.orgs) ? params.orgs.split(',') : [];
          this.paramChartType = (params.ctype) ? params.ctype : this.chartTypeCodes.BAR;
          if (params.mvalue) {
            this.paramMarkerValues = params.mvalue.split(',');
          }
          this.loadReport = true;
        } 
      });
    } else {
      this.searchProjectsByCriteriaReport();
    }

    this.getProjectTitles();
    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getMarkers();
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

    this.markerValuesSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
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

  getMarkers() {
    this.markerService.getMarkers().subscribe(
      data => {
        if (data) {
          this.markersList = data;
          if (this.model.markerId) {
            var values = (this.paramMarkerValues.length > 0) ? this.paramMarkerValues : [];
            this.getSelectedMarkerValues(values);
          }
        }
      }
    );
  }

  getSelectedMarkerValues(selectedValues: any = []) {
    this.markerValues = [];
    this.model.markerValues = [];
    if (this.model.markerId) {
      var values = this.markersList.filter(m => m.id == this.model.markerId).map(m => m.values);
      if (values && values.length > 0) {
        this.markerValues = JSON.parse(values);
        if (selectedValues.length > 0) {
          this.model.markerValues = this.markerValues.filter(m => selectedValues.indexOf(m.value) != -1);
        }
      };
    }
  }

  searchProjectsByCriteriaReport() {
    this.blockUI.start('Searching Projects...');
    this.chartLabels = [];
    this.chartData = [];
    var projectIds = [];
    var chartType = null;
    if (this.loadReport) {
      chartType = this.paramChartType;
    } else {
      var searchType = this.chartTypesList.filter(c => c.type == this.model.chartType);
      if (searchType.length > 0) {
        chartType = searchType[0].id;
      }
    }

    if (this.model.selectedProjects.length > 0) {
      projectIds = this.model.selectedProjects.map(p => p.id);
    }

    var searchModel = {
      projectIds: projectIds,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.model.selectedOrganizations.map(o => o.id),
      sectorIds: this.model.selectedSectors.map(s => s.id),
      locationId: this.model.locationId,
      markerId: this.model.markerId,
      markerValues: (this.model.markerValues.length > 0) ? this.model.markerValues.map(v => v.value) : [],
      chartType: chartType
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
          setTimeout(() => {
            this.selectCurrency();
          }, 2000);
          this.setupChartData();
        }
        this.blockUI.stop();

        if (this.loadReport) {
          setTimeout(() => {
            this.loadReport = false;
            var searchType = this.chartTypesList.filter(c => c.id == this.paramChartType);
            if (searchType.length > 0) {
              this.model.chartType = searchType[0].type;
              this.chartType = searchType[0].type;
            }
          }, 2000);
        }
      
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
      stack: 'a'
    });

    this.chartData.push({
      data: plannedDisbursements,
      label: 'Planned disbursements',
      stack: 'a'
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
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-timetrend-pdf-view'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
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
        if (data) {
          var allSectorsList = data;
          this.allSectorsList = allSectorsList;
          var sectorsList = allSectorsList.filter(s => s.parentSector == null);
          this.sectorsList = sectorsList;
          var sectorIds = sectorsList.map(s => s.id);
          var subSectorsList = allSectorsList.filter(s => sectorIds.indexOf(s.parentSectorId) != -1);
          var subSectorIds = subSectorsList.map(s => s.id);
          this.subSectorIds = subSectorIds;
          var subSubSectors = allSectorsList.filter(s => subSectorIds.indexOf(s.parentSectorId) != -1);
          var subSubSectorIds = subSubSectors.map(s => s.id);
          this.subSubSectorIds = subSubSectorIds;

          if (this.subSubSectorIds.length > 0) {
            this.sectorLevels.push({
              id: 3,
              level: 'Sub-sub sectors'
            });
            this.sectorLevels.sort(s => s.id);
          }

          if (this.loadReport) {
            if (this.paramSectorIds.length > 0) {
              var sectorId = parseInt(this.paramSectorIds[0]);
              if (sectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
              } else if (subSectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SUB_SECTORS;
              } else if (subSubSectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SUB_SUB_SECTORS;
              }

              this.manageSectorLevel();
              this.paramSectorIds.forEach(function (id) {
                var sector = allSectorsList.filter(s => s.id == id);
                if (sector.length > 0) {
                  this.model.selectedSectors.push(sector[0]);
                }
              }.bind(this));
            }
          }
        }
      }
    );
  }

  manageSectorLevel() {
    this.model.selectedSectors = [];
    if (this.model.sectorLevel) {
      var level = parseInt(this.model.sectorLevel);
      switch (level) {
        case this.sectorLevelCodes.SECTORS:
          this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          break;

        case this.sectorLevelCodes.SUB_SECTORS:
          this.sectorsList = this.allSectorsList.filter(s => this.subSectorIds.indexOf(s.id) != -1);
          break;

        case this.sectorLevelCodes.SUB_SUB_SECTORS:
          this.sectorsList = this.allSectorsList.filter(s => this.subSubSectorIds.indexOf(s.id) != -1);
          break;

        case this.sectorLevelCodes.NO_SECTORS:
          this.sectorsList = [];
          break;

        default:
          this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          break;
      }
    }
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
    this.organizationService.getOrganizationsList().subscribe(
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

  changeLocation() {
    if (this.model.locationId != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

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
      this.excelFile = this.urlService.getExcelFilesUrl() + this.excelFile;
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
