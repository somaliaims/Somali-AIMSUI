import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SectorSubCategory } from '../models/sector-subcategory-model';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class SectorSubCategoryService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorSubCategoriesList() {
      var url = this.urlHelper.getSectorSubCategoryUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Sub-Categories')));
    }

    filterSectorSubCategories(criteria: string) {
      var url = this.urlHelper.getSearchSectorSubCategoryUrl(criteria);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Sub-Categories')));
    }

    getSectorSubCategory(id: string) {
      var url = this.urlHelper.getSingleSectorSubCategoryUrl(id);
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector Sub-Categories')));
    }

    addSectorSubCategory(model: any) {
      var url  = this.urlHelper.getSectorSubCategoryUrl();
        return this.httpClient.post(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('New Sector Sub-Category')));
    }

    updateSectorSubCategory(id: number, model: any) {
      var url  = this.urlHelper.getSectorSubCategoryUrl() + '/' + id;
        return this.httpClient.put(url,
            JSON.stringify(model), httpOptions).pipe(
                catchError(this.storeService.handleError<any>('Update Sector Sub-Category')));
    }

}
