import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class GrantTypeService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getGrantTypesList() {
      var url = this.urlHelper.getGrantTypesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('GrantTypes')));
    }

    getGrantType(id: string) {
      var url = this.urlHelper.getSingleGrantTypeUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('GrantType')));
    }

    addGrantType(model: any) {
      var url  = this.urlHelper.getGrantTypesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New GrantType')));
    }

    updateGrantType(id: number, model: any) {
      var url  = this.urlHelper.getGrantTypesUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update GrantType')));
    }


    /*deleteGrantType(id: string, newId: string) {
      var url = this.urlHelper.deleteGrantTypeUrl(id, newId);
      return this.httpClient.delete(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Delete GrantType'))
      );
    }*/

}
