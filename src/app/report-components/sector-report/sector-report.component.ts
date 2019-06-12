import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { SectorService } from 'src/app/services/sector.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import { LocationService } from 'src/app/services/location.service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { CurrencyService } from 'src/app/services/currency.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';


@Component({
  selector: 'sector-report',
  templateUrl: './sector-report.component.html',
  styleUrls: ['./sector-report.component.css']
})
export class SectorReportComponent implements OnInit {
  sectorsSettings: any = [];
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  selectedDataOptions: any = [];
  selectedChartType: number = 1;
  organizationsSettings: any = {};
  dataOptionSettings: any = {};
  locationsSettings: any = {};
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
  manualExRate: any = 0;
  defaultCurrency: string = null;
  defaultCurrencyRate: number = 0;
  nationalCurrency: string = null;
  selectedCurrencyName: string = null;
  errorMessage: string = null;
  showChart: boolean = true;
  excelFile: string = null;
  chartCategory: number = 1;
  multiDataDisplay: boolean = true;

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

  dataOptions: any = [
    { id: 1, type: 'projects', value: 'Number of Projects' },
    { id: 2, type: 'funding', value: 'Funding' },
    { id: 3, type: 'disbursements', value: 'Disbursements' }
  ];

  dataOptionsIndexForDoughnut: any = {
    1: 0,
    2: 1,
    3: 2
  };

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
  }

  radarChartOptions: any = {
    responsive: true
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
    selectedDataOption: 1
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private locationService: LocationService,
    private currencyService: CurrencyService, private errorModal: ErrorModalComponent
  ) { }

  ngOnInit() {

    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();
    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getManualExchangeRateForToday();

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
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

    var dataOption = this.dataOptions.filter(o => o.id == 1);
    if (dataOption.length > 0) {
      this.model.selectedDataOptions.push(dataOption[0]);
      this.selectedDataOptions.push(this.dataOptionsCodes.PROJECTS);
    }
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    this.currencyService.getManualExRatesByDate(dated).subscribe(
      data => {
        if (data) {
          if (data.exchangeRate) {
            this.manualExRate = data.exchangeRate;
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
          this.currenciesList.push(data);
        }
      }
    );
  }

  searchProjectsByCriteriaReport() {
    this.chartLables = [];
    this.chartData = [];
    var searchModel = {
      title: this.model.title,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
    };

    this.resetSearchResults();
    this.blockUI.start('Searching Projects...');
    this.reportService.getSectorWiseProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          this.chartLables = sectorNames;
          if (this.reportDataList.reportSettings) {
            this.excelFile = this.reportDataList.reportSettings.excelReportName;
            this.setExcelFile();
          }

          if (this.multiDataDisplay) {
            this.manageDataOptions();
          } else {
            this.manageChartTypeDisplay();
          }
          this.model.selectedCurrency = this.defaultCurrency;
          this.selectCurrency();
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

  /*generatePDF() {
    html2canvas(document.getElementById('rpt-sector-project')).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var doc = new jsPDF();
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();
      doc.addImage(img, 'JPEG', 0, 0, width, height);
      doc.save('testCanvas.pdf');
    });
    /*const div = document.getElementById("rpt-sector-project");
    const options = {background: "white", height: div.clientHeight, width: div.clientWidth};
    //let chartCanvas = document.getElementById('chart') as HTMLCanvasElement;

    html2canvas(div, options).then((canvas) => {
        //Initialize JSPDF
        let doc = new jsPDF("p", "mm", "a4");
        //Converting canvas to Image
        let imgData = canvas.toDataURL("image/PNG");
        //let chartData = chartCanvas.toDataURL("image/PNG");
        //Add image Canvas to PDF
        doc.addImage(imgData, 'PNG', 20, 20, div.clientWidth, div.clientHeight, '', 1.0);
        //doc.addImage(chartData, 'PNG');
        let pdfOutput = doc.output();
        // using ArrayBuffer will allow you to put image inside PDF
        let buffer = new ArrayBuffer(pdfOutput.length);
        let array = new Uint8Array(buffer);
        for (let i = 0; i < pdfOutput.length; i++) {
            array[i] = pdfOutput.charCodeAt(i);
        }
        //Name of pdf
        const fileName = "example.pdf";
        // Make file
        doc.save(fileName);
    });
}*/

  /*generatePDF() {
    var dv = document.getElementById('rpt-sector-project');
    var HTML_Width = dv.clientWidth;
    var HTML_Height = dv.clientHeight;
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;


    html2canvas(dv, { allowTaint: true }).then(function (canvas) {
      canvas.getContext('2d');
      console.log(canvas.height + "  " + canvas.width);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage([PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      pdf.save("HTML-Document.pdf");
    });
  };*/

  generatePDF() {

    var quotes = document.getElementById('rpt-sector-project');
    html2canvas(quotes)
      .then((canvas) => {
        //! MAKE YOUR PDF
        var pdf = new jsPDF('p', 'pt', 'letter');
        var container = document.querySelector(".row");
        var docWidth = container.getBoundingClientRect().width;
        for (var i = 0; i <= quotes.clientHeight / 980; i++) {
          //! This is all just html2canvas stuff
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
          // details on this usage of this function: 
          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
          ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

          // document.body.appendChild(canvas);
          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

          var width = onePageCanvas.width;
          var height = onePageCanvas.clientHeight;

          //! If we're on anything other than the first page,
          // add another page
          if (i > 0) {
            pdf.addPage([612, 791]); //8.5" x 11" in pts (in*72)
          }
          //! now we declare that we're working on that page
          pdf.setPage(i + 1);
          //! now we add content to that page!
          pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .44), (height * .62));

        }
        //! after the for loop is finished running, we save the pdf.
        pdf.save('Test.pdf');
      });
  }

  printReport() {
    this.storeService.printReport('rpt-sector-project', 'SectorWise Projects List');
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  getSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        var sectorsList = data;
        this.sectorsList = sectorsList.filter(s => s.parentSectorId == null);
        this.subSectorsList = [];
      },
      error => {
        console.log(error);
      }
    )
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

  onSectorSelect(item: any) {
    var id = item.id;
    if (this.selectedSectors.indexOf(id) == -1) {
      this.selectedSectors.push(id);
    }
  }

  onSectorDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedSectors.indexOf(id);
    this.selectedSectors.splice(index, 1);

    this.searchProjectsByCriteriaReport();
  }

  onSectorSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedSectors.indexOf(id) == -1) {
        this.selectedSectors.push(id);
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

  selectDataOption() {
    this.chartData = [];
    var selectedDataOption = 1;
    if (this.model.selectedDataOption) {
      selectedDataOption = parseInt(this.model.selectedDataOption);
    }

    switch (selectedDataOption) {
      case this.dataOptionsCodes.PROJECTS:
        this.chartData = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
        break;

      case this.dataOptionsCodes.FUNDING:
        this.chartData = this.reportDataList.sectorProjectsList.map(p => p.totalFunding);
        break;

      case this.dataOptionsCodes.DISBURSEMENTS:
        this.chartData = this.reportDataList.sectorProjectsList.map(p => p.totalDisbursements);
        break;

      default:
        this.chartData = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
        break;
    }
  }

  getGrandTotalFundingForSector() {
    var totalFunding = 0;
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        totalFunding += p.totalFunding;
      });
    }
    return totalFunding;
  }

  getGrandTotalDisbursementForSector() {
    var totalDisbursement = 0;
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (p) {
        totalDisbursement += p.totalDisbursements;
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
    if (this.selectedDataOptions.length > 0 && this.reportDataList.sectorProjectsList) {
      this.chartData = [];
      this.doughnutChartData = [];
      this.showChart = false;

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.PROJECTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.PROJECTS);
        if (isDataExists.length == 0) {
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = { data: sectorProjects, label: this.dataOptionLabels.PROJECTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(sectorProjects);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.PROJECTS] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.PROJECTS);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.PROJECTS], 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.FUNDING) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.FUNDING);
        if (isDataExists.length == 0) {
          var sectorFunding = this.reportDataList.sectorProjectsList.map(p => p.totalFunding);
          var chartData = { data: sectorFunding, label: this.dataOptionLabels.FUNDING };
          this.chartData.push(chartData);
          this.doughnutChartData.push(sectorFunding);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.FUNDING] = (this.doughnutChartData.length - 1);
        }
      } else {
        this.chartData = this.chartData.filter(d => d.label != this.dataOptionLabels.FUNDING);
        this.doughnutChartData.splice(this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.FUNDING], 1);
      }

      if (this.selectedDataOptions.indexOf(this.dataOptionsCodes.DISBURSEMENTS) != -1) {
        var isDataExists = this.chartData.filter(d => d.label == this.dataOptionLabels.DISBURSEMENTS);
        if (isDataExists.length == 0) {
          var sectorDisbursements = this.reportDataList.sectorProjectsList.map(p => p.totalDisbursements);
          var chartData = { data: sectorDisbursements, label: this.dataOptionLabels.DISBURSEMENTS };
          this.chartData.push(chartData);
          this.doughnutChartData.push(sectorDisbursements);
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
    if (!this.model.selectedCurrency) {
      this.selectedCurrencyName = 'Default';
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
    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      this.reportDataList.sectorProjectsList.forEach(function (sector) {
        sector.totalFunding = Math.round(parseFloat(((sector.totalFunding * calculatedRate).toFixed(2))));
        sector.totalDisbursements = Math.round(parseFloat(((sector.totalDisbursements * calculatedRate).toFixed(2))));

        if (sector.projects && sector.projects.length > 0) {
          sector.projects.forEach(function (project) {
            project.projectCost = Math.round(parseFloat(((project.projectCost * calculatedRate).toFixed(2))));
            project.actualDisbursements = Math.round(parseFloat(((project.actualDisbursements * calculatedRate).toFixed(2))));
            project.plannedDisbursements = Math.round(parseFloat(((project.plannedDisbursements * calculatedRate).toFixed(2))));
          });
        }
      });

      this.getGrandTotalFundingForSector();
      this.getGrandTotalDisbursementForSector();
    }
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  manageChartTypeDisplay() {
    var chartType = this.model.chartType;

    if (this.reportDataList && this.reportDataList.sectorProjectsList) {
      if (chartType == this.chartTypes.PIE || chartType == this.chartTypes.POLAR) {
        this.multiDataDisplay = false;
        this.chartData = [];
        this.selectedDataOptions = [];
        this.selectedDataOptions.push(this.dataOptionsCodes.PROJECTS);
        var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
        this.chartData.push(sectorProjects);
        this.model.selectedDataOptions = [];
        var defaultOption = this.dataOptions.filter(o => o.id == this.dataOptionsCodes.PROJECTS);
        if (defaultOption.length > 0) {
          this.model.selectedDataOptions.push(defaultOption[0]);
        }
      } else {
        if (!this.multiDataDisplay) {
          this.chartData = [];
          this.doughnutChartData = [];
          this.selectedDataOptions = [];
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = { data: sectorProjects, label: this.dataOptionLabels.PROJECTS };
          this.chartData.push(chartData);
          this.selectedDataOptions.push(this.dataOptionsCodes.PROJECTS);
          this.doughnutChartData.push(sectorProjects);
          this.dataOptionsIndexForDoughnut[this.dataOptionsCodes.PROJECTS] = (this.doughnutChartData.length - 1);
          if (this.model.selectedDataOptions.length == 0) {
            var defaultOption = this.dataOptions.filter(o => o.id == this.dataOptionsCodes.PROJECTS);
            if (defaultOption.length > 0) {
              this.model.selectedDataOptions.push(defaultOption[0]);
            }
          }
        }
        this.multiDataDisplay = true;
      }
    }

  }

}
