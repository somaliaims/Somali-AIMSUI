import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class FundingTypeService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getFundingTypesList() {
      var url = this.urlHelper.getFundingTypesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('FundingTypes')));
    }

    getFundingType(id: string) {
      var url = this.urlHelper.getSingleFundingTypeUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('FundingType')));
    }

    addFundingType(model: any) {
      var url  = this.urlHelper.getFundingTypesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New FundingType')));
    }

    updateFundingType(id: number, model: any) {
      var url  = this.urlHelper.getFundingTypesUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update FundingType')));
    }


    /*deleteFundingType(id: string, newId: string) {
      var url = this.urlHelper.deleteFundingTypeUrl(id, newId);
      return this.httpClient.delete(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Delete FundingType'))
      );
    }*/

}
