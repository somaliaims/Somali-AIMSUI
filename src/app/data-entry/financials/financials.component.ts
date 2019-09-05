import { Component, OnInit, Input } from '@angular/core';

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
  startingYear: number = 0;
  @Input()
  endingYear: number = 0;

  currentYear: any = 0;
  yearList: any = [];

  disbursementModel: any = { currency: null, projectValue: 0 };
  constructor() { }

  ngOnInit() {
    this.disbursementModel.currency = this.projectCurrency;
    this.disbursementModel.projectValue = this.projectValue;
    this.setYearsList();
  }

  setYearsList() {
    for(var i = this.startingYear; i < this.endingYear; i++) {
      this.yearList.push(i);
    }
  }

}
