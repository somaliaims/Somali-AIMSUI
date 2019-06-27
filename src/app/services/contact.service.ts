import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) {

    }

    sendContactEmail(model: any) {
        var url = this.urlHelper.getContactUrl();
        return this.httpClient.post(url, model, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Contact Email Request'))
        );
    }

}