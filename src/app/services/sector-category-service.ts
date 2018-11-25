import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SectorCategory } from '../models/sector-category-model';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class SectorCategoryService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorCategoriesList() {
      var url = this.urlHelper.getSectorCategoryUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Categories')));
    }

    filterSectorCategories(criteria: string) {
      var url = this.urlHelper.getSearchSectorCategoryUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Categories')));
    }

    getSectorCategory(id: string) {
      var url = this.urlHelper.getSingleSectorCategoryUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Categories')));
    }

    addSectorCategory(model: any) {
      var url  = this.urlHelper.getSectorCategoryUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New SectorCategory')));
    }

    updateSectorCategory(id: number, model: any) {
      var url  = this.urlHelper.getSectorCategoryUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update SectorCategory')));
    }

}
