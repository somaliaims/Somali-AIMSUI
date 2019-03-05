import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {StoreService} from '../services/store-service';
import { RequestModel } from '../models/request-model';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private storeService: StoreService, ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            var currentRequestNo = this.storeService.getCurrentRequestId();
            var model = new RequestModel(currentRequestNo, err.status, '');

            var error = '';
            //Need to use status codes if needed
            /*if (err.status === 401) {
                model.errorMessage = "Unauthorized";
            }
            else if (err.status == 400) {
                model.errorMessage = err.message;
            } else if (err.status == 404) {
                model.errorMessage = "Not found";
            } else {*/
            if (err.error) {
                error = err.error
            } else {
                error = err.message || err.statusText;
            }
            model.errorMessage = error;
            model.errorStatus = err.status;
            this.storeService.newRequestTrack(model);
            return throwError(error);
        }))
    }
}