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
export class OrganizationService {
  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
    private storeService: StoreService) { }

  searchOrganizations(filter: { name: string } = { name: '' }, page = 1): Observable<Organization[]> {
    var url = this.urlHelper.organizationsListUrl();
    return this.httpClient.get<Organization[]>(url)
      .pipe(
        tap((response: Organization[]) => {
          if (response && response.length > 0) {
            response
              .map(org => new Organization(org.id, org.organizationName))
              .filter(org => (org.organizationName) ? org.organizationName.includes(filter.name) : null)
          }
          return response;
        })
      );
  }

  getOrganizationTypes() {
    var url = this.urlHelper.organizationTypesUrl();
    return this.httpClient
      .get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Organization Types'))
      );
  }

  getOrganizationsCount() {
    var url = this.urlHelper.getOrganizationsCountUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations Count'))
    );
  }

  getOrganizationsForType(id: string) {
    var url = this.urlHelper.getOrganizationsForTypeUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations for Type'))
    );
  }

  getMergeOrganizationRequestsForUser() {
    var url = this.urlHelper.getMergeOrganizationsRequestsForUserUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Merge Organizations Requests for User'))
    );
  }

  approveMergeOrganizationsRequest(id: string) {
    var url = this.urlHelper.getApproveMergeOrganizationsRequestUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Approve Merge Organizations Requests'))
    );
  }

  rejectMergeOrganizationsRequest(id: string) {
    var url = this.urlHelper.getRejectMergeOrganizationsRequestUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Reject Merge Organizations Requests'))
    );
  }

  getOrganizationsWithType() {
    var url = this.urlHelper.getOrganizationWithTypeUrl();
    return this.httpClient.get<any>(url);
  }

  getOrganizationsList() {
    var url = this.urlHelper.organizationsListUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations')));
  }

  getAllOrganizationsList() {
    var url = this.urlHelper.getAllOrganizationsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations')));
  }

  getUserOrganizations() {
    var url = this.urlHelper.getUserOrganizationsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('User Organizations')));
  }

  getIATIOrganizations() {
    var url = this.urlHelper.getIATIOrganizationsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('User Organizations')));
  }

  getOrganizationsHavingEnvelope() {
    var url = this.urlHelper.getOrganizationHavingEnvelopeUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organization with Envelope')));
  }

  filterOrganizations(criteria: string) {
    var url = this.urlHelper.organizationsFilterUrl(criteria);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations')));
  }

  getOrganization(id: string) {
    var url = this.urlHelper.getSearchOrganizationUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organization')));
  }

  checkIfOrganizationsHaveUsers(model: any) {
    var url = this.urlHelper.getIfOrganizationsHaveUsersUrl();
    return this.httpClient.post(url, model, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organizations have users')));
  }

  addMergeOrganizationsRequest(model: any) {
    var url = this.urlHelper.getMergeOrganizationsRequestUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('New Merge Organizations Request')));
  }

  addOrganization(model: any) {
    var url = this.urlHelper.getOrganizationUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('New Organization')));
  }

  getOrganizationProjects(id: string) {
    var url = this.urlHelper.getOrganizationProjectsUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Organization Projects'))
    );
  }

  deleteOrganization(id: string, newId: string) {
    var url = this.urlHelper.deleteOrganizationUrl(id, newId);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Delete Organization'))
    );
  }

  mergeOrganizations(model: any) {
    var url = this.urlHelper.getMergeOrganizationsUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Merge Organizations')));
  }

  renameOrganization(id: number, model: any) {
    var url = this.urlHelper.getRenameOrganizationUrl(id.toString());
    return this.httpClient.put(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Update Organization')));
  }

  updateOrganization(id: number, model: any) {
    var url = this.urlHelper.getOrganizationUrl() + '/' + id;
    return this.httpClient.put(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Update Organization')));
  }
}
