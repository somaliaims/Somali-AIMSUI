import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { LocationService } from 'src/app/services/location.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.css']
})
export class LocationReportComponent implements OnInit {
  locationsSettings: any = [];
  selectedLocations: any = [];
  selectedOrganizations: any = [];
  organizationsSettings: any = [];
  yearsList: any = [];
  locationsList: any = [];
  subLocationsList: any = [];
  organizationsList: any = [];
  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 4, type: 'doughnut', title: 'Doughnut chart' },
    { id: 5, type: 'radar', title: 'Radar chart' }
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
    locationIds: [], selectedLocations: [], selectedOrganizations: [],
    locationsList: [], organizationsList: []
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private organizationService: OrganizationService,
  ) { }

  ngOnInit() {

    this.getLocationsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();

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
    this.blockUI.start('Searching projects...');
    this.reportService.getLocationWiseProjectsReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.locationProjectsList) {
          var locationNames = this.reportDataList.locationProjectsList.map(p => p.locationName);
          var locationProjects = this.reportDataList.locationProjectsList.map(p => p.projects.length);
          var chartData = { data: locationProjects, label: 'Location projects' };
          this.barChartData.push(chartData);
          this.barChartLabels = locationNames;
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

  getGrandTotalFundingForLocation() {
    var totalFunding  = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalFunding += p.totalFunding;
      });
    }
    return totalFunding;
  }

  getGrandTotalDisbursementForLocation() {
    var totalDisursement  = 0;
    if (this.reportDataList && this.reportDataList.locationProjectsList) {
      this.reportDataList.locationProjectsList.forEach(function (p) {
        totalDisursement += p.totalDisbursements;
      });
    }
    return totalDisursement;
  }

}
