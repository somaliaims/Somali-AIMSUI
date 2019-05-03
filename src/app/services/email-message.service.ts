import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class EmailMessageService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }

    getEmailMessages() {
        var url = this.urlHelper.getEmailMessagesUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Email Messages')));
    }

    getEmailMessageById(id: string) {
        var url = this.urlHelper.getSingleEmailMessageUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Email Message')));
    }

    saveEmailMessage(model: any) {
        var url = this.urlHelper.getEmailMessagesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Email Message')));
    }

    updateEmailMessage(id: string, model: any) {
        var url = this.urlHelper.getSingleEmailMessageUrl(id);
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Email Message')));
    }

    deleteEmailMessage(id: number) {
        var url = this.urlHelper.getSingleEmailMessageUrl(id.toString());
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Email Message')));
    }

}
