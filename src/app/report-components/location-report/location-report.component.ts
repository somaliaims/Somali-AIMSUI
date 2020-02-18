import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { LocationService } from 'src/app/services/location.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Messages } from 'src/app/config/messages';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Settings } from 'src/app/config/settings';
import { SectorService } from 'src/app/services/sector.service';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
  selector: 'location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.css']
})
export class LocationReportComponent implements OnInit {
  locationsSettings: any = [];
  selectedLocations: any = [];
  selectedOrganizations: any = [];
  exchangeRates: any = [];
  organizationsSettings: any = {};
  dataOptionSettings: any = {};
  projectsSettings: any = {};
  yearsList: any = [];
  locationsList: any = [];
  subLocationsList: any = [];
  organizationsList: any = [];
  currenciesList: any = [];
  exchangeRatesList: any = [];
  manualExchangeRatesList: any = [];
  selectedDataOptions: any = [];
  projects: any = [];
  allSectorsList: any = [];
  sectorsList: any = [];
  markersList: any = [];
  markerValues: any = [];
  sectorIds: any = [];
  subSectorIds: any = [];
  subSubSectorIds: any = [];
  requestNo: number = 0;
  isAnyFilterSet: boolean = false;
  isNoLocationReport: boolean = false;
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  selectedCurrencyName: string = null;
  errorMessage: string = null;
  oldCurrencyRate: number = 0;
  showChart: boolean = true;
  excelFile: string = null;
  manualExRate: any = 0;
  oldCurrency: string = null;
  defaultCurrencyRate: number = 0;
  chartCategory: number = 1;
  multiDataDisplay: boolean = true;
  datedToday: string = null;
  paramLocationIds: any = [];
  paramOrgIds: any = [];
  paramProjectIds: any = [];
  paramChartType: string = null;
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  isShowStackedChart: boolean = false;
  isNoSectorReport: boolean = false;
  isManageDataDisplay: boolean = true;
  btnReportText: string = 'Update report';

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 3, type: 'doughnut', title: 'Doughnut chart' },
    { id: 4, type: 'stacked-bar', title: 'Stacked bar' },
  ];

  chartTypes: any = {
    BAR: 'bar',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    STACKEDBAR: 'stacked-bar'
  };

  chartTypeCodes: any = {
    BAR: 1,
    PIE: 2,
    DOUGHNUT: 3,
    STACKEDBAR: 4,
  };

  dataOptions: any = [
    { id: 1, type: 'actual-disbursements', value: 'Actual disbursements' },
    { id: 2, type: 'planned-disbursements', value: 'Planned disbursements' },
    { id: 3, type: 'total-disbursements', value: 'Total disbursements' }
  ];

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

  dataOptionsIndexForDoughnut: any = {
    1: 0,
    2: 1,
    3: 2
  };

  dataOptionsCodes: any = {
    'ACTUAL_DISBURSEMENTS': 1,
    'PLANNED_DISBURSEMENTS': 2,
    'DISBURSEMENTS': 3
  };

  noLocationOptions: any = [
    { id: 1, option: 'Projects with locations' },
    { id: 2, option: 'Projects without locations' },
  ];

  noLocationCodes: any = {
    PROJECTS_WITH_LOCATIONS: 1,
    PROJECTS_WITHOUT_LOCATIONS: 2
  }

  dataOptionLabels: any = {
    ACTUAL_DISBURSEMENTS: 'Actual disbursements',
    PLANNED_DISBURSEMENTS: 'Planned disbursements',
    DISBURSEMENTS: 'Total disbursements'
  };

  exRateSourceCodes: any = {
    'OPEN_EXCHANGE': 1,
    'AFRICAN_BANK': 2
  };

  exRateSources: any = [
    { id: 1, value: 'Open exchange api' },
    { id: 2, value: 'African bank' }
  ];

  reportDataList: any = [];
  dropdownSettings: any = {};
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
  stackedChartLabels: any = [];
  doughnutChartLabels: any = [];
  barChartType: string = 'bar';
  chartLegend: boolean = true;
  chartData: any = [];
  stackedChartData: any = [];
  doughnutChartData: any = [];
  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0, chartType: this.chartTypeCodes.BAR,
    sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: [],
    selectedCurrency: null, exRateSource: null, dataOption: 1, selectedDataOptions: [],
    selectedDataOption: 1, chartTypeName: 'bar', selectedProjects: [], sectorId: 0, 
    noLocationOption: this.noLocationCodes.PROJECTS_WITH_LOCATIONS, sectorLevel: 0,
    markerId: 0, markerValue: null
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private route: ActivatedRoute, 
    private projectService: ProjectService, private sectorService: SectorService,
    private markerService: MarkerService
  ) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.getDefaultCurrency();
    this.getNationalCurrency();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.blockUI.stop();
        this.errorModal.openModal();
      }
    });

    if (this.route.snapshot.queryParams.load) {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.model.title = (params.title) ? params.title : null;
          this.model.noLocationOption = (params.noLocations) ? this.noLocationCodes.PROJECTS_WITHOUT_LOCATIONS : this.noLocationCodes.PROJECTS_WITH_LOCATIONS;
          this.model.startingYear = (params.syear) ? params.syear : 0;
          this.model.endingYear = (params.eyear) ? params.eyear : 0;
          this.model.sectorId = (params.sectorId) ? params.sectorId : 0;
          this.model.markerId = (params.mid) ? params.mid : 0;
          this.model.markerValue = (params.mvalue) ? params.mvalue: null;
          this.paramProjectIds = (params.projects) ? params.projects.split(',') : [];
          this.paramLocationIds = (params.locations) ? params.locations.split(',') : [];
          this.paramOrgIds = (params.orgs) ? params.orgs.split(',') : [];
          this.paramChartType = (params.ctype) ? params.ctype : this.chartTypeCodes.BAR;
          this.loadReport = true;
          if (this.model.noLocationOption) {
            this.isNoLocationReport = true;
          }
        } 
      });
    } else {
      this.searchProjectsByCriteriaReport();
    }

    this.getProjectTitles();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getSectorsList();
    this.getMarkers();

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'locationName',
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

    var dataOption = this.dataOptions.filter(o => o.id == this.dataOptionsCodes.ACTUAL_DISBURSEMENTS);
    if (dataOption.length > 0) {
      this.model.selectedDataOptions.push(dataOption[0]);
      this.selectedDataOptions.push(this.dataOptionsCodes.ACTUAL_DISBURSEMENTS);
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
            if (this.model.sectorId > 0) {
              var sectorId = parseInt(this.model.sectorId);
              if (sectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
              } else if (subSectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SUB_SECTORS;
              } else if (subSubSectorIds.indexOf(sectorId) != -1) {
                this.model.sectorLevel = this.sectorLevelCodes.SUB_SUB_SECTORS;
              }

              this.manageSectorLevel();
            }
          }
        }
      }
    );
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
          this.getManualExchangeRateForToday();
        }

        setTimeout(() => {
          this.isDataLoading = false;
          if (this.loadReport) {
            this.searchProjectsByCriteriaReport();
          }
        }, 3000);
      }
    );
  }

  searchProjectsByCriteriaReport() {
    var currentDate = new Date();
    this.chartLables = [];
    this.chartData = [];
    var projectIds = [];
    var chartType = (this.loadReport) ? this.paramChartType : this.model.chartType;
    if (this.model.selectedProjects.length > 0) {
      projectIds = this.model.selectedProjects.map(p => p.id);
    }

    var searchModel = {
      projectIds: projectIds,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.model.selectedOrganizations.map(o => o.id),
      locationIds: this.model.selectedLocations.map(l => l.id),
      sectorId: this.model.sectorId,
      markerId: this.model.markerId,
      markerValue: this.model.markerValue,
      chartType: chartType
    };

    this.resetSearchResults();
    this.blockUI.start('Generating report...');
    if (this.isNoLocationReport) {
      this.model.selectedLocations = [];
    }

    if (this.model.noLocationOption == this.noLocationCodes.PROJECTS_WITHOUT_LOCATIONS) {
      this.reportService.getNoLocationProjectsReport(searchModel).subscribe(
        data => {
          if (data) {
            this.reportDataList = data;
            this.btnReportText = 'Update report';
            if (this.reportDataList && this.reportDataList.locationProjectsList) {
              this.reportDataList.locationProjectsList.forEach((p) => {
                p.isDisplay = false;
              });
              var locationNames = this.reportDataList.locationProjectsList.map(p => p.locationName);
              this.chartLables = locationNames;
              if (this.reportDataList.reportSettings) {
                this.excelFile = this.reportDataList.reportSettings.excelReportName;
                this.setExcelFile();
              }

              if (!this.loadReport) {
                this.manageDataToDisplay();
              }
              
              this.model.selectedCurrency = this.defaultCurrency;
              setTimeout(() => {
                this.datedToday = this.storeService.getLongDateString(currentDate);
                if (this.loadReport) {
                  this.loadReport = false;
                  if (chartType) {
                    this.model.chartType = parseInt(chartType);
                    this.manageDataToDisplay();
                  }
                }
              }, 1000);

              setTimeout(() => {
                this.selectCurrency();
              }, 2000);
            }
          }
          this.blockUI.stop();
          this.isNoLocationReport = false;
        }
      );

    } else {
      this.reportService.getLocationWiseProjectsReport(searchModel).subscribe(
        data => {
          if (data) {
            this.reportDataList = data;
            this.btnReportText = 'Update report';
            if (this.reportDataList && this.reportDataList.locationProjectsList) {
              this.reportDataList.locationProjectsList.forEach((p) => {
                p.isDisplay = false;
              });
              var locationNames = this.reportDataList.locationProjectsList.map(p => p.locationName);
              this.chartLables = locationNames;
              if (this.reportDataList.reportSettings) {
                this.excelFile = this.reportDataList.reportSettings.excelReportName;
                this.setExcelFile();
              }

              if (!this.loadReport) {
                this.manageDataToDisplay();
              }
              this.model.selectedCurrency = this.defaultCurrency;
              
              setTimeout(() => {
                this.datedToday = this.storeService.getLongDateString(currentDate);
                if (this.loadReport) {
                  this.loadReport = false;
                  if (chartType) {
                    this.model.chartType = parseInt(chartType);
                    this.manageDataToDisplay();
                  }
                }
                this.selectCurrency();
              }, 2000);
            }
          }
          this.blockUI.stop();
        }
      );
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.manageResetDisplay();
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
          this.model.sectorId = 0;
          this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          break;
      }
    }
  }

  onChangeParentSector() {
    if (this.model.parentSectorId != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  resetSearchResults() {
    this.chartData = [];
    this.chartLables = [];
    this.reportDataList = [];
  }

  noLocationChanged() {
    if (this.model.noLocationOption == this.noLocationCodes.PROJECTS_WITHOUT_LOCATIONS) {
      this.model.selectedLocations = [];
    }
    this.manageResetDisplay();
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
        this.yearsList = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-location-pdf-view'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
  }

  printReport() {
    this.storeService.printReport('rpt-location-project', 'Locations report', this.selectedCurrencyName);
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
        if (this.loadReport) {
          if (this.paramLocationIds.length > 0) {
            this.paramLocationIds.forEach(function (id) {
              var location = this.locationsList.filter(s => s.id == id);
              if (location.length > 0) {
                this.model.selectedLocations.push(location[0]);
              }
            }.bind(this));
          }
        }
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
          //this.searchProjectsByCriteriaReport();
        }
      }
    )
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

  onProjectSelect(item: any) {
    this.setFilter();
  }

  onProjectSelectAll(item: any) {
    this.setFilter();
  }

  onProjectDeSelect(item: any) {
    if (this.model.selectedProjects.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onProjectDeSelectAll(items: any) {
    this.model.selectedProjects = [];
    this.manageResetDisplay();
  }

  onLocationSelect(item: any) {
    this.setFilter();
  }

  onLocationDeSelect(item: any) {
    if (this.model.selectedLocations.length == 0) {
      this.manageResetDisplay();
    } 
  }

  onLocationSelectAll(items: any) {
    this.setFilter();
  }

  onLocationDeSelectAll(items: any) {
    this.model.selectedLocations = [];
    this.manageResetDisplay();
  }

  onOrganizationSelect(item: any) {
    this.setFilter();
  }

  onOrganizationDeSelect(item: any) {
    if (this.selectedOrganizations.length == 0) {
      this.manageResetDisplay();
    }
  }

  onOrganizationSelectAll(items: any) {
    this.setFilter();
  }

  onOrganizationDeSelectAll(items: any) {
    this.model.selectedOrganizations = [];  
    this.manageResetDisplay();
  }

  selectDataOption() {
    this.chartData = [];
    var selectedDataOption = 1;
    if (this.model.selectedDataOption) {
      selectedDataOption = parseInt(this.model.selectedDataOption);
    }

    switch (selectedDataOption) {
      case this.dataOptionsCodes.PROJECTS:
        this.chartData = this.reportDataList.locationProjectsList.map(p => p.projects.length);
        break;

      case this.dataOptionsCodes.FUNDING:
        this.chartData = this.reportDataList.locationProjectsList.map(p => p.totalFunding);
        break;

      case this.dataOptionsCodes.DISBURSEMENTS:
        this.chartData = this.reportDataList.locationProjectsList.map(p => p.totalDisbursements);
        break;

      default:
        this.chartData = this.reportDataList.locationProjectsList.map(p => p.projects.length);
        break;
    }
  }

  getGrandTotalFundingForLocation() {
    var totalFunding = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalFunding += p.totalFunding;
      });
    }
    return totalFunding;
  }

  getGrandTotalActualDisbursementForLocation() {
    var totalDisursement = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalDisursement += p.actualDisbursements;
      });
    }
    return totalDisursement;
  }

  getGrandTotalPlannedDisbursementForLocation() {
    var totalDisursement = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalDisursement += p.plannedDisbursements;
      });
    }
    return totalDisursement;
  }

  convertAmountsToCurrency() {
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
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

  selectExRateSource() {
    if (this.model.exRateSource && this.model.selectedCurrency) {
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
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (location) {
        location.totalFunding = Math.round(parseFloat(((location.totalFunding * calculatedRate).toFixed(2))));
        location.totalDisbursements = Math.round(parseFloat(((location.totalDisbursements * calculatedRate).toFixed(2))));
        location.actualDisbursements = Math.round(parseFloat(((location.actualDisbursements * calculatedRate).toFixed(2))));
        location.plannedDisbursements = Math.round(parseFloat(((location.plannedDisbursements * calculatedRate).toFixed(2))));

        if (location.projects && location.projects.length > 0) {
          location.projects.forEach(function (project) {
            project.projectCost = Math.round(parseFloat(((project.projectCost * calculatedRate).toFixed(2))));
            project.actualDisbursements = Math.round(parseFloat(((project.actualDisbursements * calculatedRate).toFixed(2))));
            project.plannedDisbursements = Math.round(parseFloat(((project.plannedDisbursements * calculatedRate).toFixed(2))));
          });
        }
      });

      this.getGrandTotalFundingForLocation();
      this.getGrandTotalActualDisbursementForLocation();
      this.getGrandTotalPlannedDisbursementForLocation();

      this.showChart = false;
      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.FUNDING) != -1) {
          this.chartData = [];
          var locationFunding = this.reportDataList.locationProjectsList.map(p => p.totalFunding);
          var chartData = { data: locationFunding, label: this.dataOptionLabels.FUNDING };
          this.chartData.push(chartData);
          this.doughnutChartData.push(locationFunding);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.FUNDING] = (this.doughnutChartData.length - 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.DISBURSEMENTS) != -1) {
          this.chartData = [];
          var locationDisbursements = this.reportDataList.locationProjectsList.map(p => p.totalDisbursements);
          var chartData = { data: locationDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(locationDisbursements);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.DISBURSEMENTS] = (this.doughnutChartData.length - 1);
      }

      setTimeout(() => {
        this.showChart = true;
      }, 1000);
    }
  }

  manageDataOptions() {
    if (this.selectedDataOptions.length > 0 && this.reportDataList.locationProjectsList) {
      this.chartData = [];
      this.doughnutChartData = [];
      this.showChart = false;

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.ACTUAL_DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.ACTUAL_DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var locationProjects = this.reportDataList.locationProjectsList.map(p => p.actualDisbursements);
          var chartData = { data: locationProjects, label: this.dataOptionLabels.ACTUAL_DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(locationProjects);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.ACTUAL_DISBURSEMENTS] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.ACTUAL_DISBURSEMENTS);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.ACTUAL_DISBURSEMENTS], 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.PLANNED_DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.PLANNED_DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var plannedDisbursements = this.reportDataList.locationProjectsList.map(p => p.plannedDisbursements);
          var chartData = { data: plannedDisbursements, label: this.dataOptionLabels.PLANNED_DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(plannedDisbursements);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.PLANNED_DISBURSEMENTS] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.PLANNED_DISBURSEMENTS);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.PLANNED_DISBURSEMENTS], 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var locationDisbursements = this.reportDataList.locationProjectsList.map(p => p.totalDisbursements);
          var chartData = { data: locationDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(locationDisbursements);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.DISBURSEMENTS] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.DISBURSEMENTS);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.DISBURSEMENTS], 1);
      }

      if (this.selectedDataOptions.length > 0) {
        setTimeout(() => {
          this.showChart = true;
        }, 1000);
      }
    }

    if (this.selectedDataOptions.length == 0 && this.chartData.length > 0) {
      this.chartData = [];
      this.doughnutChartData = [];
      setTimeout(() => {
        this.showChart = true;
      }, 1000);
    }
  }

  setupStackedChartData() {
    this.stackedChartData = [];
    var locationProjects = this.reportDataList.locationProjectsList;
    this.stackedChartLabels = this.reportDataList.locationProjectsList.map(p => p.locationName);
    var disbursements = locationProjects.map(s => s.actualDisbursements);
    var expectedDisbursements = locationProjects.map(s => s.plannedDisbursements);

    this.stackedChartData.push({
      data: disbursements,
      label: 'Actual disbursements',
      stack: 'Stack 0'
    });

    this.stackedChartData.push({
      data: expectedDisbursements,
      label: 'Planned disbursements',
      stack: 'Stack 0'
    });

    setTimeout(() => {
      this.isShowStackedChart = true;
    }, 1000);
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  manageDataToDisplay() {
    this.chartData = [];
    var selectedDataOption = 1;
    var chartType = (this.loadReport) ? this.paramChartType : this.model.chartType;
    if (this.model.selectedDataOption) {
      this.selectedDataOptions = [];
      selectedDataOption = parseInt(this.model.selectedDataOption);
      this.selectedDataOptions.push(selectedDataOption);
    }
    selectedDataOption = parseInt(this.model.selectedDataOption);
    var searchChartType = this.chartOptions.filter(c => c.id == chartType);
    if (searchChartType.length > 0) {
      this.model.chartTypeName = searchChartType[0].type;
    }
    
    if (chartType == this.chartTypeCodes.STACKEDBAR) {
      this.isShowStackedChart = false;
      this.setupStackedChartData();
    } else if (chartType != this.chartTypeCodes.PIE && chartType != this.chartTypeCodes.POLAR) {
      this.manageDataOptions();
    } else {
      switch (selectedDataOption) {
        case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
          this.chartData = this.reportDataList.locationProjectsList.map(p => p.actualDisbursements);
          break;
  
        case this.dataOptionsCodes.PLANNED_DISBURSEMENTS:
          this.chartData = this.reportDataList.locationProjectsList.map(p => p.plannedDisbursements);
          break;
  
        case this.dataOptionsCodes.DISBURSEMENTS:
          this.chartData = this.reportDataList.locationProjectsList.map(p => p.totalDisbursements);
          break;
  
        default:
          this.chartData = this.reportDataList.locationProjectsList.map(p => p.actualDisbursements);
          break;
      }
    }
  }

  displayHideRow(locationName) {
    if (this.reportDataList.locationProjectsList) {
      var selectLocation = this.reportDataList.locationProjectsList.filter(l => l.locationName == locationName);
      if (selectLocation.length > 0) {
        selectLocation[0].isDisplay = !selectLocation[0].isDisplay;
      }
    }
  }

  manageResetDisplay() {
    if (this.model.selectedProjects.length == 0 && this.model.startingYear == 0 &&
      this.model.endingYear == 0 && this.model.selectedLocations.length == 0 && 
      this.model.selectedOrganizations.length == 0 && this.model.sectorId == 0 &&
      this.model.selectedCurrency == this.defaultCurrency) {
        this.isAnyFilterSet = false;
      } else {
        this.isAnyFilterSet = true;
      }
  }

  getMarkers() {
    this.markerService.getMarkers().subscribe(
      data => {
        if (data) {
          this.markersList = data;
          if (this.model.markerId) {
            this.getSelectedMarkerValues();
          }
        }
      }
    );
  }

  getSelectedMarkerValues() {
    this.markerValues = [];
    if (this.model.markerId) {
      var values = this.markersList.filter(m => m.id == this.model.markerId).map(m => m.values);
      if (values) {
        this.markerValues = JSON.parse(values);
      };
    }
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  resetFilters() {
    this.model.selectedProjects = [];
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.model.selectedLocations = [];
    this.model.selectedOrganizations = [];
    this.model.sectorId = 0;
    this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
    this.isAnyFilterSet = false;
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
