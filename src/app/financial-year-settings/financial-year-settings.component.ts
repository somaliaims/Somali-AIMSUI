import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-financial-year-settings',
  templateUrl: './financial-year-settings.component.html',
  styleUrls: ['./financial-year-settings.component.css']
})
export class FinancialYearSettingsComponent implements OnInit {
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

  constructor(private storeService: StoreService) { 

  }

  ngOnInit() {
    this.isLeapYear = this.storeService.isCurrentlyLeapYear();
  }

  onChangeMonth() {
    var month = this.model.month;
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

}
