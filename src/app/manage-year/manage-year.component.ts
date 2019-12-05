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
  model = { startDate: null, endDate: null };

  constructor(private financialYearService: FinancialYearService,     
    private router: Router,
    private storeService: StoreService,
    private errorModal: ErrorModalComponent) {
  }

  ngOnInit() {
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    this.storeService.newReportItem(Settings.dropDownMenus.management);
  }

  saveFinancialYear() {
    var startDate = new Date(this.model.startDate);
    var endDate = new Date(this.model.endDate);

    if (startDate > endDate) {
      this.errorMessage = Messages.INVALID_DATE_RANGE;
      this.errorModal.openModal();
      return false;
    }

    var sDay = startDate.getDate();
    var sMonth = startDate.getMonth() + 1;
    var sYear = startDate.getFullYear();
    var eDay = endDate.getDate();
    var eMonth = endDate.getMonth() + 1;
    var eYear = endDate.getFullYear();

    if ((eYear - 1 == sYear)) {
      if ((sMonth == 12 && sDay >= 25) && (eMonth == 1 && eDay <= 5)) {
        eYear = sYear;
      }
    }

    var model = {
      startingYear: sYear,
      endingYear: eYear
    };

    this.isBtnDisabled = true;
    this.btnText = 'Saving...';
    this.financialYearService.addYearRange(model).subscribe(
      data => {
        this.router.navigateByUrl('financial-years');
      },
      error => {
        this.isError = true;
        this.errorMessage = error;
      }
    )
    
  }

  resetForm() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Financial Year';
  }

}
