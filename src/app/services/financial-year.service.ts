import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
    private storeService: StoreService) {

  }

  getYearsList() {
    var url = this.urlHelper.getFinancialYearsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Financial Years')));
  }

  addYear(model: any) {
    var url  = this.urlHelper.getFinancialYearsUrl();
      return this.httpClient.post(url,
          JSON.stringify(model), httpOptions).pipe(
              catchError(this.storeService.handleError<any>('New Financial Year')));
  }

  addYearRange(model: any) {
    var url  = this.urlHelper.getFinancialYearRangeUrl();
      return this.httpClient.post(url,
          JSON.stringify(model), httpOptions).pipe(
              catchError(this.storeService.handleError<any>('New Financial Year Range')));
  }

}
