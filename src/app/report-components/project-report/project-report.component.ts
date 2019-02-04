import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  reportDataList: any = [];
  yearsList: any = [];
  sectorsList: any = [];
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  barChartLabels:string[] = [];
  barChartType:string = 'bar';
  barChartLegend:boolean = true;
  barChartData:any[] = [
  ];
  reportModel: any = { year: 0, sectorId: 0 };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService) { }

  ngOnInit() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lowerLimit = currentYear - 20;
    var upperLimit = currentYear + 10;

    for(var y=currentYear; y >= lowerLimit; y--) {
      this.yearsList.push(y);
    }
    this.loadSectors();
  }

  getSectorProjectsReport() {
    this.blockUI.start('Wait loading...');
    this.reportService.getSectorProjectsReport().subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          this.barChartLabels = sectorNames;
          var chartData = {data: sectorProjects, label: 'Sector Projects'};
          this.barChartData.push(chartData);
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    );
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

  loadSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectorsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  printReport() {
    this.storeService.printReport('rpt-sector-project', 'SectorWise Projects List');
  }

  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
