import { Injectable } from '@angular/core';
import * as urlsList from "../config/urls";

@Injectable({
    providedIn: 'root'
})
export class UrlHelperService {
    BASE_URL : string; 
    
    constructor() {
        this.BASE_URL = urlsList.urls.baseUrl; 
    }

    userTokenUrl() {
        return (this.BASE_URL + urlsList.urls.getToken);
    }

    emailAvailabilityUrl(email: string) {
        return (this.BASE_URL + urlsList.urls.checkEmailAvailability + email);
    }

    userRegistrationUrl() {
        return (this.BASE_URL + urlsList.urls.userRegistration);
    }

    organizationsListUrl() {
        return (this.BASE_URL + urlsList.urls.organizationsList);
    }

    organizationsFilterUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.searchOrganizations + criteria);
    }

    organizationTypesUrl() {
        return (this.BASE_URL + urlsList.urls.organizationTypesList);
    }

    userNotificationsUrl() {
        return (this.BASE_URL + urlsList.urls.userNotificationsList);
    }

    userAccountActivationUrl() {
        return (this.BASE_URL + urlsList.urls.userAccountActivation);
    }

    getSearchOrganizationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getOrganization + id);
    }

    getEditUserUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.editUser);
    }

    getResetPasswordUrl(email: string) {
        return (this.BASE_URL + urlsList.urls.resetPasswordRequest);
    }
    
    getOrganizationUrl() {
        return (this.BASE_URL + urlsList.urls.organizationUrl);
    }

    getSingleLocationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getLocation + id);
    }

    getSearchLocationsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.locationUrl + '/' + criteria);
    }

    getLocationUrl() {
        return (this.BASE_URL + urlsList.urls.locationUrl);
    }

    getSingleSectorTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorType + id);
    }

    getSearchSectorTypeUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorTypesUrl + '/' + criteria);
    }

    getSectorTypeUrl() {
        return (this.BASE_URL + urlsList.urls.sectorTypesUrl);
    }

    getSingleSectorCategoryUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorCategory + id);
    }

    getSearchSectorCategoryUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorCategoriesUrl + '/' + criteria);
    }

    getSectorCategoryUrl() {
        return (this.BASE_URL + urlsList.urls.sectorCategoriesUrl);
    }

    getSingleSectorSubCategoryUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSectorSubCategory + id);
    }

    getSearchSectorSubCategoryUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorSubCategoriesUrl + '/' + criteria);
    }

    getSectorSubCategoryUrl() {
        return (this.BASE_URL + urlsList.urls.sectorSubCategoriesUrl);
    }

    getSingleSectorUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getSector + id);
    }

    getSearchSectorsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.sectorsUrl + '/' + criteria);
    }

    getSectorUrl() {
        return (this.BASE_URL + urlsList.urls.sectorsUrl);
    }

    getSingleProjectTypeUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectType + id);
    }

    getSearchProjectTypesUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.projectTypesUrl + '/' + criteria);
    }

    getProjectTypesUrl() {
        return (this.BASE_URL + urlsList.urls.projectTypesUrl);
    }

    getSingleProjectUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProject + id);
    }

    getSearchProjectsUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.projectsUrl + '/' + criteria);
    }

    getProjectUrl() {
        return (this.BASE_URL + urlsList.urls.projectsUrl);
    }

    getProjectLocationsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectLocationsUrl + id);
    }

    addProjectLocationUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectLocation);
    }

    deleteProjectLocationUrl(projectId: string, locationId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectLocation + projectId + '/' + locationId);
    }

    getProjectSectorsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectSectorsUrl + id);
    }

    addProjectSectorUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectSector);
    }

    deleteProjectSectorUrl(projectId: string, locationId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectSector + projectId + '/' + locationId);
    }

    getProjectFundersUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectFundersUrl + id);
    }

    addProjectFunderUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectFunder);
    }

    getProjectProfileReport(id) {
        return (this.BASE_URL + urlsList.urls.getProjectProfileReport + id);
    }

    deleteProjectFunderUrl(projectId: string, funderId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectFunder + projectId + '/' + funderId);
    }

    getProjectImplementersUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectImplementersUrl + id);
    }

    addProjectImplementerUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectImplementer);
    }

    deleteProjectImplementerUrl(projectId: string, implementerId: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectImplementer + projectId + '/' + implementerId);
    }

    getProjectDisbursementsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectDisbursementUrl + id);
    }

    addProjectDisbursementUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDisbursement);
    }

    deleteProjectDisbursementUrl(projectId: string, startingYear: string, startingMonth: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectDisbursement + projectId + '/' + startingYear + '/' + startingMonth);
    }

    getProjectDocumentsUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectDocumentUrl + id);
    }

    addProjectDocumentUrl() {
        return (this.BASE_URL + urlsList.urls.addProjectDocument);
    }

    deleteProjectDocumentUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.deleteProjectDocument + id);
    }

    getIATIActivitiesUrl() {
        return (this.BASE_URL + urlsList.urls.iatiActivities);
    }

    getFilteredIATIActivitiesUrl(criteria: string) {
        return (this.BASE_URL + urlsList.urls.iatiMatchingActivities + '/' + criteria);
    }

    getIATIOrganizationsUrl() {
        return (this.BASE_URL + urlsList.urls.iatiOrganizations);
    }

    getIATIProjectsUrl() {
        return (this.BASE_URL + urlsList.urls.iatiProjects);
    }

    getProjectTitle(id: string) {
        return (this.BASE_URL + urlsList.urls.getProjectTitle + id);
    }

    extractProjectsByIds() {
        return (this.BASE_URL + urlsList.urls.iatiProjectsByIds);
    }

    extractAIMSProjectsByIds() {
        return (this.BASE_URL + urlsList.urls.aimsProjectsByIds);
    }

    getSearchProjectsViewUrl() {
        return (this.BASE_URL + urlsList.urls.searchProjectsViewByCriteria);
    }

    getFinancialYearsUrl() {
        return (this.BASE_URL + urlsList.urls.getFinancialYears);
    }

    getIATISettingsUrl() {
        return (this.BASE_URL + urlsList.urls.getIatiSettings);
    }

    setIATISettingsUrl() {
        return (this.BASE_URL + urlsList.urls.setIatiSettings);
    }

    getSMTPSettingsUrl() {
        return (this.BASE_URL + urlsList.urls.smtpSettings);
    }

    //Reports url
    getSectorProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.sectorProjectsReport);
    }

    getSearchProjectsReportUrl() {
        return (this.BASE_URL + urlsList.urls.searchProjectsByCriteriaReport);
    }

}