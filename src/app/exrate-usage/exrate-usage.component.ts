import { Component, OnInit } from '@angular/core';
import { ExRateUsageService } from '../services/exrate-usage.service';

@Component({
  selector: 'app-exrate-usage',
  templateUrl: './exrate-usage.component.html',
  styleUrls: ['./exrate-usage.component.css']
})
export class ExrateUsageComponent implements OnInit {
  exRatesUsageList: any = [];
  isLoading: boolean = false;

  constructor(private exRateUsageService: ExRateUsageService) { }

  ngOnInit() {
  }

  getExRateUsageSettings() {
    this.exRateUsageService.getExRateUsageList().subscribe(
      data => {
        if (data) {
          this.exRatesUsageList = data;
        }
        this.isLoading = true;
      }
    );
  }

}
