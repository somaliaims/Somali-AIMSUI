import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {StoreService} from '../services/store-service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private storeService: StoreService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                var isLoggedIn = localStorage.getItem('isLoggedIn');
                if (isLoggedIn) {
                    this.storeService.newErrorMessage('You are unauthorized to perform this action');
                } else {
                    this.storeService.newErrorMessage('Username/Password provided is invalid');
                }
                //location.reload(true);
            }
            
            const error = err.message || err.statusText;
            return throwError(error);
        }))
    }
}