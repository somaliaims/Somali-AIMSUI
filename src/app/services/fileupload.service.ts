import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }

    uploadOldExcelFile(formData) {
        var url = this.urlHelper.getOldExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadNewExcelFile(formData) {
        var url = this.urlHelper.getNewExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

}
