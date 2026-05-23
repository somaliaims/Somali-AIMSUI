import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { forkJoin } from 'rxjs';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  iconUrl: 'assets/images/marker-icon.png',
  shadowUrl: 'assets/images/marker-shadow.png',
});

@Component({
  selector: 'app-organisations-report',
  templateUrl: './organisations-report.component.html',
  styleUrls: ['./organisations-report.component.css']
})
export class OrganisationsReportComponent implements OnInit, AfterViewInit, OnDestroy {

  // Report data
  organisationsSummary: any = [];
  organisationProjectsList: any = [];
  projectsList: any = [];
  showSectorChart: boolean = false;
  reportDataList: any = null;

  // Chart data
  sectorChartData: any = [];
  sectorChartLabels: any = [];
  financialChartData: any = [];
  financialChartLabels: any = [];

  // Settings and dropdowns
  organizationsSettings: any = {};
  sectorsSettings: any = {};
  locationsSettings: any = {};
  subLocationsSettings: any = {};
  projectsSettings: any = {};
  markerValuesSettings: any = {};
  dataOptionSettings: any = {};

  // Data lists
  organizationsList: any = [];
  sectorsList: any = [];
  allSectorsList: any = [];
  locationsList: any = [];
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];
  projects: any = [];
  markersList: any = [];
  markerValues: any = [];
  yearsList: any = [];
  currenciesList: any = [];
  exchangeRates: any = [];

  // Model for filters
  model: any = {
    title: '',
    organizationIds: [],
    startingYear: 0,
    endingYear: 0,
    sectorIds: [],
    locationId: 0,
    selectedSectors: [],
    selectedOrganizations: [],
    selectedLocations: [],
    selectedSubLocations: [],
    selectedProjects: [],
    sectorsList: [],
    locationsList: [],
    subLocationsList: [],
    organizationsList: [],
    selectedCurrency: '',
    exRateSource: null,
    dataOption: 1,
    selectedDataOptions: [],
    selectedDataOption: 1,
    chartType: 1,
    chartTypeName: 'bar',
    sectorLevel: 0,
    markerId: 0,
    markerValues: [],
    markerId2: 0,
    markerValues2: [],
    
  };
loadProjectsByOrganizations() {

  const selectedOrgs = this.model.selectedOrganizations;

  // empty check
  if (!selectedOrgs || selectedOrgs.length === 0) {
    this.organisationProjectsList = [];
    return;
  }

  const requests = selectedOrgs.map((org: any) =>
    this.organizationService.getOrganizationProjects(org.id)
  );

  forkJoin(requests).subscribe({
    next: (responses: any[]) => {

      this.organisationProjectsList = selectedOrgs.map((org: any, index: number) => {

        const projects = responses[index] || [];

        return {
          organizationId: org.id,
          organizationName: org.text || org.organizationName || 'Organization',
          isDisplay: false,
          actualDisbursements: 0,   // optional safe default
          plannedDisbursements: 0,  // optional safe default
          projects: projects
        };
      });

    },

    error: (err) => {
      console.error('Error loading projects:', err);
      this.organisationProjectsList = [];
    }
  });
}
onOrganizationSelect(event: any) {
  this.loadProjectsByOrganizations();
}

onOrganizationDeSelect(event: any) {
  this.loadProjectsByOrganizations();
}

onOrganizationSelectAll(event: any) {
  this.loadProjectsByOrganizations();
}

onOrganizationDeSelectAll(event: any) {
  this.model.selectedProjects = [];
} 

// Chart configuration
  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 3, type: 'doughnut', title: 'Doughnut chart' },
    { id: 4, type: 'stacked-bar', title: 'Stacked bar chart' },
    { id: 5, type: 'line', title: 'Line chart' }
  ];

  chartTypes: any = {
    BAR: 'bar',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    STACKEDBAR: 'stacked-bar',
    LINE: 'line'
  };

  chartTypeCodes: any = {
    BAR: 1,
    PIE: 2,
    DOUGHNUT: 3,
    STACKEDBAR: 4,
    LINE: 5
  };

  dataOptions: any = [
    { id: 1, type: 'actual-disbursements', value: 'Actual disbursements' },
    { id: 2, type: 'projected-disbursements', value: 'Projected disbursements' },
    { id: 3, type: 'envelope-amount', value: 'Envelope amount' },
    { id: 4, type: 'total-disbursements', value: 'Total disbursements' }
  ];

  dataOptionsCodes: any = {
    'ACTUAL_DISBURSEMENTS': 1,
    'PROJECTED_DISBURSEMENTS': 2,
    'ENVELOPE_AMOUNT': 3,
    'TOTAL_DISBURSEMENTS': 4
  };

  dataOptionLabels: any = {
    ACTUAL_DISBURSEMENTS: 'Actual disbursements',
    PROJECTED_DISBURSEMENTS: 'Projected disbursements',
    ENVELOPE_AMOUNT: 'Envelope amount',
    TOTAL_DISBURSEMENTS: 'Total disbursements'
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
  };

  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9", "#9b59b6",
        "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#1abc9c", "#e67e22"
      ]
    }
  ];

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
  };

  lineChartOptions: any = {
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
      }]
    }
  };

  // State variables
  selectedOrganizations: any = [];
  selectedSectors: any = [];
  sectorDoughnutData: any = {};
  selectedLocations: any = [];
  
  selectedProjects: any = [];
  selectedDataOptions: any = [];
  sectorIds: any = [];
  subSectorIds: any = [];
  subSubSectorIds: any = [];
  paramOrgIds: any = [];
  paramSectorIds: any = [];
  paramProjectIds: any = [];
  paramLocationIds: any = [];
  paramSubLocationIds: any = [];
  paramMarkerValues: any = [];
  paramMarkerValues2: any = [];
  paramChartType: string = null;
  loadReport: boolean = false;
  isLoading: boolean = true;
  isDataLoading: boolean = true;
  isAnyFilterSet: boolean = false;
  showChart: boolean = true;
  excelFile: string = null;
  datedToday: string = null;
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  selectedCurrencyName: string = null;
  errorMessage: string = null;
  oldCurrencyRate: number = 0;
  oldCurrency: string = null;
  manualExRate: any = 0;
  defaultCurrencyRate: number = 0;
  isDefaultCurrencySet: boolean = true;
  requestNo: number = 0;
  btnReportText: string = 'Update report';

  // Map properties
  projectLocations: any = [];
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  map: any = null;
  markersFeatureGroup: any = null;
  markerClusterGroup: any = null;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private reportService: ReportService,
    private storeService: StoreService,
    private sectorService: SectorService,
    private fyService: FinancialYearService,
    private organizationService: OrganizationService,
    private locationService: LocationService,
    private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private markerService: MarkerService,
    private urlService: UrlHelperService
  ) { }

  ngOnInit() {
   
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.model = this.model || {};
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
          this.model.title = params.title ? params.title : null;
          this.model.startingYear = params.syear ? parseInt(params.syear) : 0;
          this.model.endingYear = params.eyear ? parseInt(params.eyear) : 0;
          this.paramOrgIds = params.orgs ? params.orgs.split(',').map(o => parseInt(o)) : [];
          this.paramSectorIds = params.sectors ? params.sectors.split(',').map(s => parseInt(s)) : [];
          this.paramLocationIds = params.locations ? params.locations.split(',').map(l => parseInt(l)) : [];
          this.paramSubLocationIds = params.slocations ? params.slocations.split(',').map(l => parseInt(l)) : [];
          this.paramProjectIds = params.projects ? params.projects.split(',').map(p => parseInt(p)) : [];
          this.paramChartType = params.ctype ? params.ctype : this.chartTypeCodes.BAR;
          this.model.sectorLevel = params.level ? parseInt(params.level) : this.sectorLevelCodes.SECTORS;
          if (params.mvalue) {
            this.paramMarkerValues = params.mvalue.split(',');
          }
          if (params.mvalue2) {
            this.paramMarkerValues2 = params.mvalue2.split(',');
          }
          if (this.model.sectorLevel) {
            this.manageSectorLevel();
          }
          this.loadReport = true;
        }
      });
    } else {
      this.getOrganisationsReport();
    }

    this.getProjectTitles();
    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getMarkers();

    // Initialize dropdown settings
    this.organizationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
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

    // Default data option
    var dataOption = this.dataOptions.filter(o => o.id == 1);
    if (dataOption.length > 0) {
      this.model.selectedDataOptions.push(dataOption[0]);
      this.selectedDataOptions.push(this.dataOptionsCodes.ACTUAL_DISBURSEMENTS);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.addMarkers();
        }
      }, 100);
    }, 100);
  }

  initMap() {
    if (this.map) {
      return;
    }

    if (!this.mapContainer) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [5.1521, 46.1996], // Somalia
      6
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      crossOrigin: 'anonymous',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.markersFeatureGroup = L.featureGroup();
    this.map.addLayer(this.markersFeatureGroup);

    if ((L as any).markerClusterGroup) {
      this.markerClusterGroup = (L as any).markerClusterGroup();
      this.map.addLayer(this.markerClusterGroup);
    }
  }

  addMarkers() {
    if (!this.map || !this.markersFeatureGroup ||
        !this.projectLocations || this.projectLocations.length === 0) {
      return;
    }

    this.markersFeatureGroup.clearLayers();
    if (this.markerClusterGroup) {
      this.markerClusterGroup.clearLayers();
    }

    this.projectLocations.forEach((loc: any) => {
      try {
        const markerForFeatureGroup = L.marker([loc.latitude, loc.longitude])
          .bindPopup(`<b>${loc.location}</b>`);

        markerForFeatureGroup.on('click', () => {
          this.getLocationWiseProjects(loc);
        });

        this.markersFeatureGroup.addLayer(markerForFeatureGroup);

        if (this.markerClusterGroup) {
          const markerForCluster = L.marker([loc.latitude, loc.longitude])
            .bindPopup(`<b>${loc.location}</b>`);

          markerForCluster.on('click', () => {
            this.getLocationWiseProjects(loc);
          });

          this.markerClusterGroup.addLayer(markerForCluster);
        }
      } catch (error) {
        console.error('Error adding marker:', error, loc);
      }
    });
  }

  getLocationWiseProjects(location: any) {
    if (!this.model.selectedLocations) {
      this.model.selectedLocations = [];
    }
    this.model.selectedLocations.push(location);
    this.getOrganisationsReport();
    this.model.selectedLocations = [];
  }
renderCharts() {
  if (!this.projectsList || !this.organisationsSummary) return;

  this.setupSectorChart();
  this.setupFinancialChart();
} 
  getOrganisationsReport() {
    var currentDate = new Date();
    this.sectorChartLabels = [];
    this.sectorChartData = [];
    this.financialChartData = [];
    this.financialChartLabels = [];
    this.projectLocations = [];
    this.organisationsSummary = [];
    this.organisationProjectsList = [];

    var projectIds = [];
    if (this.model.selectedProjects.length > 0) {
      projectIds = this.model.selectedProjects.map((p: any) => p.id);
    }

    var chartType = this.loadReport ? this.paramChartType : this.model.chartType;

    var searchModel = {
      projectIds: this.loadReport ? this.paramProjectIds : projectIds,
      startingYear: this.model.startingYear ? parseInt(this.model.startingYear.toString()) : 0,
      endingYear: this.model.endingYear ? parseInt(this.model.endingYear.toString()) : 0,
      organizationIds: this.loadReport ? this.paramOrgIds : this.model.selectedOrganizations.map((o: any) => o.id),
      sectorIds: this.loadReport ? this.paramSectorIds : this.model.selectedSectors.map((s: any) => s.id),
      locationId: this.model.locationId ? parseInt(this.model.locationId.toString()) : 0,
      subLocationIds: this.loadReport ? this.paramSubLocationIds : this.model.selectedSubLocations.map((l: any) => l.id),
      chartType: chartType ? parseInt(chartType.toString()) : 1,
      sectorLevel: this.model.sectorLevel ? parseInt(this.model.sectorLevel.toString()) : 0
    };

    this.resetSearchResults();
    this.blockUI.start('Generating report...');

    this.reportService.getOrganizationWiseProjectsReport(searchModel).subscribe(
      data => {
        if (data) {
           console.log("FULL API RESPONSE KEYS:", Object.keys(data));
      console.log("FULL DATA:", JSON.stringify(data).substring(0, 500));
          this.reportDataList = data;
           this.organisationsSummary = data.organizationProjectsList || [];

this.organisationProjectsList = data.organisationProjectsList   
                               || data.organizationProjectsList || [];

this.projectsList = data.projectsList || [];

if (data.sectorChart && data.sectorChart.length > 0) {

  const sectorMap: any = {};

  data.sectorChart.forEach((s: any) => {

    const name = s.sectorName || 'Unknown';

    if (!sectorMap[name]) {
      sectorMap[name] = 0;
    }

    sectorMap[name] += s.projectsCount || 0;
  });

  const labels = Object.keys(sectorMap);
  const values = Object.values(sectorMap);

  this.sectorDoughnutData = {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100",
        "#123ea9", "#9b59b6", "#3498db", "#e74c3c",
        "#2ecc71", "#f39c12", "#1abc9c", "#e67e22"
      ]
    }]
  };

  this.showSectorChart = true;
}
//  if (data.sectorChart && data.sectorChart.length > 0) {
//     this.sectorChartLabels = data.sectorChart.map((s: any) => s.sectorName);
//     this.sectorChartData = data.sectorChart.map((s: any) => s.projectsCount);
//      console.log('Labels:', this.sectorChartLabels);
//   console.log('Data:', this.sectorChartData);
//   }
          this.financialChartLabels = data.financialYears || [];
          this.projectLocations = data.projectLocations || [];
         this.renderCharts();

if (this.projectsList?.length && this.allSectorsList?.length) {
  this.manageDataToDisplay();
}
          // Prepare map markers
          setTimeout(() => {
            if (this.map) {
              this.addMarkers();
            }
          }, 500);

          if (data.reportSettings) {
            this.excelFile = data.reportSettings.excelReportName;
            this.setExcelFile();
          }

          this.btnReportText = 'Update report';
          this.model.selectedCurrency = this.defaultCurrency;
          this.blockUI.stop();

          if (!this.loadReport) {
            this.manageDataToDisplay();
          }

          setTimeout(() => {
            this.selectCurrency();
            this.datedToday = this.storeService.getLongDateString(currentDate);
            if (this.loadReport) {
              this.loadReport = false;
              if (chartType) {
                this.model.chartType = parseInt(chartType.toString());
                this.manageDataToDisplay();
              }
            }
          }, 2000);
        }
      },
      error => {
        this.blockUI.stop();
        this.errorMessage = 'Failed to load report data';
        this.errorModal.openModal();
      }
    );

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    this.manageResetDisplay();
  }

  // setupSectorChart() {
  //   this.sectorChartLabels = [];
  //   this.sectorChartData = [];

  //   if (this.organisationsSummary && this.organisationsSummary.length > 0) {
  //     var sectorMap: any = {};
  //     this.organisationsSummary.forEach((org: any) => {
  //       var sectorName = org.sectorName || 'No sector';
  //       if (!sectorMap[sectorName]) {
  //         sectorMap[sectorName] = 0;
  //       }
  //       sectorMap[sectorName] += org.totalFunding || 0;
  //     });

  //     this.sectorChartLabels = Object.keys(sectorMap);
  //     this.sectorChartData = Object.values(sectorMap);
  //   }
  // }
//   setupSectorChart() {
//   this.sectorChartLabels = [];
//   this.sectorChartData = [];

//   if (!this.projectsList || this.projectsList.length === 0) return;

//   const sectorMap: any = {};

//   this.projectsList.forEach((project: any) => {

//     const sectorName = project.sectorName || 'No Sector';

//     if (!sectorMap[sectorName]) {
//       sectorMap[sectorName] = {
//         count: 0,
//         funding: 0
//       };
//     }

//     // count projects per sector
//     sectorMap[sectorName].count += 1;

//     // OR use funding (optional)
//     sectorMap[sectorName].funding += project.projectCost || 0;
//   });

//   this.sectorChartLabels = Object.keys(sectorMap);

//   // 👉 choose ONE:
//   // Option A: project count
//   this.sectorChartData = Object.values(sectorMap).map((x: any) => x.count);

//   // Option B (if needed instead):
//   // this.sectorChartData = Object.values(sectorMap).map((x: any) => x.funding);
// }

// setupSectorChart() {
//   this.sectorChartLabels = [];
//   this.sectorChartData = [];

//   if (!this.projectsList || this.projectsList.length === 0) return;

//   const sectorMap: any = {};

//   // initialize from real sector list (IMPORTANT FIX)
//   this.allSectorsList.forEach((s: any) => {
//     sectorMap[s.id] = {
//       name: s.sectorName,
//       count: 0,
//       funding: 0
//     };
//   });

//   // group projects
//   this.projectsList.forEach((project: any) => {

//     const sectorId = project.sectorId; // ⚠️ IMPORTANT (not name)

//     if (!sectorMap[sectorId]) {
//       sectorMap[sectorId] = {
//         name: 'Unknown Sector',
//         count: 0,
//         funding: 0
//       };
//     }

//     sectorMap[sectorId].count += 1;
//     sectorMap[sectorId].funding += project.projectCost || 0;
//   });

//   // final arrays (sorted properly)
//   const values = Object.values(sectorMap)
//     .filter((s: any) => s.count > 0); // hide empty

//   this.sectorChartLabels = values.map((x: any) => x.name);

//   // DEFAULT: project count
//   this.sectorChartData = values.map((x: any) => x.count);

//   // If you want funding instead:
//   // this.sectorChartData = values.map((x: any) => x.funding);
// }

// setupSectorChart() {
//   this.sectorChartLabels = [];
//   this.sectorChartData = [];

//   if (!this.projectsList || this.projectsList.length === 0) return;

//   const sectorMap: any = {};

//   this.projectsList.forEach((project: any) => {

//     // ✅ SAFE fallback (important for your system)
//     const sectorId = project.sectorId || project.sector?.id;

//     const sectorName =
//       this.allSectorsList.find((s: any) => s.id === sectorId)?.sectorName
//       || 'No Sector';

//     if (!sectorMap[sectorName]) {
//       sectorMap[sectorName] = 0;
//     }

//     // count projects
//     sectorMap[sectorName] += 1;
//   });

//   this.sectorChartLabels = Object.keys(sectorMap);
//   this.sectorChartData = Object.values(sectorMap);
// }

// setupSectorChart() {
//   this.sectorChartLabels = [];
//   this.sectorChartData = [];

//   if (!this.projectsList || this.projectsList.length === 0) return;

//   const sectorMap: any = {};

//   // STEP 1: SAFE LOOKUP MAP (FAST + RELIABLE)
//   const sectorLookup = new Map<number, string>();

//   (this.allSectorsList || []).forEach((s: any) => {
//     sectorLookup.set(s.id, s.sectorName);
//   });

//   // STEP 2: GROUPING (Sector Report STYLE)
//   this.projectsList.forEach((project: any) => {

//     const sectorId =
//       project.sectorId ??
//       project.sector?.id ??
//       null;

//     const sectorName =
//       sectorLookup.get(sectorId) || 'No Sector';

//     if (!sectorMap[sectorName]) {
//       sectorMap[sectorName] = {
//         count: 0,
//         funding: 0
//       };
//     }

//     sectorMap[sectorName].count += 1;
//     sectorMap[sectorName].funding += project.projectCost || 0;
//   });

//   // STEP 3: FINAL OUTPUT (STABLE ORDER)
//   const result = Object.values(sectorMap);

//   this.sectorChartLabels = Object.keys(sectorMap);

//   // default = count (Sector Report style)
//   this.sectorChartData = result.map((x: any) => x.count);
// }
setupSectorChart() {

  this.sectorChartLabels = [];
  this.sectorChartData = [];

  // 🔥 IMPORTANT GUARD
  if (!this.projectsList || this.projectsList.length === 0) {
    return;
  }

  if (!this.allSectorsList || this.allSectorsList.length === 0) {
    return;
  }

  const sectorMap: any = {};

  const sectorLookup = new Map<number, string>();
  this.allSectorsList.forEach((s: any) => {
    sectorLookup.set(s.id, s.sectorName);
  });

  this.projectsList.forEach((project: any) => {

    const sectorId = project.sectorId ?? project.sector?.id;

    const sectorName = sectorLookup.get(sectorId) || 'No Sector';

    if (!sectorMap[sectorName]) {
      sectorMap[sectorName] = 0;
    }

    sectorMap[sectorName] += 1;
  });

  this.sectorChartLabels = Object.keys(sectorMap);
  this.sectorChartData = Object.values(sectorMap);
}
  // setupFinancialChart() {
  //   this.financialChartData = [];
  //   if (!this.organisationsSummary || this.organisationsSummary.length === 0) return;

  //   var selectedDataOption = parseInt(this.model?.selectedDataOption?.toString()) || 1;
  //   var values = this.organisationsSummary.map((org: any) => {
  //     switch (selectedDataOption) {
  //       case this.dataOptionsCodes.ENVELOPE_AMOUNT:
  //         return org.envelopeAmount || 0;
  //       case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
  //         return org.projectedDisbursements || 0;
  //       case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
  //       default:
  //         return org.actualDisbursements || 0;
  //     }
  //   });

  //   if (this.model?.chartTypeName == this.chartTypes.BAR) {
  //     var label = this.getLabelForDataOption(selectedDataOption);
  //     this.financialChartData = [{ data: values, label: label }];
  //   } else {
  //     this.financialChartData = values;
  //   }
  // }
// setupFinancialChart() {
//   this.financialChartData = [];

//   if (!this.organisationProjectsList || this.organisationProjectsList.length === 0) {
//     return;
//   }

//   // merge all organizations financial charts
//   const chartMap: any = {};

//   this.organisationProjectsList.forEach((org: any) => {

//     if (!org.financialChart) return;

//     org.financialChart.forEach((row: any) => {

//       const year = row.year;

//       if (!chartMap[year]) {
//         chartMap[year] = {
//           envelope: 0,
//           planned: 0,
//           actual: 0
//         };
//       }

//       chartMap[year].envelope += row.envelope || 0;
//       chartMap[year].planned += row.planned || 0;
//       chartMap[year].actual += row.actual || 0;
//     });

//   });

//   const sortedYears = Object.keys(chartMap).sort();

//   this.financialChartLabels = sortedYears;

//   const selected = parseInt(this.model?.selectedDataOption?.toString()) || 1;

//   const values = sortedYears.map((year: any) => {

//     const data = chartMap[year];

//     switch (selected) {
//       case this.dataOptionsCodes.ENVELOPE_AMOUNT:
//         return data.envelope;
//       case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
//         return data.planned;
//       case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
//       default:
//         return data.actual;
//     }
//   });

//   if (this.model?.chartTypeName == this.chartTypes.BAR) {
//     this.financialChartData = [
//       {
//         data: values,
//         label: this.getLabelForDataOption(selected)
//       }
//     ];
//   } else {
//     this.financialChartData = values;
//   }
// }

// setupFinancialChart() {
//   console.log('org summary:', this.organisationsSummary);
// console.log('selected option:', this.model?.selectedDataOption);
//   this.financialChartData = [];

//   if (!this.organisationsSummary || this.organisationsSummary.length === 0) {
//     return;
//   }

//   const chartMap: any = {};

//   this.organisationsSummary.forEach((org: any) => {

//     const name = org.organizationName || 'Unknown';

//     if (!chartMap[name]) {
//       chartMap[name] = {
//         envelope: 0,
//         planned: 0,
//         actual: 0
//       };
//     }

//     chartMap[name].envelope += org.envelopeAmount || 0;
//     chartMap[name].planned += org.projectedDisbursements || 0;
//     chartMap[name].actual += org.actualDisbursements || 0;
//   });

//   const labels = Object.keys(chartMap);

//   this.financialChartLabels = labels;

//   const selected = parseInt(this.model?.selectedDataOption?.toString()) || 1;

//   const values = labels.map(l => {
//     const d = chartMap[l];

//     switch (selected) {
//       case this.dataOptionsCodes.ENVELOPE_AMOUNT:
//         return d.envelope;
//       case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
//         return d.planned;
//       default:
//         return d.actual;
//     }
//   });

//   this.financialChartData =
//     this.model?.chartTypeName === this.chartTypes.BAR
//       ? [{ data: values, label: this.getLabelForDataOption(selected) }]
//       : values;
// }

// setupFinancialChart() {
//   this.financialChartLabels = [];
//   this.financialChartData = [];

//   // organisationsSummary use karo — yeh reliably populated hai
//   if (!this.organisationsSummary?.length) return;

//   const selected = parseInt(this.model?.selectedDataOption?.toString()) || 1;

//   const labels = this.organisationsSummary.map((org: any) =>
//     org.organizationName || org.orgName || 'Unknown'
//   );

//   const values = this.organisationsSummary.map((org: any) => {
//     switch (selected) {
//       case this.dataOptionsCodes.ENVELOPE_AMOUNT:
//         return org.envelopeAmount || 0;
//       case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
//         return org.projectedDisbursements || 0;
//       case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
//       default:
//         return org.actualDisbursements || 0;
//     }
//   });

//   this.financialChartLabels = labels;
//   this.financialChartData = [
//     {
//       data: values,
//       label: this.getLabelForDataOption(selected),
//       backgroundColor: this.chartColors[0].backgroundColor
//     }
//   ];
// }
setupFinancialChart() {
  this.financialChartLabels = [];
  this.financialChartData = [];

  if (!this.organisationsSummary?.length) return;

  const selected = parseInt(this.model?.selectedDataOption?.toString()) || 1;

  // ✅ API ke actual field names use karo
  const labels = this.organisationsSummary.map((org: any) =>
    org.organizationName || 'Unknown'
  );

  const values = this.organisationsSummary.map((org: any) => {
    switch (selected) {
      case this.dataOptionsCodes.ENVELOPE_AMOUNT:
        return org.totalFunding || 0;          // API mein envelopeAmount nahi, totalFunding hai
      case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
        return org.plannedDisbursements || 0;
      case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
      default:
        return org.actualDisbursements || 0;
    }
  });

  this.financialChartLabels = labels;
  this.financialChartData = [{
    data: values,
    label: this.getLabelForDataOption(selected),
    backgroundColor: [
      "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100",
      "#123ea9", "#9b59b6", "#3498db", "#e74c3c",
      "#2ecc71", "#f39c12", "#1abc9c", "#e67e22"
    ]
  }];
}
  manageDataToDisplay() {
     console.log("=== manageDataToDisplay called ===");
  console.log("organisationsSummary length:", this.organisationsSummary?.length);
  console.log("chartTypeName:", this.model.chartTypeName);
  console.log("chartType:", this.model.chartType);
    this.setupSectorChart();

    var chartType = this.loadReport ? this.paramChartType : this.model.chartType;
    var tChartType = this.chartOptions.filter((c: any) => c.id == chartType);
    if (tChartType.length > 0) {
      this.model.chartTypeName = tChartType[0].type;
    }

    if (chartType == this.chartTypeCodes.STACKEDBAR) {
      this.setupStackedFinancialChart();
    } else if (chartType == this.chartTypeCodes.LINE) {
      this.setupLineFinancialChart();
    } else {
      this.setupFinancialChart();
    }
  }

  getLabelForDataOption(optionId: number): string {
    switch (optionId) {
      case this.dataOptionsCodes.ENVELOPE_AMOUNT:
        return this.dataOptionLabels.ENVELOPE_AMOUNT;
      case this.dataOptionsCodes.PROJECTED_DISBURSEMENTS:
        return this.dataOptionLabels.PROJECTED_DISBURSEMENTS;
      case this.dataOptionsCodes.ACTUAL_DISBURSEMENTS:
      default:
        return this.dataOptionLabels.ACTUAL_DISBURSEMENTS;
    }
  }


setupStackedFinancialChart() {
  this.financialChartData = [];
  if (!this.organisationsSummary?.length) return;

  this.financialChartLabels = this.organisationsSummary.map(
    (org: any) => org.organizationName || 'Unknown'
  );

  const actualData = this.organisationsSummary.map((org: any) => org.actualDisbursements || 0);
  const projectedData = this.organisationsSummary.map((org: any) => org.plannedDisbursements || 0);
  const envelopeData = this.organisationsSummary.map((org: any) => org.totalFunding || 0);

  this.financialChartData = [
    { data: envelopeData, label: 'Total funding', stack: 'Stack 0' },
    { data: projectedData, label: 'Planned disbursements', stack: 'Stack 0' },
    { data: actualData, label: 'Actual disbursements', stack: 'Stack 0' }
  ];
}

setupLineFinancialChart() {
  this.financialChartData = [];
  if (!this.organisationsSummary?.length) return;

  this.financialChartLabels = this.organisationsSummary.map(
    (org: any) => org.organizationName || 'Unknown'
  );

  const actualData = this.organisationsSummary.map((org: any) => org.actualDisbursements || 0);
  const projectedData = this.organisationsSummary.map((org: any) => org.plannedDisbursements || 0);
  const envelopeData = this.organisationsSummary.map((org: any) => org.totalFunding || 0);

  this.financialChartData = [
    { data: envelopeData, label: 'Total funding' },
    { data: projectedData, label: 'Planned disbursements' },
    { data: actualData, label: 'Actual disbursements' }
  ];
}

  // setupStackedFinancialChart() {
  //   this.financialChartData = [];
  //   if (!this.organisationsSummary || this.organisationsSummary.length === 0) return;

  //   var actualData = [];
  //   var projectedData = [];
  //   var envelopeData = [];

  //   this.organisationsSummary.forEach((org: any) => {
  //     actualData.push(org.actualDisbursements || 0);
  //     projectedData.push(org.projectedDisbursements || 0);
  //     envelopeData.push(org.envelopeAmount || 0);
  //   });

  //   this.financialChartData.push({ data: envelopeData, label: 'Envelope amount', stack: 'Stack 0' });
  //   this.financialChartData.push({ data: projectedData, label: 'Projected disbursements', stack: 'Stack 0' });
  //   this.financialChartData.push({ data: actualData, label: 'Actual disbursements', stack: 'Stack 0' });
  // }

  // setupLineFinancialChart() {
  //   this.financialChartData = [];
  //   if (!this.organisationsSummary || this.organisationsSummary.length === 0) return;

  //   var actualData = [];
  //   var projectedData = [];
  //   var envelopeData = [];

  //   this.organisationsSummary.forEach((org: any) => {
  //     envelopeData.push(org.envelopeAmount || 0);
  //     projectedData.push(org.projectedDisbursements || 0);
  //     actualData.push(org.actualDisbursements || 0);
  //   });

  //   this.financialChartData.push({ data: envelopeData, label: 'Envelope amount' });
  //   this.financialChartData.push({ data: projectedData, label: 'Projected disbursements' });
  //   this.financialChartData.push({ data: actualData, label: 'Actual disbursements' });
  // }

  // Data fetch methods
  getProjectTitles() {
    this.projectService.getProjectTitles().subscribe(
      data => {
        if (data) {
          this.projects = data;
          if (this.loadReport && this.paramProjectIds.length > 0) {
            this.paramProjectIds.forEach((id: number) => {
              var project = this.projects.filter((p: any) => p.id == id);
              if (project.length > 0) {
                this.model.selectedProjects.push(project[0]);
              }
            });
          }
        }
      }
    );
  }

  getSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        if (data) {
          this.allSectorsList = data;
          var sectorsList = data.filter((s: any) => s.parentSectorId == 0);
          this.sectorsList = sectorsList;
          var sectorIds = sectorsList.map((s: any) => s.id);
          var subSectorsList = data.filter((s: any) => sectorIds.includes(s.parentSectorId));
          this.subSectorIds = subSectorsList.map((s: any) => s.id);
          var subSubSectors = data.filter((s: any) => this.subSectorIds.includes(s.parentSectorId));
          this.subSubSectorIds = subSubSectors.map((s: any) => s.id);

          if (this.subSubSectorIds.length > 0) {
            this.sectorLevels.push({ id: 3, level: 'Sub-sub sectors' });
            this.sectorLevels.sort((s: any) => s.id);
          }

          if (this.loadReport && this.paramSectorIds.length > 0) {
            var sectorId = parseInt(this.paramSectorIds[0].toString());
            if (sectorIds.includes(sectorId)) {
              this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
            } else if (this.subSectorIds.includes(sectorId)) {
              this.model.sectorLevel = this.sectorLevelCodes.SUB_SECTORS;
            } else if (this.subSubSectorIds.includes(sectorId)) {
              this.model.sectorLevel = this.sectorLevelCodes.SUB_SUB_SECTORS;
            }
            this.manageSectorLevel();
            this.paramSectorIds.forEach((id: number) => {
              var sector = this.allSectorsList.filter((s: any) => s.id == id);
              if (sector.length > 0) {
                this.model.selectedSectors.push(sector[0]);
              }
            });
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
          if (this.loadReport && this.paramSubLocationIds.length > 0) {
            this.paramSubLocationIds.forEach((id: number) => {
              var subLocation = this.subLocationsList.filter((s: any) => s.id == id);
              if (subLocation.length > 0) {
                this.model.selectedSubLocations.push(subLocation[0]);
              }
            });
          }
        }
      }
    );
  }
loadProjectLocations(): void {

  this.projectLocations = [];

  // clear existing markers
  if (this.markersFeatureGroup) {
    this.markersFeatureGroup.clearLayers();
  }

  if (this.markerClusterGroup) {
    this.markerClusterGroup.clearLayers();
  }

  // no project selected
  if (!this.model.selectedProjects ||
      this.model.selectedProjects.length === 0) {
    return;
  }

  const requests = this.model.selectedProjects.map((project: any) =>
    this.projectService.getProjectLocations(project.id)
  );

  forkJoin(requests).subscribe({

    next: (responses: any[]) => {

      responses.forEach((locations: any) => {

        if (locations && locations.length > 0) {
          this.projectLocations.push(...locations);
        }

      });

      // add markers on map
      this.addMarkers();

      // fit bounds
      if (this.projectLocations.length > 0 && this.map) {

        const bounds = L.latLngBounds(
          this.projectLocations.map((loc: any) => [
            loc.latitude,
            loc.longitude
          ])
        );

       this.map.fitBounds(bounds, {
  padding: [50, 50],
  maxZoom: 8   // 👈 IMPORTANT FIX
});
      }
    },

    error: (err) => {
      console.error('Error loading project locations', err);
    }

  });
}
  filterSubLocations() {
    var locationIds = this.model?.selectedLocations?.map((l: any) => l.id) || [];
    this.model.filteredSubLocationsList = [];
    this.model.selectedSubLocations = [];

    if (locationIds.length == 0) {
      this.filteredSubLocationsList = this.subLocationsList ? [...this.subLocationsList] : [];
    } else {
      this.filteredSubLocationsList = (this.subLocationsList || []).filter((s: any) => locationIds.includes(s.locationId));
    }
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
        if (this.loadReport && this.paramOrgIds.length > 0) {
          this.paramOrgIds.forEach((id: number) => {
            var org = this.organizationsList.filter((o: any) => o.id == id);
            if (org.length > 0) {
              this.model.selectedOrganizations.push(org[0]);
            }
          });
        }
      }
    );
  }

  loadFinancialYears() {
    this.fyService.getYearsList().subscribe(
      data => {
        this.yearsList = data;
      }
    );
  }

  getMarkers() {
    this.markerService.getMarkers().subscribe(
      data => {
        if (data) {
          this.markersList = data;
          if (this.model.markerId && this.paramMarkerValues.length > 0) {
            this.getSelectedMarkerValues(this.paramMarkerValues);
          }
          if (this.model.markerId2 && this.paramMarkerValues2.length > 0) {
            this.getSelectedMarkerValuesTwo(this.paramMarkerValues2);
          }
        }
      }
    );
  }

  getSelectedMarkerValues(selectedValues: any = []) {
    this.markerValues = [];
    this.model.markerValues = [];
    if (this.model.markerId) {
      var values = this.markersList.filter((m: any) => m.id == this.model.markerId).map(m => m.values);
      if (values && values.length > 0) {
        this.markerValues = JSON.parse(values);
        if (selectedValues.length > 0) {
          this.model.markerValues = this.markerValues.filter((m: any) => selectedValues.includes(m.value));
        }
      }
    }
  }

  getSelectedMarkerValuesTwo(selectedValues: any = []) {
    this.markerValues = [];
    this.model.markerValues2 = [];
    if (this.model.markerId2) {
      var values = this.markersList.filter((m: any) => m.id == this.model.markerId2).map(m => m.values);
      if (values && values.length > 0) {
        this.markerValues = JSON.parse(values);
        if (selectedValues.length > 0) {
          this.model.markerValues2 = this.markerValues.filter((m: any) => selectedValues.includes(m.value));
        }
      }
    }
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    var model = { dated: dated };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        if (data) {
          this.exchangeRates = data;
          var nationalCurrencyRate = this.exchangeRates.filter((c: any) => c.currency == this.nationalCurrencyName);
          if (nationalCurrencyRate.length > 0) {
            this.manualExRate = nationalCurrencyRate[0].rate;
            this.oldCurrencyRate = 1;
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
            this.getOrganisationsReport();
          }
        }, 3000);
      }
    );
  }

  // Filter handlers
  // onOrganizationSelect(item: any) {
  //   this.setFilter();
  // }

  // onOrganizationDeSelect(item: any) {
  //   if (this.model.selectedOrganizations.length == 0) {
  //     this.manageResetDisplay();
  //   } else {
  //     this.setFilter();
  //   }
  // }

  // onOrganizationSelectAll(items: any) {
  //   this.setFilter();
  // }

  // onOrganizationDeSelectAll(items: any) {
  //   this.model.selectedOrganizations = [];
  //   this.manageResetDisplay();
  // }

  onSectorSelect(item: any) {
    this.setFilter();
  }

  onSectorDeSelect(item: any) {
    if (this.model.selectedSectors.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onSectorSelectAll(items: any) {
    this.setFilter();
  }

  onSectorDeSelectAll(items: any) {
    this.model.selectedSectors = [];
    this.manageResetDisplay();
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

  changeLocation() {
    if (this.model.locationId != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
    this.model.selectedSubLocations = [];
    this.filterSubLocations();
  }

  onSubLocationSelect(item: any) {
    this.setFilter();
  }

  onSubLocationDeSelect(item: any) {
    if (this.model.selectedSubLocations.length == 0) {
      this.manageResetDisplay();
    }
  }

  onSubLocationSelectAll(items: any) {
    this.setFilter();
  }

  onSubLocationDeSelectAll(items: any) {
    this.model.selectedSubLocations = [];
    this.manageResetDisplay();
  }

  manageSectorLevel() {
    this.model.selectedSectors = [];
    if (this.model.sectorLevel) {
      var level = parseInt(this.model.sectorLevel.toString());
      switch (level) {
        case this.sectorLevelCodes.SECTORS:
          this.sectorsList = this.allSectorsList.filter((s: any) => s.parentSectorId == 0);
          break;
        case this.sectorLevelCodes.SUB_SECTORS:
          this.sectorsList = this.allSectorsList.filter((s: any) => this.subSectorIds.includes(s.id));
          break;
        case this.sectorLevelCodes.SUB_SUB_SECTORS:
          this.sectorsList = this.allSectorsList.filter((s: any) => this.subSubSectorIds.includes(s.id));
          break;
        default:
          this.sectorsList = this.allSectorsList.filter((s: any) => s.parentSectorId == 0);
          break;
      }
    }
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  manageResetDisplay() {
    if (
      (this.model?.selectedProjects?.length || 0) == 0 &&
      (this.model?.startingYear || 0) == 0 &&
      (this.model?.endingYear || 0) == 0 &&
      (this.model?.selectedSectors?.length || 0) == 0 &&
      (this.model?.selectedOrganizations?.length || 0) == 0 &&
      (this.model?.selectedLocations?.length || 0) == 0 &&
      (this.model?.selectedSubLocations?.length || 0) == 0 &&
      (this.model?.selectedCurrency || '') == (this.defaultCurrency || '')
    ) {
      this.isAnyFilterSet = false;
    } else {
      this.isAnyFilterSet = true;
    }
  }

  resetFilters() {
    this.model.selectedProjects = [];
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.model.selectedSectors = [];
    this.model.selectedOrganizations = [];
    this.model.selectedLocations = [];
    this.model.selectedSubLocations = [];
    this.model.sectorLevel = this.sectorLevelCodes.SECTORS;
    this.model.locationId = 0;
    this.filteredSubLocationsList = this.subLocationsList || [];
    this.isAnyFilterSet = false;
  }

  resetSearchResults() {
    this.sectorChartData = [];
    this.sectorChartLabels = [];
    this.financialChartData = [];
    this.financialChartLabels = [];
    this.organisationsSummary = [];
    this.organisationProjectsList = [];
    this.projectsList = [];
    this.projectLocations = [];
  }

  // Currency handling
  selectCurrency() {
    if (this.model.selectedCurrency == null || this.model.selectedCurrency == 'null') {
      return false;
    } else {
      var selectedCurrency = this.currenciesList.filter((c: any) => c.currency == this.model.selectedCurrency);
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
    if (this.organisationsSummary) {
      this.organisationsSummary.forEach((org: any) => {
        org.envelopeAmount = Math.round((org.envelopeAmount || 0) * calculatedRate);
        org.projectedDisbursements = Math.round((org.projectedDisbursements || 0) * calculatedRate);
        org.actualDisbursements = Math.round((org.actualDisbursements || 0) * calculatedRate);
        org.totalFunding = Math.round((org.totalFunding || 0) * calculatedRate);
      });
    }

    if (this.projectsList) {
      this.projectsList.forEach((project: any) => {
        project.projectCost = Math.round((project.projectCost || 0) * calculatedRate);
        project.actualDisbursements = Math.round((project.actualDisbursements || 0) * calculatedRate);
        project.plannedDisbursements = Math.round((project.plannedDisbursements || 0) * calculatedRate);
      });
    }

    this.setupSectorChart();
    this.setupFinancialChart();
    this.showChart = false;
    setTimeout(() => {
      this.showChart = true;
    }, 1000);
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.urlService.getExcelFilesUrl() + this.excelFile;
    }
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-organisations-pdf-view'));
      result.then(() => {
        this.blockUI.stop();
      });
    }, 500);
  }

  printReport() {
    this.storeService.printReport('rpt-organisations-project', 'Organisations report', this.selectedCurrencyName);
  }

  public chartClicked(e: any): void { }

  public chartHovered(e: any): void { }

  displayHideRow(orgId: number) {
    var org = this.organisationProjectsList.filter((o: any) => o.organizationId == orgId);
    if (org.length > 0) {
      org[0].isDisplay = !org[0].isDisplay;
    }
  }

  formatFunders(funders: any = null): string {
    var fundersStr = '';
    if (funders && funders.length > 0) {
      var funderNames = funders.map((f: any) => f.funder);
      fundersStr = funderNames.join(', ');
    }
    return fundersStr;
  }

  formatImplementers(implementers: any = null): string {
    var implementersStr = '';
    if (implementers && implementers.length > 0) {
      var implementerNames = implementers.map((i: any) => i.implementer);
      implementersStr = implementerNames.join(', ');
    }
    return implementersStr;
  }

  formatNumber(value: number): string {
    return String(this.storeService.getNumberWithCommas(value));
  }

  getTodaysDate(): string {
    return this.storeService.getLongDateAndTime();
  }

  getGrandTotalActualDisbursement(): number {
    var total = 0;
    if (this.organisationProjectsList && Array.isArray(this.organisationProjectsList) && this.organisationProjectsList.length > 0) {
      this.organisationProjectsList.forEach((org: any) => {
        total += org?.actualDisbursements || 0;
      });
    }
    return total;
  }

  getGrandTotalPlannedDisbursement(): number {
    var total = 0;
    if (this.organisationProjectsList && Array.isArray(this.organisationProjectsList) && this.organisationProjectsList.length > 0) {
      this.organisationProjectsList.forEach((org: any) => {
        total += org?.plannedDisbursements || 0;
      });
    }
    return total;
  }

  getOrganizationNames(): string[] {
    if (this.organisationsSummary && this.isArray(this.organisationsSummary)) {
      return this.organisationsSummary.map((o: any) => o?.organizationName || '');
    }
    return [];
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  onProjectSelect(item: any) {
    this.setFilter();
  this.loadProjectLocations();
  }

  onProjectSelectAll(items: any) {
    this.setFilter();
    this.loadProjectLocations();
  }

  onProjectDeSelect(item: any) {
    if (this.model.selectedProjects.length == 0) {

    this.projectLocations = [];

    if (this.markersFeatureGroup) {
      this.markersFeatureGroup.clearLayers();
    }

    if (this.markerClusterGroup) {
      this.markerClusterGroup.clearLayers();
    }

    this.manageResetDisplay();

  } else {

    this.setFilter();
    this.loadProjectLocations();

  }
  }

  onProjectDeSelectAll(items: any) {
   this.model.selectedProjects = [];
  this.projectLocations = [];

  if (this.markersFeatureGroup) {
    this.markersFeatureGroup.clearLayers();
  }

  if (this.markerClusterGroup) {
    this.markerClusterGroup.clearLayers();
  }

  this.manageResetDisplay();
  }

  ngOnDestroy() {
    // Clean up map if it exists
    if (this.map) {
      this.map.remove();
    }
  }
}