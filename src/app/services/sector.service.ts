import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError, tap } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';
import { Observable } from 'rxjs';
import { Sector } from '../models/sector-model';

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

  getSectorChildren(id: string) {
    var url = this.urlHelper.getSectorChildrenUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Children')));
  }

  searchSectors(filter: { name: string } = { name: '' }, page = 1): Observable<Sector[]> {
    var url = this.urlHelper.getSearchSectorsUrl(name);
    return this.httpClient.get<Sector[]>(url)
      .pipe(
        tap((response: Sector[]) => {
          if (response && response.length > 0) {
            response
              .map(s => new Sector(s.id, s.sectorName, s.category, s.subCategory))
              .filter(s => (s.sectorName) ? s.sectorName.includes(filter.name) : null)
          }
          return response;
        })
      );
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
    var url = this.urlHelper.getSectorUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('New Sector')));
  }

  updateSector(id: number, model: any) {
    var url = this.urlHelper.getSectorUrl() + '/' + id;
    return this.httpClient.put(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Update Sector')));
  }

  setChild(sectorId: string, childId: string) {
    var url = this.urlHelper.setSectorChildUrl(sectorId, childId);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Child')));
  }

  removeChild(sectorId: string, childId: string) {
    var url = this.urlHelper.removeSectorChildUrl(sectorId, childId);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Child')));
  }

  getSectorProjects(id: string) {
    var url = this.urlHelper.getSectorProjectsUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Projects'))
    );
  }

  deleteSector(id: string, newId: string) {
    var url = this.urlHelper.deleteSectorUrl(id, newId);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Delete Sector'))
    );
  }

}
