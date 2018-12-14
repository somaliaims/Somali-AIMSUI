import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getProjectsList() {
      var url = this.urlHelper.getProjectUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Projects')));
    }

    filterProjects(criteria: string) {
      var url = this.urlHelper.getSearchProjectsUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Projects')));
    }

    getProject(id: string) {
      var url = this.urlHelper.getSingleProjectUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project')));
    }

    addProject(model: any) {
      var url  = this.urlHelper.getProjectUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project')));
    }

    updateProject(id: number, model: any) {
      var url  = this.urlHelper.getProjectUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update Project')));
    }

    //Project locations functions
    addProjectLocation(model: any) {
      var url  = this.urlHelper.addProjectLocationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Location')));
    }

    getProjectLocations(id: string) {
      var url = this.urlHelper.getProjectLocationsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Locations')));
    }

}
