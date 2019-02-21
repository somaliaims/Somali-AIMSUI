import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';

@Injectable({
  providedIn: 'root'
})
export class SmtpService {

  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }

  getSMTPSettings() {
    var url = this.urlHelper.getSMTPSettingsUrl();
    return this.httpClient.get(url, httpOptions).pipe(
      catchError(this.storeService.handleError<any>('SMTP Settings')));
  }

  saveSMTPSettings(model: any) {
    var url  = this.urlHelper.getSMTPSettingsUrl();
      return this.httpClient.post(url,
          JSON.stringify(model), httpOptions).pipe(
              catchError(this.storeService.handleError<any>('SMTP Settings')));
  }
}
