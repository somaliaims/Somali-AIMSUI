import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class HelpService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }


    getProjectHelpFields() {
        var url = this.urlHelper.getProjectHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Help')));
    }

    getProjectFunderHelpFields() {
        var url = this.urlHelper.getProjectFunderHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Funder Help')));
    }

    getProjectImplementerHelpFields() {
        var url = this.urlHelper.getProjectImplementerHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Implementer Help')));
    }

    getProjectDisbursementsHelpFields() {
        var url = this.urlHelper.getProjectDisbursementsHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Disbursements Help')));
    }

    getProjectExpectedDisbursementsHelpFields() {
        var url = this.urlHelper.getProjectExpectedDisbursementsHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Expected Disbursements Help')));
    }

    getProjectDocumentsHelpFields() {
        var url = this.urlHelper.getProjectDocumentsHelpUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Project Documents Help')));
    }

    saveManualExchangeRates(model: any) {
        var url = this.urlHelper.getManualExchangeRatesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Manual Exchange Rate')));
    }

}
