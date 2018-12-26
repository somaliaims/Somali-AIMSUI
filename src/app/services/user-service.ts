import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserModel } from "../models/user-model";
import { UrlHelperService } from "./url-helper-service";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegistrationModel } from '../models/registration';
import { httpOptions } from '../config/httpoptions';
import { StoreService } from './store-service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    customersObservable : Observable<UserModel[]>;
    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
        private storeService: StoreService) { 
    }

    private extractData(res: Response) {
        let body = res;
        return body || { };
      }

    authenticateUser(email: string, password: string) {
        var url  = this.urlHelper.userTokenUrl();
        var model = { "Email": email, "Password": password };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Authentication')));
    }

    checkEmailAvailability(email: string) {
        var url = this.urlHelper.emailAvailabilityUrl(email);
        return this.httpClient
            .get<boolean>(url);
    }

    editUserPassword(id: string, password: string) {
      var url = this.urlHelper.getEditUserUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('User password edit')));
    }

    sendUserPassword(email: string, confirmemail: string) {
      var url = this.urlHelper.getSendUserPassword(email);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('User password recovery')));
    }

    registerUser(model: RegistrationModel) {
        var url  = this.urlHelper.userRegistrationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('User registration')));
    }
}
