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

    uploadOldExcelFile(formData: any) {
        var url = this.urlHelper.getOldExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadNewExcelFile(formData: any) {
        var url = this.urlHelper.getNewExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadLatestExcelFile(formData: any) {
        var url = this.urlHelper.getLatestExcelImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadEnvelopeDataFile(formData: any) {
        var url = this.urlHelper.getEnvelopeDataImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadOrganizationTypesFile(formData: any) {
        var url = this.urlHelper.getOrganizationTypesImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

    uploadGhostOrgsFixFile(formData: any) {
        var url = this.urlHelper.getFixGhostOrgsImportUrl();
        return this.httpClient.post(url, 
            formData, {reportProgress: true, observe: 'events'}
        );
    }

}
