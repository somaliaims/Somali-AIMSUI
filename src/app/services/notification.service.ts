import { Injectable } from '@angular/core';
import { UrlHelperService } from "./url-helper-service";
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { httpOptions } from '../config/httpoptions';
import { StoreService } from './store-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { 
  }

  getUserNotifications() {
      var url  = this.urlHelper.userNotificationsUrl();
      return this.httpClient.get(url, httpOptions).pipe(
              catchError(this.storeService.handleError<any>('Notifications')));
  }

  activateUserAccount(userId: number, notificationId: number) {
    var model = {
      UserId: userId,
      NotificationId: notificationId
    };

    var url = this.urlHelper.userAccountActivationUrl();
        return this.httpClient.post(url, model, httpOptions).pipe(
                catchError(this.storeService.handleError<any>('User Activation')));
  }


}
