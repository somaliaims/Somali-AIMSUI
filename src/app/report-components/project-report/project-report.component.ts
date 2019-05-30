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

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  sectorsSettings: any = [];
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  organizationsSettings: any = [];
  locationsSettings: any = [];
  yearsList: any = [];
  sectorsList: any = [];
  subSectorsList: any = [];
  organizationsList: any = [];
  locationsList: any = [];

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
    title: '', organizationIds: [], startingYear: 0, endingYear: 0,
    sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: []
  };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private locationService: LocationService,
  ) { }

  ngOnInit() {

    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();

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
  }

  searchProjectsByCriteriaReport() {
    this.barChartLabels = [];
    this.barChartData = [];
    var searchModel = {
      title: this.model.title,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
      locationIds: this.selectedLocations
    };

    this.resetSearchResults();
    this.blockUI.start('Searching Projects...');
    this.reportService.searchProjectsByCriteriaReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = { data: sectorProjects, label: 'Sector Projects' };
          this.barChartData.push(chartData);
          this.barChartLabels = sectorNames;
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

}
