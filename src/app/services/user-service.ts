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
    customersObservable: Observable<UserModel[]>;
    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) {
    }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }

    authenticateUser(email: string, password: string) {
        var url = this.urlHelper.userTokenUrl();
        var model = { "Email": email, "Password": password };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Authentication')));
    }

    getUsersCount() {
        var url = this.urlHelper.getUsersCountUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Users Count'))
        );
    }

    getUsersList() {
        var url = this.urlHelper.getUsersUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Users list'))
        );
    }

    promoteUser(id: string) {
        var url = this.urlHelper.getPromoteUserUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Promote user'))
        );
    }

    demoteUser(id: string) {
        var url = this.urlHelper.getDemoteUserUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Demote user'))
        );
    }

    checkEmailAvailability(email: string) {
        var url = this.urlHelper.emailAvailabilityUrl(email);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Email availability')));
    }

    editUserPassword(password: string) {
        var url = this.urlHelper.getEditUserPasswordUrl();
        var model = { password: password };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Change User Password')));
    }

    deleteUserAccount(password: string) {
        var url = this.urlHelper.getDeleteAccountUrl();
        var model = { password: password };
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('User Account Deletion')));
    }

    resetPassword(model: any) {
        var url = this.urlHelper.getResetPasswordUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Reset Password')));
    }

    resetPasswordRequest(model: any) {
        var url = this.urlHelper.getResetPasswordRequestUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Reset Password Request')));
    }

    registerUser(model: RegistrationModel) {
        var url = this.urlHelper.userRegistrationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('User Registration')));
    }

    getUserSubscriptions() {
        var url = this.urlHelper.getUserSubscriptionsUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('User Subscription')));
    }

    getManagerUsers() {
        var url = this.urlHelper.getManagerUsersUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Manager Users')));
    }

    getStandardUsers() {
        var url = this.urlHelper.getStandardUsersUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Standard Users')));
    }

    saveReportSubscriptions(model:any) {
        var url = this.urlHelper.getSubscribeToReportsUrl();
        return this.httpClient.post(url, 
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Report Subscriptions')));
    }
}
