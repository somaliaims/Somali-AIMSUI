import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { LocationService } from 'src/app/services/location.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { CurrencyService } from 'src/app/services/currency.service';
import { Messages } from 'src/app/config/messages';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';

@Component({
  selector: 'location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.css']
})
export class LocationReportComponent implements OnInit {
  locationsSettings: any = [];
  selectedLocations: any = [];
  selectedOrganizations: any = [];
  organizationsSettings: any = {};
  dataOptionSettings: any = {};
  yearsList: any = [];
  locationsList: any = [];
  subLocationsList: any = [];
  organizationsList: any = [];
  currenciesList: any = [];
  exchangeRatesList: any = [];
  manualExchangeRatesList: any = [];
  selectedDataOptions: any = [];
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  selectedCurrencyName: string = null;
  errorMessage: string = null;
  oldCurrencyRate: number = 0;
  showChart: boolean = true;
  excelFile: string = null;
  manualExRate: any = 0;
  oldCurrency: string = null;
  defaultCurrencyRate: number = 0;

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 4, type: 'doughnut', title: 'Doughnut chart' },
    { id: 5, type: 'radar', title: 'Radar chart' }
  ];

  exRateSourceCodes: any = {
    'OPEN_EXCHANGE': 1,
    'AFRICAN_BANK': 2
  };

  exRateSources: any = [
    { id: 1, value: 'Open exchange api' },
    { id: 2, value: 'African bank' }
  ];

  dataOptions: any = [
    { id: 1, type: 'funding', value: 'No. of Projects' },
    { id: 2, type: 'funding', value: 'Funding' },
    { id: 3, type: 'disbursements', value: 'Disbursements' }
  ];

  dataOptionsCodes: any = {
    'PROJECTS': 1,
    'FUNDING': 2,
    'DISBURSEMENTS': 3
  };

  dataOptionLabels: any = {
    PROJECTS: 'Projects',
    FUNDING: 'Funding',
    DISBURSEMENTS: 'Disbursements'
  };

  reportDataList: any = [];
  dropdownSettings: any = {};
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        beginAtZero: true,
        ticks: {
          autoSkip: false
        }
      }],
    }
  };
  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  barChartLabels: string[] = [];
  barChartType: string = 'bar';
  barChartLegend: boolean = true;
  barChartData: any[] = [
  ];
  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0, chartType: 'bar',
    locationIds: [], selectedLocations: [], selectedOrganizations: [], selectedDataOptions: [],
    locationsList: [], organizationsList: [], selectedCurrency: null, exRateSource: null
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private currencyService: CurrencyService,
    private errorModal: ErrorModalComponent
  ) { }

  ngOnInit() {

    this.getLocationsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getExchangeRates();
    this.getManualExchangeRateForToday();

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'locationName',
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

  getExchangeRates() {
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data) {
          this.exchangeRatesList = data.rates;

          if (this.defaultCurrency && this.exchangeRatesList.length > 0) {
            var exRate = this.exchangeRatesList.filter(c => c.currency == this.defaultCurrency);
            if (exRate.length > 0) {
              this.oldCurrencyRate = exRate[0].rate;
              this.defaultCurrency = exRate[0].currency;
              this.oldCurrency = this.defaultCurrency;
              this.oldCurrencyRate = this.oldCurrencyRate;
            }
          }
        }
      }
    );
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    this.currencyService.getManualExRatesByDate(dated).subscribe(
      data => {
        if (data) {
          if (data.exchangeRate) {
            this.manualExchangeRatesList = data.exchangeRate;
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

  searchProjectsByCriteriaReport() {
    this.barChartLabels = [];
    this.barChartData = [];
    var searchModel = {
      title: this.model.title,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      locationIds: this.selectedLocations,
    };

    this.resetSearchResults();
    this.blockUI.start('Preparing report...');
    this.reportService.getLocationWiseProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.locationProjectsList) {
          var locationNames = this.reportDataList.locationProjectsList.map(p => p.locationName);
          this.barChartLabels = locationNames;
          if (this.reportDataList.reportSettings) {
            this.excelFile = this.reportDataList.reportSettings.excelReportName;
            this.setExcelFile();
          }
          this.manageDataOptions();
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  resetSearchResults() {
    this.barChartData = [];
    this.barChartLabels = [];
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
    var quotes = document.getElementById('rpt-location-project');
    html2canvas(quotes)
      .then((canvas) => {
        var pdf = new jsPDF('p', 'pt', 'letter');
        var container = document.querySelector(".row");
        var docWidth = container.getBoundingClientRect().width;
        for (var i = 0; i <= quotes.clientHeight / 980; i++) {
          var srcImg = canvas;
          var sX = 0;
          var sY = 980 * i; // start 980 pixels down for every new page
          var sWidth = docWidth;
          var sHeight = 980;
          var dX = 0;
          var dY = 0;
          var dWidth = docWidth;
          var dHeight = 980;

          var onePageCanvas = document.createElement("canvas");
          onePageCanvas.setAttribute('width', docWidth.toString());
          onePageCanvas.setAttribute('height', '980');
          var ctx = onePageCanvas.getContext('2d');
          ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

          var width = onePageCanvas.width;
          var height = onePageCanvas.clientHeight;

          if (i > 0) {
            pdf.addPage([612, 791]); //8.5" x 11" in pts (in*72)
          }
          pdf.setPage(i + 1);
          pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .44), (height * .62));
        }
        pdf.save('Test.pdf');
      });
  }

  printReport() {
    this.storeService.printReport('rpt-location-project', 'LocationWise Projects List');
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  onLocationSelect(item: any) {
    var id = item.id;
    if (this.selectedLocations.indexOf(id) == -1) {
      this.selectedLocations.push(id);
    }
  }

  onLocationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedLocations.indexOf(id);
    this.selectedLocations.splice(index, 1);

    this.searchProjectsByCriteriaReport();
  }

  onLocationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedLocations.indexOf(id) == -1) {
        this.selectedLocations.push(id);
      }
    }.bind(this))
  }

  onOrganizationSelect(item: any) {
    var id = item.id;
    if (this.selectedOrganizations.indexOf(id) == -1) {
      this.selectedOrganizations.push(id);
    }
  }

  onOrganizationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedOrganizations.indexOf(id);
    this.selectedOrganizations.splice(index, 1);

    this.searchProjectsByCriteriaReport();
  }

  onOrganizationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedOrganizations.indexOf(id) == -1) {
        this.selectedOrganizations.push(id);
      }
    }.bind(this));
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
    if (!this.model.selectedCurrency) {
      this.selectedCurrencyName = 'Default';
    } else {
      var selectedCurrency = this.currenciesList.filter(c => c.currency == this.model.selectedCurrency);
      if (selectedCurrency.length > 0) {
        this.selectedCurrencyName = selectedCurrency[0].currencyName;
      }
    }
    if (this.model.selectedCurrency && this.model.exRateSource) {
      this.getCurrencyRates(this.model.exRateSource);
    }
  }

  selectExRateSource() {
    if (this.model.exRateSource && this.model.selectedCurrency) {
      this.getCurrencyRates(this.model.exRateSource);
    }
  }

  getCurrencyRates(eSource: string) {
    var exRate: any = [];
    if (eSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
      var calculatedRate = 0;
      exRate = this.exchangeRatesList.filter(c => c.currency == this.model.selectedCurrency);
      if (exRate.length > 0) {
        if (this.oldCurrencyRate == 0) {
          calculatedRate = exRate[0].rate;
        } else {
          calculatedRate = (exRate[0].rate / this.oldCurrencyRate);
          this.oldCurrencyRate = exRate[0].rate;
        }
      }
    } else if (eSource == this.exRateSourceCodes.AFRICAN_BANK) {
      if (this.manualExRate == 0) {
        this.errorMessage = Messages.EX_RATE_NOT_FOUND;
        this.errorModal.openModal();
        return false;
      }

      var manualRate = this.manualExRate;
      if (this.model.selectedCurrency == this.defaultCurrency) {
        manualRate = this.defaultCurrencyRate;
      }

      if (this.oldCurrency == this.defaultCurrency && this.oldCurrency == this.model.selectedCurrency) {
        calculatedRate = this.oldCurrencyRate;
      } else {
        if (this.oldCurrencyRate == 0) {
          calculatedRate = manualRate;
        } else {
          calculatedRate = (manualRate / this.oldCurrencyRate);
          this.oldCurrencyRate = manualRate;
        }
      }
      this.oldCurrency = this.model.selectedCurrency;
    }

    if (calculatedRate > 0 && calculatedRate != 1) {
      this.applyRateOnFinancials(calculatedRate);
    }
  }

  applyRateOnFinancials(calculatedRate: number) {
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (location) {
        location.totalFunding = Math.round(parseFloat(((location.totalFunding * calculatedRate).toFixed(2))));
        location.totalDisbursements = Math.round(parseFloat(((location.totalDisbursements * calculatedRate).toFixed(2))));

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
    }
  }

  manageDataOptions() {
    if (this.selectedDataOptions.length > 0 && this.reportDataList.locationProjectsList) {
      this.showChart = false;

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.PROJECTS) != -1) {
        var isDataExists = this.barChartData.filter(d => d.label == this.dataOptionLabels.PROJECTS);
        if (isDataExists.length == 0) {
          var sectorProjects = this.reportDataList.locationProjectsList.map(p => p.projects.length);
          var chartData = { data: sectorProjects, label: this.dataOptionLabels.PROJECTS };
          this.barChartData.push(chartData);
        }
      } else {
        this.barChartData = this.barChartData.filter(d => d.label != this.dataOptionLabels.PROJECTS);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.FUNDING) != -1) {
        var isDataExists = this.barChartData.filter(d => d.label == this.dataOptionLabels.FUNDING);
        if (isDataExists.length == 0) {
          var sectorFunding = this.reportDataList.locationProjectsList.map(p => p.totalFunding);
          var chartData = { data: sectorFunding, label: this.dataOptionLabels.FUNDING };
          this.barChartData.push(chartData);
        }
      } else {
        this.barChartData = this.barChartData.filter(d => d.label != this.dataOptionLabels.FUNDING);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.DISBURSEMENTS) != -1) {
        var isDataExists = this.barChartData.filter(d => d.label == this.dataOptionLabels.DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var sectorDisbursements = this.reportDataList.locationProjectsList.map(p => p.totalDisbursements);
          var chartData = { data: sectorDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
          this.barChartData.push(chartData);
        }
      } else {
        this.barChartData = this.barChartData.filter(d => d.label != this.dataOptionLabels.DISBURSEMENTS);
      }

      if (this.selectedDataOptions.length > 0) {
        setTimeout(() => {
          this.showChart = true;
        }, 1000);
      }
    }

    if (this.selectedDataOptions.length == 0 && this.barChartData.length > 0) {
      this.barChartData = [];
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

}
