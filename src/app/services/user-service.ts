import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserModel } from "../models/user-model";
import { UrlHelperService } from "./url-helper-service";
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as urlsList from "../config/urls";

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

@Injectable({
    providedIn: 'root'
})
export class UserService {
    customersObservable : Observable<UserModel[]>;
    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService) { 
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
                catchError(this.handleError<any>('Authentication')));
    }

    checkEmailAvailability(email: string) {
        var url = this.urlHelper.emailAvailabilityUrl(email);
        return this.httpClient
            .get<boolean>(url);
    }

    registerUser(model: UserModel) {
        var url  = this.urlHelper.userRegistrationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.handleError<any>('User registration')));
    }


    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
    
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
    
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
}
