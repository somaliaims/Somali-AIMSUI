import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Messages } from '../config/messages';

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
  errorMessage: string = null;
  showMessage: boolean = false;
  statusMessage: string = 'Wait deleting...';
  pagingSize: number = Settings.rowsPerPage;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private currencyService: CurrencyService, private router: Router,
    private storeService: StoreService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent) { }

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

  delete(id: string) {
    if (id) {
      this.blockUI.start(this.statusMessage);
      this.currencyService.deleteCurrency(id).subscribe(
        data => {
          if (data.success) {
            this.statusMessage = 'Currency ' + Messages.RECORD_DELETED;
            this.currenciesList = this.currenciesList.filter(c => c.id != id);
            setTimeout(() => {
              this.blockUI.stop();
            }, 2000);
          } else {
            this.blockUI.stop();
          }
        },
        error => {
          this.errorMessage = error;
          this.errorModal.openModal();
        }
      )
    }
    return false;
  }
}
