import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit {

  requestNo: number = 0;
  currenciesList: any = [];
  filteredCurrencies: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  errorMessage: string = null;
  showMessage: boolean = false;
  inputTextHolder: string = 'Enter currency name';
  statusMessage: string = 'Wait deleting...';
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};
  @BlockUI() blockUI: NgBlockUI;

  constructor(private currencyService: CurrencyService, private router: Router,
    private storeService: StoreService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent,
    private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }
    
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    //Loads currencies first time from open exchange, if they are not in db
    this.getExchangeRates();
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data && data.length) {
          this.currenciesList = data;
          this.filteredCurrencies = data;
        } else {
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  getExchangeRates() {
    this.isLoading = true;
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data) {
          setTimeout(() => {
            this.getCurrenciesList();
          }, 1000);
        } else {
          this.isLoading = false;
        }
      }
    )
  }

  searchCurrencies() {
    if (!this.criteria) {
      this.filteredCurrencies = this.currenciesList;
    } else {
      if (this.currenciesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredCurrencies = this.currenciesList.filter(c => c.currency.toLowerCase().indexOf(criteria) != -1);
      }
    }
  }

  delete(id: string) {
    if (id) {
      this.blockUI.start(this.statusMessage);
      this.currencyService.deleteCurrency(id).subscribe(
        data => {
          if (data.success) {
            this.currenciesList = this.currenciesList.filter(c => c.id != id);
            this.blockUI.stop();
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

  edit(id: string) {
    if (id) {
      this.router.navigateByUrl('/manage-currency/' + id);
    }
  }
}
