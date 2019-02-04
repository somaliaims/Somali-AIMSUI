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
  sectorsList: any = [];
  reportDataList: any = [];
  yearsList: any = [];
  selectedSectors: any = [];
  dropdownSettings: any = {};
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
  reportModel: any = { year: 0, sectorsList: null, selectedSectors: null };
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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  getSectorProjectsReport() {
    this.barChartLabels = [];
    this.barChartData = [];
    this.blockUI.start('Wait loading...');
    this.reportService.getSectorProjectsReport(this.selectedSectors, this.reportModel.year).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = {data: sectorProjects, label: 'Sector Projects'};
          this.barChartData.push(chartData);
          this.barChartLabels = sectorNames;
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
        this.reportModel.sectorsList = data;
        console.log(this.sectorsList);
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
  }
 
  public chartHovered(e:any):void {
  }

  onItemSelect(item: any) {
    var id = item.id;
    if (this.selectedSectors.indexOf(id) == -1) {
      this.selectedSectors.push(id);
    }
  }

  onItemDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedSectors.indexOf(id);
    this.selectedSectors.splice(index, 1);
  }

  onSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedSectors.indexOf(id) == -1) {
        this.selectedSectors.push(id);
      }
    }.bind(this))
  }

}
 