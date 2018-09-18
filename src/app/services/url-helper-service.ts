import { Injectable } from '@angular/core';
import * as urlsList from "../config/urls";

@Injectable()
export class UrlHelperService {
    BASE_URL : string; 
    
    constructor() {
        this.BASE_URL = urlsList.urls.baseUrl; 
    }

    userTokenUrl() {
        return (this.BASE_URL + urlsList.urls.getToken);
    }

    emailAvailabilityUrl(email) {
        return (this.BASE_URL + urlsList.urls.checkEmailAvailability + email);
    }


}