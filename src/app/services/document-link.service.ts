import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class DocumentLinkService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { 
    }

    getDocumentLinks() {
        var url = this.urlHelper.getDocumentLinkUrl();
            return this.httpClient.get(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Document Link')));
    }

    addDocumentLink(model: any) {
        var url = this.urlHelper.getDocumentLinkUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Document Link')));
    }

    deleteDocumentLink(id: string) {
        var url = this.urlHelper.getDocumentLinkUrl() + '/' + id;
            return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Document Link')));
    }
    
}