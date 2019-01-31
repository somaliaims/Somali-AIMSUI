import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  reportDataList: any = [];
  yearsList: any = [];

  reportModel: any = { year: null };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService) { }

  ngOnInit() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lowerLimit = currentYear - 20;
    var upperLimit = currentYear + 10;

    for(var y=currentYear; y >= lowerLimit; y--) {
      this.yearsList.push(y);
    }
  }

  getSectorProjectsReport() {
    this.blockUI.start('Wait loading...');
    this.reportService.getSectorProjectsReport().subscribe(
      data => {
        this.reportDataList = data;
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

  printReport() {
    this.storeService.printReport('rpt-sector-project', 'SectorWise Projects List');
  }

}
