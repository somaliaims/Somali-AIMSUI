import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class IATIService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }

    getIATIActivities() {
      var url = this.urlHelper.getIATIActivitiesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('IATIs')));
    }

    getFilteredIATIActivities(criteria: string) {
      var url = this.urlHelper.getFilteredIATIActivitiesUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('IATIs')));
    }

    getOrganizations() {
      var url = this.urlHelper.getIATIOrganizationsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('IATI Organizations')));
    }

    getProjects() {
      var url = this.urlHelper.getIATIProjectsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('IATI Projects')));
    }

    getIATISettings() {
      var url = this.urlHelper.getIATISettingsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('IATI Settings')));
    }

    extractProjectsByIds(model: any) {
      var url = this.urlHelper.extractProjectsByIds();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('IATI Projects by Ids')));
    }

    setIATISettings(model: any) {
      var url = this.urlHelper.setIATISettingsUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('IATI Settings')));
    }

}
