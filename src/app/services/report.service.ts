import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorProjectsReport(sectorsIds: any = [], year: any = 0) {
      var model = {
        year: year,
        sectorIds: sectorsIds
      };
      var url = this.urlHelper.getSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects By Ids')));
    }
}