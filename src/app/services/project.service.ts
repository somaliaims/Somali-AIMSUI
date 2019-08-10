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

    getProjectsWithDetail() {
      var url = this.urlHelper.getProjectsWithDetail();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Projects Detail'))
      );
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

    getProjectProfileReport(id: string) {
      var url = this.urlHelper.getProjectProfileReport(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Profile')));
    }

    getUserMembershipProjects() {
      var url = this.urlHelper.getUserApprovedRequestsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('User Approved Requests')));
    }

    getUserProjects() {
      var url = this.urlHelper.getUserProjectsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('User Projects')));
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


    applyForProjectMembership(id) {
      var url = this.urlHelper.applyForProjectMembershipUrl(id);
      return this.httpClient.post(url, null, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Membership')));
    }

    getProjectMembershipRequests() {
      var url = this.urlHelper.getProjectMembershipUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Membership Requests')));
    }

    mergeProjects(model: any) {
      var url = this.urlHelper.getMergeProjectsUrl();
      return this.httpClient.post(url, JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Merge Projects'))
      );
    }

    approveProjectMembership(model: any) {
      var url = this.urlHelper.approveProjectMembershipUrl();
      return this.httpClient.post(url, JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Approve Project Membership')));
    }

    unApproveProjectMembership(model: any) {
      var url = this.urlHelper.unApproveProjectMembershipUrl();
      return this.httpClient.post(url, JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Approve Project Membership')));
    }

    searchProjectsViewByCriteria(model: any) {
      var url  = this.urlHelper.getSearchProjectsViewUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Search Projects')));
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

    getDeleteProjectIds() {
      var url = this.urlHelper.getDeleteProjectIdsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Delete Project Ids'))
      );
    }

    makeProjectDeletionRequest(model: any) {
      var url = this.urlHelper.getProjectDeletionRequestUrl();
      return this.httpClient.post(url, model, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Deletion Request'))
      );
    }

    getProjectDeletionActiveRequests() {
      var url = this.urlHelper.getProjectDeletionActiveRequestsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Deletion Active Requests'))
      );
    }

    approveProjectDeletion(id: string) {
      var url = this.urlHelper.getProjectDeletionApprovalUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Deletion Request Approval'))
      );
    }

    cancelProjectDeletion(id: string) {
      var url = this.urlHelper.getProjectDeletionCancelUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Deletion Request Cancellation'))
      );
    }

    deleteProject(id: string) {
      var url = this.urlHelper.getProjectDeletionRequestUrl() + '/' + id;
      return this.httpClient.delete(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Deletion'))
      );
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

    //Project implementer functions
    addProjectImplementer(model: any) {
      var url  = this.urlHelper.addProjectImplementerUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Project Implementer')));
    }

    getProjectImplementers(id: string) {
      var url = this.urlHelper.getProjectImplementersUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Project Implementers')));
    }

    deleteProjectImplementer(projectId: string, implementerId: string) {
      var url  = this.urlHelper.deleteProjectImplementerUrl(projectId, implementerId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Implementer')));
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

    deleteProjectDisbursement(id: string) {
      var url  = this.urlHelper.deleteProjectDisbursementUrl(id);
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


    //Project custom fields functions
    saveProjectCustomField(model: any) {
      var url  = this.urlHelper.addProjectCustomFieldUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Save Project Custom Field')));
    }

    deleteProjectCustomField(projectId: string, customFieldId: string) {
      var url  = this.urlHelper.getDeleteProjectFieldUrl(projectId, customFieldId);
        return this.httpClient.delete(url, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Delete Project Field')));
    }

    //project functions
    extractProjectsByIds(model: any) {
      var url = this.urlHelper.extractAIMSProjectsByIds();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects By Ids')));
    }

}
