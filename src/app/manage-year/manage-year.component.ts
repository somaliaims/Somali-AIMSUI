import { Component, OnInit } from '@angular/core';
import { FinancialYearService } from '../services/financial-year.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-manage-year',
  templateUrl: './manage-year.component.html',
  styleUrls: ['./manage-year.component.css']
})
export class ManageYearComponent implements OnInit {

  isBtnDisabled: boolean = false;
  btnText: string = 'Add Financial Year';
  errorMessage: string = '';
  financialYearTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  sectorTypes: any = [];
  model = { year: null };

  constructor(private financialYearService: FinancialYearService,     
    private router: Router,
    private storeService: StoreService) {
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
    var model = {
      FinancialYear: this.model.year,
    };

    this.isBtnDisabled = true;
    this.btnText = 'Saving...';
    this.financialYearService.addYear(model).subscribe(
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
