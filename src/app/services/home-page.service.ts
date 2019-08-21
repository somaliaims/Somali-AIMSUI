import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class HomePageService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) {

    }

    setHomePageSettings(model: any) {
        var url = this.urlHelper.setHomePageSettingsUrl();
        return this.httpClient.post(url, model, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Home Page Settings'))
        );
    }

    getHomePageSettings() {
        var url = this.urlHelper.getHomePageSettingsUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Home Page Settings')));
    }

}