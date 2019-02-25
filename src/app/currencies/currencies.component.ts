import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  currenciesList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;

  constructor(private currencyService: CurrencyService, private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getCurrenciesList();
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.currenciesList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchCurrencies() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.currencyService.searchCurrencies(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.currenciesList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.getCurrenciesList();
    }
  }

}
