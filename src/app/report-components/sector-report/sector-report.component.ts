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
import { Settings } from 'src/app/config/settings';
import { ProjectService } from 'src/app/services/project.service';
import { MarkerService } from 'src/app/services/marker.service';
import { UrlHelperService } from 'src/app/services/url-helper-service';

@Component({
  selector: 'sector-report',
  templateUrl: './sector-report.component.html',
  styleUrls: ['./sector-report.component.css']
})
export class SectorReportComponent implements OnInit {
  parentSectorsSummary: any = [];
  parentSectorsWithProjects: any = [];
  sectorProjectsList: any = [];
  parentSectorLabels: any = [];
  sectorsSettings: any = [];
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  selectedDataOptions: any = [];
  exchangeRates: any = [];
  selectedChartType: number = 1;
  organizationsSettings: any = {};
  projectsSettings: any = {};
  dataOptionSettings: any = {};
  locationsSettings: any = {};
  subLocationsSettings: any = {};
  markerValuesSettings: any = {};
  oldCurrencyRate: number = 0;
  oldCurrency: string = null;
  currencyRate: number = 0;
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
  paramProjectIds: any = [];
  paramChartType: string = null;
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  isDefaultCurrencySet: boolean = true;
  requestNo: number = 0;
  pageHeight: number = Settings.pdfPrintPageHeight;
  btnReportText: string = 'Update report';
  isAnyFilterSet: boolean = false;
  isShowStackedChart: boolean = false;
  isNoSectorReport: boolean = false;
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
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];
  exchangeRatesList: any = [];
  projects: any = [];
  selectedProjects: any = [];
  paramMarkerValues: any = [];
  paramSubLocationIds: any = [];

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 3, type: 'doughnut', title: 'Doughnut chart' },
    { id: 4, type: 'stacked-bar', title: 'Stacked bar chart' },
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

  dataOptionsIndexForDoughnut: any = {
    1: 0,
    2: 1,
    3: 2
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


  dataOptionsCodes: any = {
    'ACTUAL_DISBURSEMENTS': 1,
    'PLANNED_DISBURSEMENTS': 2,
    'DISBURSEMENTS': 3
  };

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

  noSectorOptions: any = {
    PROJECTS_WITH_SECTORS: 1,
    PROJECTS_WITHOUT_SECTORS: 2
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

  pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
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
        label: function (tooltipItem, data) {
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
  stackedChartLabels: any = [];
  barChartType: string = 'bar';
  stackedChartType: string = 'bar';
  chartLegend: boolean = true;
  chartData: any = [];
  stackedChartData: any = [];
  doughnutChartData: any = [];
  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0, parentSectorId: 0, chartType: 1,
    sectorIds: [], locationId: 0, selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], selectedSubLocations: [], selectedProjects: [], sectorsList: [], 
    locationsList: [], subLocationsList: [], organizationsList: [],
    selectedCurrency: null, exRateSource: null, dataOption: 1, selectedDataOptions: [],
    selectedDataOption: 1, chartTypeName: 'bar', sectorLevel: this.sectorLevelCodes.SECTORS,
    noSectorOption: this.noSectorOptions.PROJECTS_WITH_SECTORS,
    markerId: 0, markerValue: null, markerValues: []
  };
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
    this.model.chartType = this.chartTypeCodes.BAR;
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
          this.isNoSectorReport = (params.noSectors) ? true : false;
          this.model.sectorLevel = (params.noSectors) ? this.sectorLevelCodes.NO_SECTORS : this.model.sectorLevel;
          this.model.startingYear = (params.syear) ? parseInt(params.syear) : 0;
          this.model.endingYear = (params.eyear) ? parseInt(params.eyear) : 0;
          this.model.locationId = (params.locationId) ? parseInt(params.locationId) : 0;
          this.paramSubLocationIds = (params.slocations) ? params.slocations.split(',').map(l => parseInt(l)) : [];
          this.paramProjectIds = (params.projects) ? params.projects.split(',').map(p => parseInt(p)) : [];
          this.paramSectorIds = (params.sectors) ? params.sectors.split(',').map(s => parseInt(s)) : [];
          this.paramOrgIds = (params.orgs) ? params.orgs.split(',').map(o => parseInt(o)) : [];
          this.model.markerId = (params.mid) ? parseInt(params.mid) : 0;
          this.paramChartType = (params.ctype) ? params.ctype : this.chartTypeCodes.BAR;
          this.model.sectorLevel = (params.level) ? parseInt(params.level) : this.sectorLevelCodes.SECTORS;
          if (this.model.sectorLevel) {
            this.manageSectorLevel();
          }
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

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.subLocationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'subLocation',
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

    var dataOption = this.dataOptions.filter(o => o.id == 1);
    if (dataOption.length > 0) {
      this.model.selectedDataOptions.push(dataOption[0]);
      this.selectedDataOptions.push(this.dataOptionsCodes.ACTUAL_DISBURSEMENTS);
    }
  }

  displayTitle(project?: any): string | undefined {
    return (project) ? project.title : undefined;
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

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
          this.model.selectedCurrency = data.currency;
          this.oldCurrency = this.model.selectedCurrency;
          this.selectedCurrencyName = data.currencyName;
          this.currenciesList.push(data);
        } else {
          this.isDefaultCurrencySet = false;
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
        this.getManualExchangeRateForToday();
        setTimeout(() => {
          this.isDataLoading = false;
          if (this.loadReport) {
            this.searchProjectsByCriteriaReport();
          }
        }, 3000);
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
    var currentDate = new Date();
    this.blockUI.start('Generating report...');
    this.chartLables = [];
    this.chartData = [];
    this.stackedChartData = [];
    this.parentSectorsSummary = [];
    this.parentSectorsWithProjects = [];
    var projectIds = [];

    if (this.model.selectedProjects.length > 0) {
      projectIds = this.model.selectedProjects.map(p => p.id);
    }

    var chartType = (this.loadReport) ? this.paramChartType : this.model.chartType;
    var searchModel = {
      projectIds: (this.loadReport) ? this.paramProjectIds : projectIds,
      locationId: (this.model.locationId) ? parseInt(this.model.locationId) : 0,
      subLocationIds: (this.loadReport) ? this.paramSubLocationIds : this.model.selectedSubLocations.map(o => o.id),
      startingYear: (this.model.startingYear) ? parseInt(this.model.startingYear) : 0,
      endingYear: (this.model.endingYear) ? parseInt(this.model.endingYear) : 0,
      organizationIds: (this.loadReport) ? this.paramOrgIds : this.model.selectedOrganizations.map(o => o.id),
      parentSectorId: (this.model.parentSectorId) ? parseInt(this.model.parentSectorId) : 0,
      sectorLevel: (this.model.sectorLevel) ? parseInt(this.model.sectorLevel) : 0,
      markerId: (this.model.markerId) ? parseInt(this.model.markerId) : 0,
      markerValues: (this.model.markerValues.length > 0) ? this.model.markerValues.map(v => v.value) : [],
      chartType: (chartType) ? parseInt(chartType) : 1,
      level: (this.model.sectorLevel) ? parseInt(this.model.sectorLevel) : 0,
      sectorIds: (this.loadReport) ? this.paramSectorIds : this.model.selectedSectors.map(s => s.id),
    };

    this.resetSearchResults();
    this.reportService.getSectorWiseProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        this.btnReportText = 'Update report';
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          this.reportDataList.sectorProjectsList.forEach((s) => {
            s.isDisplay = false;
          });

          var sectorProjectsList = this.reportDataList.sectorProjectsList;
          if (this.model.sectorLevel == this.sectorLevelCodes.SECTORS) {
            var parentSectorIds = sectorProjectsList.map(item => item.parentSectorId)
              .filter((value, index, self) => self.indexOf(value) === index);

            parentSectorIds.forEach((pid) => {
              var sectors = sectorProjectsList.filter(s => (s.parentSectorId == pid));
              var actualDisbursements = 0;
              var plannedDisbursements = 0;
              var totalDisbursements = 0;
              var totalFunding = 0;
              var sectorName = '';
              var sectorId = 0;
              var projectsList: any = [];

              sectors.forEach((s) => {
                actualDisbursements += s.actualDisbursements;
                plannedDisbursements += s.plannedDisbursements;
                totalDisbursements += s.totalDisbursements;
                totalFunding += s.totalFunding;
                sectorName = (s.parentSector == null && s.parentSectorId == 0) ? s.sectorName : s.parentSector;
                sectorId = s.parentSectorId;

                var sectorProjects = s.projects;
                sectorProjects.forEach((p) => {
                  if (projectsList.length > 0) {
                    var projectAdded = projectsList.filter(project => project.projectId == p.projectId);
                    if (projectAdded.length == 0) {
                      projectsList.push(p);
                    }
                  } else {
                    projectsList.push(p);
                  }
                });
              });

              this.parentSectorsSummary.push({
                sectorName: sectorName,
                actualDisbursements: actualDisbursements,
                plannedDisbursements: plannedDisbursements,
                totalDisbursements: totalDisbursements,
              });
              this.parentSectorsSummary.sort(this.storeService.sortArrayByProperty("sectorName"));

              this.parentSectorsWithProjects.push({
                sectorId: sectorId,
                sectorName: sectorName,
                actualDisbursements: actualDisbursements,
                plannedDisbursements: plannedDisbursements,
                totalDisbursements: totalDisbursements,
                totalFunding: totalFunding,
                projects: projectsList,
                isDisplay: false
              });
              this.chartLables.push(sectorName);
            });
            this.chartLables = this.chartLables.sort();
            this.sectorProjectsList = this.parentSectorsWithProjects;
          } else {
            this.chartLables = sectorProjectsList.map(p => p.sectorName).sort();
            this.sectorProjectsList = sectorProjectsList;
          }
        }

        if (this.sectorProjectsList.length > 1) {
          this.sectorProjectsList.sort((a, b) => (a.sectorName > b.sectorName) ? 1 : -1);
          this.sectorProjectsList.forEach((pl) => {
            pl.projects.sort((c, d) => (c.title > d.title) ? 1 : -1);
          });
        }

        if (this.reportDataList.reportSettings) {
          this.excelFile = this.reportDataList.reportSettings.excelReportName;
          this.setExcelFile();
        }

        if (!this.loadReport) {
          this.manageDataToDisplay();
        }

        this.model.selectedCurrency = this.defaultCurrency;
        this.blockUI.stop();
        setTimeout(() => {
          this.selectCurrency();
          this.datedToday = this.storeService.getLongDateString(currentDate);
          if (this.loadReport) {
            this.loadReport = false;
            if (chartType) {
              this.model.chartType = parseInt(chartType);
              this.manageDataToDisplay();
            }
          }
        }, 2000);
      }
    );

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.manageResetDisplay();
  }

  setupStackedChartData() {
    this.stackedChartData = [];
    this.stackedChartLabels = this.chartLables;
    var actualDisbursements = [];
    var plannedDisbursements = [];

    if (this.model.sectorLevel == this.sectorLevelCodes.SECTORS) {
      actualDisbursements = this.parentSectorsSummary.map(s => s.actualDisbursements);
      plannedDisbursements = this.parentSectorsSummary.map(s => s.plannedDisbursements);
    } else {
      actualDisbursements = this.sectorProjectsList.map(s => s.actualDisbursements);
      plannedDisbursements = this.sectorProjectsList.map(s => s.plannedDisbursements);
    }

    this.stackedChartData.push({
      data: actualDisbursements,
      label: 'Actual disbursements',
      stack: 'Stack 0'
    });

    this.stackedChartData.push({
      data: plannedDisbursements,
      label: 'Planned disbursements',
      stack: 'Stack 0'
    });

    setTimeout(() => {
      this.isShowStackedChart = true;
    }, 1000);
  }

  resetSearchResults() {
    this.chartData = [];
    this.chartLables = [];
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
        this.yearsList = data;
      }
    );
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-sector-pdf-view'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
  }

  printReport() {
    this.storeService.printReport('rpt-sector-project', 'Sectors report', this.selectedCurrencyName);
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
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

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
          this.getSubLocationsList();
        }
      }
    );
  }

  getSubLocationsList() {
    this.locationService.getSubLocationsList().subscribe(
      data => {
        if (data) {
          this.subLocationsList = data;
          this.filteredSubLocationsList = data;
          if (this.loadReport) {
            if (this.paramSubLocationIds.length > 0) {
              this.paramSubLocationIds.forEach(function (id) {
                var subLocation = this.subLocationsList.filter(s => s.id == id);
                if (subLocation.length > 0) {
                  this.model.selectedSubLocations.push(subLocation[0]);
                }
              }.bind(this));
            }
          }
        }
      }
    );
  }

  filterSubLocations() {
    this.model.filteredSubLocationsList = [];
    this.model.selectedSubLocations = [];
    if (this.model.locationId == 0) {
      this.filterSubLocations = this.subLocationsList;
    } else {
      this.filteredSubLocationsList = this.subLocationsList.filter(s => s.locationId == this.model.locationId);
    }
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

  onChangeParentSector() {
    if (this.model.parentSectorId != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onChangeCurrency() {
    if (this.model.selectedCurrency) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onProjectSelect(item: any) {
    this.setFilter();
  }

  onProjectSelectAll(items: any) {
    this.setFilter();
  }

  onProjectDeselect(item: any) {
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

  onSectorSelect(item: any) {
    var id = item.id;
    if (this.selectedSectors.indexOf(id) == -1) {
      this.selectedSectors.push(id);
    }
    this.setFilter();
  }

  onSectorDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedSectors.indexOf(id);
    this.selectedSectors.splice(index, 1);
    if (this.model.selectedSectors.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
    if (this.selectedSectors.length == 0) {
      this.manageResetDisplay();
    }
  }

  onSectorSelectAll(items: any) {
    this.setFilter();
  }

  onSectorDeSelectAll(items: any) {
    this.model.selectedSectors = [];
    this.manageResetDisplay();
  }

  onOrganizationSelect(item: any) {
    this.setFilter();
  }

  onOrganizationDeSelect(item: any) {
    var id = item.id;
    if (this.selectedOrganizations.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onOrganizationSelectAll(items: any) {
    this.setFilter();
  }

  onOrganizationDeSelectAll(items: any) {
    this.model.selectedOrganizations = [];
    this.manageResetDisplay();
  }

  onSubLocationSelect(item: any) {
    this.setFilter();
  }

  onSubLocationDeSelect(item: any) {
    if (this.model.selectedLocations.length == 0) {
      this.manageResetDisplay();
    } 
  }

  onSubLocationSelectAll(items: any) {
    this.setFilter();
  }

  onSubLocationDeSelectAll(items: any) {
    this.model.selectedLocations = [];
    this.manageResetDisplay();
  }


  changeLocation() {
    if (this.model.locationId != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
    this.model.selectedSubLocations = [];
    this.filterSubLocations();
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
    var tChartType = this.chartOptions.filter(c => c.id == chartType);
    if (tChartType.length > 0) {
      this.model.chartTypeName = tChartType[0].type;
    }

    if (chartType == this.chartTypeCodes.STACKEDBAR) {
      this.setupStackedChartData();
    } else if (chartType != this.chartTypeCodes.PIE && chartType != this.chartTypeCodes.POLAR) {
      this.manageDataOptions();
    } else {
      switch (selectedDataOption) {
        case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
          this.chartData = this.sectorProjectsList.map(p => p.actualDisbursements);
          break;

        case this.dataOptionsCodes.PLANNED_DISBURSEMENTS:
          this.chartData = this.sectorProjectsList.map(p => p.plannedDisbursements);
          break;

        case this.dataOptionsCodes.DISBURSEMENTS:
          this.chartData = this.sectorProjectsList.map(p => p.totalDisbursements);
          break;

        default:
          this.chartData = this.sectorProjectsList.map(p => p.actualDisbursements);
          break;
      }
    }
  }

  getGrandTotalFundingForSector() {
    var totalFunding = 0;
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        totalFunding += p.totalDisbursements;
      });
    }
    return totalFunding;
  }

  getGrandTotalActualDisbursementForSector() {
    var totalDisbursement = 0;
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        totalDisbursement += p.actualDisbursements;
      });
    }
    return totalDisbursement;
  }

  getGrandTotalPlannedDisbursementForSector() {
    var totalDisbursement = 0;
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        totalDisbursement += p.plannedDisbursements;
      });
    }
    return totalDisbursement;
  }

  convertAmountsToCurrency() {
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        p.totalDisbursements = 0;
      });
    }
  }

  manageDataOptions() {
    if (this.selectedDataOptions.length > 0 && this.sectorProjectsList) {
      this.chartData = [];
      this.doughnutChartData = [];
      this.showChart = false;

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.ACTUAL_DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.ACTUAL_DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var actualDisbursements = this.sectorProjectsList.map(p => p.actualDisbursements);
          var chartData = { data: actualDisbursements, label: this.dataOptionLabels.ACTUAL_DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(actualDisbursements);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.ACTUAL_DISBURSEMENTS] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.ACTUAL_DISBURSEMENTS);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.ACTUAL_DISBURSEMENTS], 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.PLANNED_DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.PLANNED_DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var plannedDisbursements = this.sectorProjectsList.map(p => p.plannedDisbursements);
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
          var totalDisbursements = this.sectorProjectsList.map(p => p.totalDisbursements);
          var chartData = { data: totalDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(totalDisbursements);
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

    if (this.oldCurrencyRate == 0) {
      this.oldCurrencyRate = 1;
    }
    calculatedRate = (exRate / this.oldCurrencyRate);
    this.oldCurrencyRate = exRate;
    this.oldCurrency = this.model.selectedCurrency;

    if (calculatedRate > 0 && calculatedRate != 1) {
      this.applyRateOnFinancials(calculatedRate);
    }
  }

  applyRateOnFinancials(calculatedRate: number) {
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (sector) {
        sector.totalFunding = Math.round(parseFloat(((sector.totalFunding * calculatedRate).toFixed(2))));
        sector.totalDisbursements = Math.round(parseFloat(((sector.totalDisbursements * calculatedRate).toFixed(2))));
        sector.actualDisbursements = Math.round(parseFloat(((sector.actualDisbursements * calculatedRate).toFixed(2))));
        sector.plannedDisbursements = Math.round(parseFloat(((sector.plannedDisbursements * calculatedRate).toFixed(2))));

        if (sector.projects && sector.projects.length > 0) {
          sector.projects.forEach(function (project) {
            project.projectCost = Math.round(parseFloat(((project.projectCost * calculatedRate).toFixed(2))));
            project.actualDisbursements = Math.round(parseFloat(((project.actualDisbursements * calculatedRate).toFixed(2))));
            project.plannedDisbursements = Math.round(parseFloat(((project.plannedDisbursements * calculatedRate).toFixed(2))));
          });
        }
      });

      this.parentSectorsSummary.forEach((p) => {
        p.actualDisbursements = Math.round(parseFloat(((p.actualDisbursements * calculatedRate).toFixed(2))));
        p.plannedDisbursements = Math.round(parseFloat(((p.plannedDisbursements * calculatedRate).toFixed(2))));
        p.totalDisbursements = Math.round(parseFloat(((p.totalDisbursements * calculatedRate).toFixed(2))));
      });

      this.sectorProjectsList.forEach((s) => {
        s.actualDisbursements = Math.round(parseFloat(((s.actualDisbursements * calculatedRate).toFixed(2))));
        s.plannedDisbursements = Math.round(parseFloat(((s.plannedDisbursements * calculatedRate).toFixed(2))));
        s.totalDisbursements = Math.round(parseFloat(((s.totalDisbursements * calculatedRate).toFixed(2))));
      });

      this.getGrandTotalFundingForSector();
      this.getGrandTotalActualDisbursementForSector();
      this.getGrandTotalPlannedDisbursementForSector();

      this.showChart = false;
      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.FUNDING) != -1) {
        this.chartData = [];
        var sectorFunding = this.reportDataList.sectorProjectsList.map(p => p.totalFunding);
        var chartData = { data: sectorFunding, label: this.dataOptionLabels.FUNDING };
        this.chartData.push(chartData);
        this.doughnutChartData.push(sectorFunding);
        this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.FUNDING] = (this.doughnutChartData.length - 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.DISBURSEMENTS) != -1) {
        this.chartData = [];
        var sectorDisbursements = this.reportDataList.sectorProjectsList.map(p => p.totalDisbursements);
        var chartData = { data: sectorDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
        this.chartData.push(chartData);
        this.doughnutChartData.push(sectorDisbursements);
        this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.DISBURSEMENTS] = (this.doughnutChartData.length - 1);
      }

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

  displayHideRow(sector) {
    if (this.model.sectorLevel == this.sectorLevelCodes.SECTORS) {
      if (this.parentSectorsWithProjects.length > 0) {
        var selectSector = this.parentSectorsWithProjects.filter(s => s.sectorName == sector);
        if (selectSector.length > 0) {
          selectSector[0].isDisplay = !selectSector[0].isDisplay;
        }
      }
    } else {
      if (this.reportDataList.sectorProjectsList) {
        var selectSector = this.reportDataList.sectorProjectsList.filter(s => s.sectorName == sector);
        if (selectSector.length > 0) {
          selectSector[0].isDisplay = !selectSector[0].isDisplay;
        }
      }
    }
  }

  manageResetDisplay() {
    if (this.model.selectedProjects.length == 0 && this.model.startingYear == 0 &&
      this.model.endingYear == 0 && this.model.parentSectorId == 0 &&
      this.model.selectedSectors.length == 0 && this.model.selectedOrganizations.length == 0 &&
      this.model.selectedCurrency == this.defaultCurrency &&
      this.model.locationId == 0) {
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
    this.model.selectedSubLocations = [];
    this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
    this.model.locationId = 0;
    this.filteredSubLocationsList = this.subLocationsList;
    this.isAnyFilterSet = false;
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
