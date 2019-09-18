import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorProjectsReport(sectorsIds: any = [], year: any = 0) {
      var model = {
        year: year,
        sectorIds: sectorsIds
      };
      var url = this.urlHelper.getSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects By Ids')));
    }

    getBudgetReport() {
      var url = this.urlHelper.getBudgetReportUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Budget Report')));
    }

    getBudgetSummaryReport() {
      var url = this.urlHelper.getBudgetSummaryReportUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Budget Report')));
    }

    getReportNames() {
      var url = this.urlHelper.getReportNamesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Report Names')));
    }

    getSectorWiseProjectsReport(model: any) {
      var url = this.urlHelper.getSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Sectors')));
    }

    getEnvelopeReport(model: any) {
      var url = this.urlHelper.getEnvelopeReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Envelope Report')));
    }

    getLocationWiseProjectsReport(model: any) {
      var url = this.urlHelper.getLocationProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Sectors')));
    }

    getYearlyProjectsReport(model: any) {
      var url = this.urlHelper.getYearlyProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Years')));
    }
}