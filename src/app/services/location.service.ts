import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getLocationsList() {
      var url = this.urlHelper.getLocationUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Locations')));
    }

    filterLocations(criteria: string) {
      var url = this.urlHelper.getSearchLocationsUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Locations')));
    }

    getLocation(id: string) {
      var url = this.urlHelper.getSingleLocationUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Location')));
    }

    addLocation(model: any) {
      var url  = this.urlHelper.getLocationUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Location')));
    }

    updateLocation(id: number, model: any) {
      var url  = this.urlHelper.getLocationUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update Location')));
    }

    deleteLocation(id: number) {
      var url = this.urlHelper.getLocationUrl() + '/' + id;
      return this.httpClient.delete(url, httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Delete Location')));
    }

}
