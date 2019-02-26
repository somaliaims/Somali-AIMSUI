import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class CurrencyService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }


    getCurrenciesList() {
        var url = this.urlHelper.getCurrencyUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Currencies')));
    }

    searchCurrencies(criteria: string) {
        var url = this.urlHelper.getSearchCurrencyUrl(criteria);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Currencies')));
    }

    addCurrency(model: any) {
        var url = this.urlHelper.getCurrencyUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Currency')));
    }

    deleteCurrency(id: string) {
        var url  = this.urlHelper.getDeleteCurrencyUrl(id);
          return this.httpClient.delete(url, httpOptions).pipe(
                  catchError(this.storeService.handleError<any>('Delete Currency')));
      }

}
