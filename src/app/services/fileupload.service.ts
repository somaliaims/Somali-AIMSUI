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

    uploadExcelFile(formData) {
        var url = this.urlHelper.getExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

}
