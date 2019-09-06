import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from 'src/app/services/store-service';

@Component({
  selector: 'financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css']
})
export class FinancialsComponent implements OnInit {

  @Input()
  currenciesList: any = [];
  @Input()
  projectCurrency: string = null;
  @Input()
  projectValue: number = 0;
  @Input()
  projectDisbursements: any = [];
  @Input()
  startingYear: number = 0;
  @Input()
  endingYear: number = 0;

  currentYear: any = 0;
  yearList: any = [];

  disbursementModel: any = { currency: null, projectValue: 0 };
  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.currentYear = this.storeService.getCurrentYear();
    this.disbursementModel.currency = this.projectCurrency;
    this.disbursementModel.projectValue = this.projectValue;
    this.setDisbursementsData();
  }

  setDisbursementsData() {
    for (var yr = this.startingYear; yr <= this.endingYear; yr++) {
      var data = this.projectDisbursements.filter(d => d.year == yr);
      if (data.length == 0) {

        if (yr <= this.currentYear) {
          var newDisbursement = {
            year: yr,
            currency: this.projectCurrency,
            exchangeRate: 0,
            disbursementType: 1,
            Amount: 0
          };
          this.projectDisbursements.push(newDisbursement);
        }

        if (yr >= this.currentYear)
          var newDisbursement = {
            year: yr,
            currency: this.projectCurrency,
            exchangeRate: 0,
            disbursementType: 2,
            Amount: 0
          };
        this.projectDisbursements.push(newDisbursement);
      }
    }
  }
}
