import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getProjectTypesList() {
      var url = this.urlHelper.getProjectTypesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Types')));
    }

    filterProjectTypes(criteria: string) {
      var url = this.urlHelper.getSearchProjectTypesUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Types')));
    }

    getProjectType(id: string) {
      var url = this.urlHelper.getSingleProjectTypeUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Type')));
    }

    addProjectType(model: any) {
      var url  = this.urlHelper.getProjectTypesUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Type')));
    }

    updateProjectType(id: number, model: any) {
      var url  = this.urlHelper.getProjectTypesUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update Project Type')));
    }

}
