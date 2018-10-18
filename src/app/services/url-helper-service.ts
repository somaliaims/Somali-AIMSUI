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

    getOrganizationUrl(id: string) {
        return (this.BASE_URL + urlsList.urls.getOrganization + id);
    }

}