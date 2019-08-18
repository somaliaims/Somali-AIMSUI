import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class ExRateUsageService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }


    getExRateUsageList() {
        var url = this.urlHelper.getExchangeRateUsageUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Exchange Rate Usage')));
    }

    getExRateUsageById(id: string) {
        var url = this.urlHelper.getExchangeRateUsageByIdUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Exchange Rate Usage')));
    }

    saveExchangeRateUsage(model: any) {
        var url = this.urlHelper.getExchangeRateUsageUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Exchange Rate Usage')));
    }

    deleteExchangeRateUsage(source: string, usageSection: string) {
        var url = this.urlHelper.getExchangeRateUsageDeleteUrl(source, usageSection);
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Manual Exchange Rate')));
    }

}
