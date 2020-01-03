import { Component, OnInit } from '@angular/core';
import { FinancialYearService } from '../services/financial-year.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-manage-year',
  templateUrl: './manage-year.component.html',
  styleUrls: ['./manage-year.component.css']
})
export class ManageYearComponent implements OnInit {

  isBtnDisabled: boolean = false;
  btnText: string = 'Add financial year';
  errorMessage: string = '';
  requestNo: number = 0;
  isError: boolean = false;
  months: any = [
    { index: 1, month: 'January', date: 31 },
    { index: 2, month: 'February', date: 28 },
    { index: 3, month: 'March', date: 31 },
    { index: 4, month: 'April', date: 30 },
    { index: 5, month: 'May', date: 31 },
    { index: 6, month: 'June', date: 30 },
    { index: 7, month: 'July', date: 31 },
    { index: 8, month: 'August', date: 31 },
    { index: 9, month: 'September', date: 30 },
    { index: 10, month: 'October', date: 31 },
    { index: 11, month: 'November', date: 30 },
    { index: 12, month: 'December', date: 31 }
  ];
  model: any = { month: 0, day: 0 };
  days: any = [];
  isLeapYear: boolean = false;

  constructor(private financialYearService: FinancialYearService,     
    private router: Router,
    private storeService: StoreService,
    private errorModal: ErrorModalComponent) {
  }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    this.storeService.newReportItem(Settings.dropDownMenus.management);
  }

  onMonthChange() {
    var month = parseInt(this.model.month);
    switch(month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        this.fillDays(31);
        break;

      case 4:
      case 6:
      case 9:
      case 11:
        this.fillDays(30);
        break;

      case 2:
        if (this.isLeapYear) {
          this.fillDays(29);
        } else {
          this.fillDays(28);
        }
        break;
    }
  }

  fillDays(dayLimit: number) {
    this.days = [];
    for(var day=1; day <= dayLimit; day++) {
      this.days.push(day);
    }
  }

  saveFinancialYear() {
    this.isBtnDisabled = true;
    this.btnText = 'Saving...';
    this.financialYearService.addYear(this.model).subscribe(
      data => {
        this.router.navigateByUrl('financial-years');
      }
    );
  }

  resetForm() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Financial Year';
  }

}
