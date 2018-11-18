import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SectorType } from '../models/sectortype-model';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class SectorTypeService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorTypesList() {
      var url = this.urlHelper.getSectorTypeUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('SectorTypes')));
    }

    filterSectorTypes(criteria: string) {
      var url = this.urlHelper.getSearchSectorTypeUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('SectorTypes')));
    }

    getSectorType(id: string) {
      var url = this.urlHelper.getSingleSectorTypeUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('SectorType')));
    }

    addSectorType(model: any) {
      var url  = this.urlHelper.getSectorTypeUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New SectorType')));
    }

    updateSectorType(id: number, model: any) {
      var url  = this.urlHelper.getSectorTypeUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update SectorType')));
    }

}
