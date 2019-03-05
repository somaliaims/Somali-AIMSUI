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
      return this.httpClient.get(url, httpOptions);
    }

    filterProjects(criteria: string) {
      var url = this.urlHelper.getSearchProjectsUrl(criteria);
      return this.httpClient.get(url, httpOptions);
    }

    getProject(id: string) {
      var url = this.urlHelper.getSingleProjectUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    getProjectProfileReport(id: string) {
      var url = this.urlHelper.getProjectProfileReport(id);
      return this.httpClient.get(url, httpOptions);
    }

    getProjectTitle(id: string) {
      var url = this.urlHelper.getProjectTitle(id);
      return this.httpClient.get(url, httpOptions);
    }

    addProject(model: any) {
      var url  = this.urlHelper.getProjectUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    searchProjectsViewByCriteria(model: any) {
      var url  = this.urlHelper.getSearchProjectsViewUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    updateProject(id: number, model: any) {
      var url  = this.urlHelper.getProjectUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions);
    }

    //Project locations functions
    addProjectLocation(model: any) {
      var url  = this.urlHelper.addProjectLocationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    deleteProjectLocation(projectId: string, locationId: string) {
      var url  = this.urlHelper.deleteProjectLocationUrl(projectId, locationId);
        return this.httpClient.delete(url, httpOptions);
    }

    getProjectLocations(id: string) {
      var url = this.urlHelper.getProjectLocationsUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    //Project sector functions
    addProjectSector(model: any) {
      var url  = this.urlHelper.addProjectSectorUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    getProjectSectors(id: string) {
      var url = this.urlHelper.getProjectSectorsUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    deleteProjectSector(projectId: string, sectorId: string) {
      var url  = this.urlHelper.deleteProjectSectorUrl(projectId, sectorId);
        return this.httpClient.delete(url, httpOptions);
    }

    //Project funder functions
    addProjectFunder(model: any) {
      var url  = this.urlHelper.addProjectFunderUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    getProjectFunders(id: string) {
      var url = this.urlHelper.getProjectFundersUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    deleteProjectFunder(projectId: string, funderId: string) {
      var url  = this.urlHelper.deleteProjectFunderUrl(projectId, funderId);
        return this.httpClient.delete(url, httpOptions);
    }

    //Project implementer functions
    addProjectImplementer(model: any) {
      var url  = this.urlHelper.addProjectImplementerUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    getProjectImplementers(id: string) {
      var url = this.urlHelper.getProjectImplementersUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    deleteProjectImplementer(projectId: string, implementerId: string) {
      var url  = this.urlHelper.deleteProjectImplementerUrl(projectId, implementerId);
        return this.httpClient.delete(url, httpOptions);
    }

    //Project disbursements functions
    addProjectDisbursement(model: any) {
      var url  = this.urlHelper.addProjectDisbursementUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    getProjectDisbursements(id: string) {
      var url = this.urlHelper.getProjectDisbursementsUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    deleteProjectDisbursement(projectId: string, startingYear: string, startingMonth: string) {
      var url  = this.urlHelper.deleteProjectDisbursementUrl(projectId, startingYear, startingMonth);
        return this.httpClient.delete(url, httpOptions);
    }

    //Project documents functions
    addProjectDocument(model: any) {
      var url  = this.urlHelper.addProjectDocumentUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions);
    }

    getProjectDocuments(id: string) {
      var url = this.urlHelper.getProjectDocumentsUrl(id);
      return this.httpClient.get(url, httpOptions);
    }

    deleteProjectDocument(id: string) {
      var url  = this.urlHelper.deleteProjectDocumentUrl(id);
        return this.httpClient.delete(url, httpOptions);
    }

    extractProjectsByIds(model: any) {
      var url = this.urlHelper.extractAIMSProjectsByIds();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions);
    }

}
