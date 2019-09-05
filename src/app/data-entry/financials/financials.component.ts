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

  currentYear: any = 0;
  yearList: any = [];

  disbursementModel: any = { currency: null, projectValue: 0 };
  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.currentYear = this.storeService.getCurrentYear();
    this.disbursementModel.currency = this.projectCurrency;
    this.disbursementModel.projectValue = this.projectValue;
  }


}
