import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class FundingService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService,
    private storeService: StoreService) { }

  addFunding(model: any[]) {
    var url = this.urlHelper.getAddFundingUrl()
    return this.httpClient.post(url, JSON.stringify(model), httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Add Funding'))
    )
  }

  deleteFunding(id: number) {
    var url = this.urlHelper.getDeleteFundingUrl(id);
    return this.httpClient.delete(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Delete Funding'))
    );
  }

  getFundingByProjectId(projectId: number) {
    var url = this.urlHelper.getFundingByProjectIdUrl(projectId);
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('Get Funding By Project Id'))
    );
  }
}
