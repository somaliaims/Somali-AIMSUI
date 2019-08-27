import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
        private storeService: StoreService) { }


    getMarkers() {
        var url = this.urlHelper.getMarkerUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Custom Fields')));
    }

    getMarkerById(id: string) {
        var url = this.urlHelper.getMarkerByIdUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Custom Field')));
    }

    getActiveMarkers() {
        var url = this.urlHelper.getActiveMarkersUrl();
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Custom Fields')));
    }

    getMarkerProjects(id: string) {
        var url = this.urlHelper.getFieldProjectsUrl(id);
        return this.httpClient.get(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Custom Field Projects')));
    }
    
    saveMarker(model: any) {
        var url = this.urlHelper.getMarkerUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Custom Field')));
    }

    updateMarker(id: string, model: any) {
        var url = this.urlHelper.getMarkerByIdUrl(id);
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Custom Field')));
    }

    deleteMarker(id: number) {
        var url = this.urlHelper.getDeleteMarkerUrl(id.toString());
        return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Custom Field')));
    }

}
