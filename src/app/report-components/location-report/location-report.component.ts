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
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 3, type: 'doughnut', title: 'Doughnut chart' },
    { id: 4, type: 'line', title: 'Line chart' },
    { id: 5, type: 'radar', title: 'Radar' },
    { id: 6, type: 'polarArea', title: 'Polar area' }
  ];

  chartTypes: any = {
    BAR: 'bar',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    LINE: 'line',
    RADAR: 'radar',
    POLAR: 'polarArea'
  };

  chartTypeCodes: any = {
    BAR: 1,
    PIE: 2,
    DOUGHNUT: 3,
    LINE: 4,
    RADAR: 5,
    POLAR: 6
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
  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0, chartType: 'bar',
    sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: [],
    selectedCurrency: null, exRateSource: null, dataOption: 1, selectedDataOptions: [],
    selectedDataOption: 1, chartTypeName: 'bar', selectedProjects: []
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent, private route: ActivatedRoute, 
    private projectService: ProjectService
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
          this.paramLocationIds = (params.locations) ? params.locations.split(',') : [];
          this.paramOrgIds = (params.orgs) ? params.orgs.split(',') : [];
          this.loadReport = true;
        } 
      });
    } else {
      this.isLoading = false;
    }

    this.getProjectTitles();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.datedToday = this.storeService.getLongDateString(new Date());

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
        }, 2000);
      }
    );
  }

  searchProjectsByCriteriaReport() {
    this.chartLables = [];
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
      locationIds: this.model.selectedLocations.map(l => l.id),
    };

    this.resetSearchResults();
    this.blockUI.start('Preparing report...');
    this.reportService.getLocationWiseProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.locationProjectsList) {
          var locationNames = this.reportDataList.locationProjectsList.map(p => p.locationName);
          this.chartLables = locationNames;
          if (this.reportDataList.reportSettings) {
            this.excelFile = this.reportDataList.reportSettings.excelReportName;
            this.setExcelFile();
          }
          this.manageDataToDisplay();
          this.model.selectedCurrency = this.defaultCurrency;
          this.selectCurrency();
        }
        this.blockUI.stop();
      }
    );

    setTimeout(() => {
      this.isLoading = false;
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
      },
      error => {
        console.log(error);
      }
    );
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    var result = Promise.resolve(this.reportService.generatePDF('rpt-location-pdf-view'));
    result.then(() => {
      this.blockUI.stop();
    });
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
          this.searchProjectsByCriteriaReport();
        }
      }
    )
  }

  onLocationSelect(item: any) {
    var id = item.id;
    /*if (this.selectedLocations.indexOf(id) == -1) {
      this.selectedLocations.push(id);
    }*/
  }

  onLocationDeSelect(item: any) {
    var id = item.id;
    /*var index = this.selectedLocations.indexOf(id);
    this.selectedLocations.splice(index, 1);*/

    this.searchProjectsByCriteriaReport();
  }

  onLocationSelectAll(items: any) {
    /*items.forEach(function (item) {
      var id = item.id;
      if (this.selectedLocations.indexOf(id) == -1) {
        this.selectedLocations.push(id);
      }
    }.bind(this));*/
  }

  onOrganizationSelect(item: any) {
    var id = item.id;
    /*if (this.selectedOrganizations.indexOf(id) == -1) {
      this.selectedOrganizations.push(id);
    }*/
  }

  onOrganizationDeSelect(item: any) {
    var id = item.id;
    /*var index = this.selectedOrganizations.indexOf(id);
    this.selectedOrganizations.splice(index, 1);*/
    this.searchProjectsByCriteriaReport();
  }

  onOrganizationSelectAll(items: any) {
    /*items.forEach(function (item) {
      var id = item.id;
      if (this.selectedOrganizations.indexOf(id) == -1) {
        this.selectedOrganizations.push(id);
      }
    }.bind(this));*/
  }

  onDataOptionSelect(item: any) {
    var id = item.id;
    if (this.selectedDataOptions.indexOf(id) == -1) {
      this.selectedDataOptions.push(id);
      this.manageDataOptions();
    }
  }

  onDataOptionDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedDataOptions.indexOf(id);
    this.selectedDataOptions.splice(index, 1);
    this.manageDataOptions();
  }

  onDataOptionSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedDataOptions.indexOf(id) == -1) {
        this.selectedDataOptions.push(id);
      }
    }.bind(this));
    this.manageDataOptions();
  }

  onDataOptionDeSelectAll(items: any) {
    this.selectedDataOptions = [];
    this.manageDataOptions();
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

  getGrandTotalDisbursementForLocation() {
    var totalDisursement = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalDisursement += p.totalDisbursements;
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
      this.getGrandTotalDisbursementForLocation();

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

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  manageDataToDisplay() {
    this.chartData = [];
    var selectedDataOption = 1;
    if (this.model.selectedDataOption) {
      this.selectedDataOptions = [];
      selectedDataOption = parseInt(this.model.selectedDataOption);
      this.selectedDataOptions.push(selectedDataOption);
    }
    selectedDataOption = parseInt(this.model.selectedDataOption);
    var chartType = this.chartOptions.filter(c => c.id == this.model.chartType);
    if (chartType.length > 0) {
      this.model.chartTypeName = chartType[0].type;
    }
    
    if (this.model.chartType != this.chartTypeCodes.PIE && this.model.chartType != this.chartTypeCodes.POLAR) {
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

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  getTodaysDate() {
    return this.storeService.getLongDateAndTime();
  }

}
