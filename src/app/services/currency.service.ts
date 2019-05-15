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

    getExchangeRatesList() {
        var url = this.urlHelper.getExchangeRatesUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Exchange Rates')));
    }

    getExchangeRatesForDate(dated: string) {
        var url = this.urlHelper.getExchangeRatesForDateUrl(dated);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Exchange Rates')));
    }

    searchCurrencies(criteria: string) {
        var url = this.urlHelper.getSearchCurrencyUrl(criteria);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Currencies')));
    }

    getCurrency(id: number) {
        var url = this.urlHelper.getCurrencyByIdUrl(id.toString());
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Currencies')));
    }

    getDefaultCurrency() {
        var url = this.urlHelper.getDefaultCurrencyUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Default Currency')));
    }

    getNationalCurrency() {
        var url = this.urlHelper.getNationalCurrencyUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('National Currency')));
    }

    getExRateSettings() {
        var url = this.urlHelper.getExRateSettingsUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Exchange Rates Settings')));
    }

    getManualExchangeRates() {
        var url = this.urlHelper.getManualExRatesUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Manual Ex Rates')));
    }

    getManaulExRatesForCurrency(code: string) {
        var url = this.urlHelper.getManualExchangeRatesForCurrency(code);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Manual Ex Rates')));
    }

    getManualExRatesByDate(dated: string) {
        var url = this.urlHelper.getManualExchangeRatesByDateUrl(dated);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Manual Ex Rates by Date')));
    }

    saveManualExchangeRates(model: any) {
        var url = this.urlHelper.getManualExchangeRatesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Manual Exchange Rate')));
    }

    deleteManualExchangeRate(id: string) {
        var url = this.urlHelper.getManualExchangeRatesUrl() + '/' + id;
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Manual Exchange Rate')));
    }

    saveAPIKeyOpenExchange(key: string) {
        var url = this.urlHelper.saveAPIKeyOpenExchangeUrl();
        var model = {
            Key: key
        };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('OpenExchange API Key')));
    }

    saveExchangeRateAutoSettings(isAutomatic: boolean) {
        var url = this.urlHelper.getExRateAutoSettingsUrl();
        var model = {
            IsAutomatic: isAutomatic
        };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('OpenExchange Auto Setting')));
    }

    saveManualCurrencyRates(model: any) {
        var url = this.urlHelper.saveManualCurrencyRatesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Manual Currency Rates')));
    }

    addCurrency(model: any) {
        var url = this.urlHelper.getCurrencyUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Currency')));
    }

    editCurrency(id: number, model: any) {
        var url = this.urlHelper.getCurrencyUrl()  + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Currency'))
            );
    }

    deleteCurrency(id: string) {
        var url = this.urlHelper.getDeleteCurrencyUrl(id);
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Currency')));
    }

}
