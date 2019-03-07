import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {
  reportNames: any = [];

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.getReportNames();
  }

  getReportNames() {
    this.reportService.getReportNames().subscribe(
      data => {
        if (data) {
          this.reportNames = data;
        }
      }
    )
  }

}
