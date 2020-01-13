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
  manualEnteredCurrencies: any = [];
  filteredCurrencies: any = [];
  manualFilteredCurrencies: any = [];
  criteria: string = null;
  mcriteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  errorMessage: string = null;
  showMessage: boolean = false;
  inputTextHolder: string = 'Enter currency name';
  statusMessage: string = 'Wait deleting...';
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};
  defaultCurrency: any = { currency: null, currencyName: null };
  nationalCurrency: any = { currency: null, currencyName: null };
  currencySource: any = {
    1: 'Open exchange',
    2: 'Manual'
  }
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
    
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    //Loads currencies first time from open exchange, if they are not in db
    this.getExchangeRates();
    this.getDefaultCurrency();
    this.getNationalCurrency();
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data && data.length) {
          var currencies = data;
          this.currenciesList = currencies.filter(c => c.source == 1);
          this.filteredCurrencies = this.currenciesList;
          this.manualEnteredCurrencies = currencies.filter(c => c.source == 2);
          this.manualFilteredCurrencies = this.manualEnteredCurrencies;
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

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency.currency = data.currency;
          this.defaultCurrency.currencyName = data.currencyName;
        }
      }
    );
  }

  getNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency.currency = data.currency;
          this.nationalCurrency.currencyName = data.currencyName;
        }
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

  showCurrencySource(id: number) {
    return this.currencySource[id];
  }

  searchCurrencies() {
    if (!this.criteria) {
      this.filteredCurrencies = this.currenciesList;
    } else {
      if (this.currenciesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredCurrencies = this.currenciesList.filter(c => 
          (c.currency.toLowerCase().indexOf(criteria) != -1 || (((c.currencyName) ? c.currencyName.toLowerCase().indexOf(criteria) != -1 : false))));
      }
    }
  }

  searchCurrenciesManual() {
    if (!this.mcriteria) {
      this.manualFilteredCurrencies = this.manualEnteredCurrencies;
    } else {
      if (this.manualEnteredCurrencies.length > 0) {
        var criteria = this.mcriteria.toLowerCase();
        this.manualFilteredCurrencies = this.manualFilteredCurrencies.filter(c => 
          (c.currency.toLowerCase().indexOf(criteria) != -1 || (((c.currencyName) ? c.currencyName.toLowerCase().indexOf(criteria) != -1 : false))));
      }
    }
  }

  delete(id: string) {
    if (id) {
      this.blockUI.start(this.statusMessage);
      this.currencyService.deleteCurrency(id).subscribe(
        data => {
          if (data) {
            this.currenciesList = this.currenciesList.filter(c => c.id != id);
            this.filteredCurrencies = this.currenciesList;
            this.criteria = null;
            this.blockUI.stop();
          } 
          this.blockUI.stop();
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

  toggleDefault(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      this.blockUI.start('Setting default currency...');
      this.currencyService.setDefaultCurrency(id).subscribe(
        data => {
          if (data) {
            var selectedCurrency = null;
            this.currenciesList.map(c => c.isDefault = false);
            this.filteredCurrencies.map(c => c.isDefault = false);
            this.manualEnteredCurrencies.map(c => c.isDefault = false);
            this.manualFilteredCurrencies.map(c => c.isDefault = false);

            var currency = this.currenciesList.filter(c => c.id == id);
            if (currency.length > 0) {
              currency[0].isDefault = true;
              selectedCurrency = currency[0];

              var fCurrency = this.filteredCurrencies.filter(c => c.id == id);
              if (fCurrency.length > 0) {
                fCurrency[0].isDefault = true;
              }
            }

            var mCurrency = this.manualEnteredCurrencies.filter(c => c.id == id);
            if (mCurrency.length > 0) {
              mCurrency[0].isDefault = true;
              selectedCurrency = mCurrency[0];

              var mfCurrency = this.manualFilteredCurrencies.filter(c => c.id == id);
              if (mfCurrency.length > 0) {
                mfCurrency[0].isDefault = true;
              }
            }

            if (selectedCurrency && selectedCurrency.currency) {
              this.defaultCurrency.currency = selectedCurrency.currency;
              this.defaultCurrency.currencyName = selectedCurrency.currencyName;
            }
            
          }
          this.blockUI.stop();
        }
      )
    }
  }

  toggleNational(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      this.blockUI.start('Setting default currency...');
      this.currencyService.setNationalCurrency(id).subscribe(
        data => {
          if (data) {
            var selectedCurrency = null;
            this.currenciesList.map(c => c.isNational = false);
            this.filteredCurrencies.map(c => c.isNational = false);
            this.manualEnteredCurrencies.map(c => c.isNational = false);
            this.manualFilteredCurrencies.map(c => c.isNational = false);

            var currency = this.currenciesList.filter(c => c.id == id);
            if (currency.length > 0) {
              currency[0].isNational = true;
              selectedCurrency = currency[0];

              var fCurrency = this.filteredCurrencies.filter(c => c.id == id);
              if (fCurrency.length > 0) {
                fCurrency[0].isNational = true;
              }
            }

            var mCurrency = this.manualEnteredCurrencies.filter(c => c.id == id);
            if (mCurrency.length > 0) {
              mCurrency[0].isNational = true;
              selectedCurrency = mCurrency[0];

              var mfCurrency = this.manualFilteredCurrencies.filter(c => c.id == id);
              if (mfCurrency.length > 0) {
                mfCurrency[0].isNational = true;
              }
            }

            if (selectedCurrency && selectedCurrency.currency) {
              this.nationalCurrency.currency = selectedCurrency.currency;
              this.nationalCurrency.currencyName = selectedCurrency.currencyName;
            }
          }
          this.blockUI.stop();
        }
      )
    }
  }

}
