import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Organization } from '../models/organization-model';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class OrganizationTypeService {
  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
    private storeService: StoreService) { }

  getOrganizationTypes() {
    var url = this.urlHelper.organizationTypesUrl();
    return this.httpClient
      .get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Organization Types'))
      );
  }
  
  getOrganizationType(id: string) {
    var url = this.urlHelper.organizationTypesUrl() + '/' + id;
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organization type')));
  }

  addOrganizationType(model: any) {
    var url = this.urlHelper.organizationTypesUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('New Organization Type')));
  }

  updateOrganizationType(id: number, model: any) {
    var url = this.urlHelper.organizationTypesUrl() + '/' + id;
    return this.httpClient.put(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Update Organization Type')));
  }

  deleteOrganizationType(id: string, newId: string) {
    var url = this.urlHelper.deleteOrganizationTypeUrl(id, newId);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Delete Organization Type'))
    );
  }
}
