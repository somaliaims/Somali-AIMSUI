import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {
  reportNames: any = [];
  userSubscriptions: any = [];
  reportsList: any = [];

  constructor(private reportService: ReportService, private userService: UserService) { }

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

  checkIfReportSubscribedTo(id) {
    if (this.userSubscriptions.length == 0)
      return false;
    return this.reportsList.indexOf(id) != -1 ? true : false;
  }

  getUserSubscriptions() {
    this.userService.getUserSubscriptions().subscribe(
      data => {
        if (data) {
          this.userSubscriptions = data;
          this.reportsList  = this.userSubscriptions.map(u => u.reportId);
        }
      }
    )
  }

  manageSubscription(e) {
    var id = e.target.value;
    
    if (e.target.checked) {
      if (this.reportsList.indexOf(id) == -1) {
        this.reportsList.push(id);
      } else {
        var index = this.reportsList.indexOf(id);
        this.reportsList.splice(index, 1);
      }
    }
  }

  saveSubscriptions() {
    var model = {
      reportIds: this.reportsList
    }

    
  }

}
