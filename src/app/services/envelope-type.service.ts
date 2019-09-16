import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class EnvelopeTypeService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }

        getAllEnvelopeTypes() {
            var url = this.urlHelper.getEnvelopeTypeUrl();
            return this.httpClient.get(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Envelope Types')));
        }

        getEnvelopeTypeById(id: number) {
            var url = this.urlHelper.getEnvelopeTypeUrl() + '/' + id;
            return this.httpClient.get(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Envelope Type')));
        }

        addEnvelopeType(model: any) {
            var url = this.urlHelper.getEnvelopeTypeUrl();
            return this.httpClient.post(url,
                JSON.stringify(model), httpOptions).pipe(
                    catchError(this.storeService.handleError<any>('New Envelope Type')));
        }
    
        editEnvelopeType(id: number, model: any) {
            var url = this.urlHelper.getEnvelopeTypeUrl() + '/' + id;
            return this.httpClient.put(url,
                JSON.stringify(model), httpOptions).pipe(
                    catchError(this.storeService.handleError<any>('Edit Envelope Type'))
                );
        }
    
        deleteEnvelope(funderId: number, year: number) {
            var url = this.urlHelper.getEnvelopeTypeUrl() + '/' + funderId + '/' + year;
            return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Envelope Type')));
        }
    
}