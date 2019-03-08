import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import { UserService } from '../services/user-service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css']
})
export class UserSubscriptionComponent implements OnInit {
  reportNames: any = [];
  userSubscriptions: any = [];
  reportsList: any = [];
  successMessage: string = '';
  errorMessage: string = '';
  requestNo: number = 0;
  isLoading: boolean = true;

  constructor(private reportService: ReportService, private userService: UserService,
    private infoModal: InfoModalComponent, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    this.getReportNames();
    this.getUserSubscriptions();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
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
          this.reportsList = this.userSubscriptions.map(u => u.reportId);
          console.log(this.reportsList);
        }
        this.isLoading = false;
      }
    )
  }

  manageSubscription(e) {
    var id = e.target.value;

    if (e.target.checked) {
      if (this.reportsList.indexOf(id) == -1) {
        this.reportsList.push(id);
      }
    } else {
      var index = this.reportsList.indexOf(id);
      this.reportsList.splice(index, 1);
    }
    console.log(this.reportsList);
  }

  saveSubscriptions() {
    var model = {
      reportIds: this.reportsList
    }

    this.blockUI.start('Saving subscriptions...');
    this.userService.saveReportSubscriptions(model).subscribe(
      data => {
        if (data) {
          this.successMessage = 'Report subscriptions ' + Messages.SAVED_SUCCESSFULLY;
          this.infoModal.openModal();
        }
        this.blockUI.stop();
      }
    )
  }

}
