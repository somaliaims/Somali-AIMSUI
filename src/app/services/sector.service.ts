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

  getAllSectorMappings() {
    var url = this.urlHelper.getAllSectorMappingsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Mappings'))
    );
  }

  addOrUpdateSectorMappings(model: any) {
    var url = this.urlHelper.getSectorMappingsAddOrUpdateUrl();
    return this.httpClient.post(url, model, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Add or Update Sector Mapping'))
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

  getSectorTypes() {
    var url = this.urlHelper.getSectorTypesUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Types')));
  }

  getAllSectors() {
    var url = this.urlHelper.getAllSectors();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sectors'))
    );
  }

  getDefaultSectors() {
    var url = this.urlHelper.getDefaultSectorsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Default Sectors'))
    );
  }

  getSectorsForType(id: string) {
    var url = this.urlHelper.getSectorsForTypeUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sectors for Type'))
    );
  }

  getOtherSectorTypes() {
    var url = this.urlHelper.getOtherSectorTypesUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Other Sectors'))
    );
  }

  getSectorMappings(id: string) {
    var url = this.urlHelper.getSectorMappingsUrl(id);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector Mappings'))
    );
  }

  getMappingsForSector(sectorId: string) {
    var url = this.urlHelper.getMappingsForSectorUrl(sectorId);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Mappings for Sector'))
    );
  }

  getMappingsForSectorByName(sectorName: string) {
    var model = {
      sector: sectorName
    };
    var url = this.urlHelper.getMappingsForSectorByNameUrl();
    return this.httpClient.post(url, model, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Mappings for Sector'))
    );
  }

  deleteSector(id: string, newId: string) {
    var url = this.urlHelper.deleteSectorUrl(id, newId);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Delete Sector'))
    );
  }

  addSectorWithMapping(model: any) {
    var url = this.urlHelper.saveSectorWithMappingUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('New IATI Sector')));
  }

  saveSectorMappings(model: any) {
    var url = this.urlHelper.saveSectorMappingsUrl();
    return this.httpClient.post(url,
      JSON.stringify(model), httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Sector mappings')));
  }

  deleteSectorMapping(sectorId: string, mappingId: string) {
    var url = this.urlHelper.getDeleteSectorMappingsUrl(sectorId, mappingId);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Sector mapping'))
    );
  }

}
