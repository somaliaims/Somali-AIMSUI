import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserModel } from "../models/user-model";
import { UrlHelperService } from "./url-helper-service";
import * as urlsList from "../config/urls";

@Injectable()
export class UserService {
    customersObservable : Observable<UserModel[]>;
    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService) { 
    }

    authenticateUser(email: string, password: string) {
        var url  = this.urlHelper.userTokenUrl();
        this.httpClient.post(url,
        {
            "Email": email,
            "Password": password,
        });
        /*.subscribe(
            data => {
                console.log(data);
            },
            error => {
                console.log("Request Failed: ", error);
            }
        );*/        
    }

    checkEmailAvailability(email: string) {
        var url = this.urlHelper.emailAvailabilityUrl(email);
        this.httpClient
            .get<Boolean>(url);
    }
}
