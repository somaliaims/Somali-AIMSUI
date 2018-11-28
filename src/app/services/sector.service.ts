import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorsList() {
      var url = this.urlHelper.getSectorUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sectors')));
    }

    filterSectors(criteria: string) {
      var url = this.urlHelper.getSearchSectorsUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sectors')));
    }

    getSector(id: string) {
      var url = this.urlHelper.getSingleSectorUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector')));
    }

    addSector(model: any) {
      var url  = this.urlHelper.getSectorUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Sector')));
    }

    updateSector(id: number, model: any) {
      var url  = this.urlHelper.getSectorUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update Sector')));
    }

}
