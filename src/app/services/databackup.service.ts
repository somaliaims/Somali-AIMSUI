import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class DatabackupService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) {

         }

    performBackup() {
        var url = this.urlHelper.getDataBackupUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Data backup')));
    }

    getBackupFiles() {
        var url = this.urlHelper.getBackupFilesUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Backup files')));
    }

    performRestore(model: any) {
        var url = this.urlHelper.getDataRestoreUrl();
        return this.httpClient.post(url, model, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Data restore')));
    }
}