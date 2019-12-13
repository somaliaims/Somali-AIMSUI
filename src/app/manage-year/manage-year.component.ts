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
  btnText: string = 'Add financial year/s';
  errorMessage: string = '';
  financialYearTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  sectorTypes: any = [];
  months: any = Settings.months;
  yearLowerLimit: number = 0;
  yearUpperLimit: number = 0;
  yearSpan: number = Settings.yearLimit;
  yearsList: any = [];
  model = { startingMonth: 0, startingYear: 0, endingMonth: 0, endingYear: 0 };

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
    var currentYear = this.storeService.getCurrentYear();
    this.yearLowerLimit = currentYear - this.yearSpan;
    this.yearUpperLimit = currentYear + this.yearSpan;
    for(var year = this.yearLowerLimit; year <= this.yearUpperLimit; year++) {
      this.yearsList.push(year);
    }
  }

  saveFinancialYear() {
    var model = {
      startingMonth: this.model.startingMonth,
      startingYear: this.model.startingYear,
      endingMonth: this.model.endingMonth,
      endingYear: this.model.endingYear
    };

    this.isBtnDisabled = true;
    this.btnText = 'Saving...';
    this.financialYearService.addYearRange(model).subscribe(
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
