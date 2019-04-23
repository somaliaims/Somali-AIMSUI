import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class CustomeFieldService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }


    getCustomFields() {
        var url = this.urlHelper.getCustomFieldUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Custom Fields')));
    }
    
    saveCustomField(model: any) {
        var url = this.urlHelper.saveManualCurrencyRatesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Custom Field')));
    }

    updateCustomField(model: any) {
        var url = this.urlHelper.getCurrencyUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Custom Field')));
    }

    deleteCustomField(id: number) {
        var url = this.urlHelper.getDeleteCustomFieldUrl(id.toString());
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Custom Field')));
    }

}
