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

}