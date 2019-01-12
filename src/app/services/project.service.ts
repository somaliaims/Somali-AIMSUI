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

    getProjectTitle(id: string) {
      var url = this.urlHelper.getProjectTitle(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project title')));
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

    deleteProjectLocation(projectId: string, locationId: string) {
      var url  = this.urlHelper.deleteProjectLocationUrl(projectId, locationId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Location')));
    }

    getProjectLocations(id: string) {
      var url = this.urlHelper.getProjectLocationsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Locations')));
    }

    //Project sector functions
    addProjectSector(model: any) {
      var url  = this.urlHelper.addProjectSectorUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Sector')));
    }

    getProjectSectors(id: string) {
      var url = this.urlHelper.getProjectSectorsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Sectors')));
    }

    deleteProjectSector(projectId: string, sectorId: string) {
      var url  = this.urlHelper.deleteProjectSectorUrl(projectId, sectorId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Sector')));
    }

    //Project funder functions
    addProjectFunder(model: any) {
      var url  = this.urlHelper.addProjectFunderUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Funder')));
    }

    getProjectFunders(id: string) {
      var url = this.urlHelper.getProjectFundersUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Sectors')));
    }

    deleteProjectFunder(projectId: string, funderId: string) {
      var url  = this.urlHelper.deleteProjectFunderUrl(projectId, funderId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Funder')));
    }

    //Project implementor functions
    addProjectImplementor(model: any) {
      var url  = this.urlHelper.addProjectImplementorUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Implementor')));
    }

    getProjectImplementors(id: string) {
      var url = this.urlHelper.getProjectImplementorsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Implementors')));
    }

    deleteProjectImplementor(projectId: string, implementorId: string) {
      var url  = this.urlHelper.deleteProjectImplementorUrl(projectId, implementorId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Implementor')));
    }

    //Project disbursements functions
    addProjectDisbursement(model: any) {
      var url  = this.urlHelper.addProjectDisbursementUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Disbursement')));
    }

    getProjectDisbursements(id: string) {
      var url = this.urlHelper.getProjectDisbursementsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Disbursements')));
    }

    deleteProjectDisbursement(projectId: string, startingYear: string) {
      var url  = this.urlHelper.deleteProjectDisbursementUrl(projectId, startingYear);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Disbursement')));
    }

    //Project documents functions
    addProjectDocument(model: any) {
      var url  = this.urlHelper.addProjectDocumentUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Document')));
    }

    getProjectDocuments(id: string) {
      var url = this.urlHelper.getProjectDocumentsUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Documents')));
    }

    deleteProjectDocument(id: string) {
      var url  = this.urlHelper.deleteProjectDocumentUrl(id);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Document')));
    }

    extractProjectsByIds(model: any) {
      var url = this.urlHelper.extractAIMSProjectsByIds();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects By Ids')));
    }

}
