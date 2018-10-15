import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';
import { RequestModel } from '../models/request-model';

@Injectable({
    providedIn: 'root'
  })
  
export class StoreService {

  private requestNumber: number = 0;
  private messageSource = new BehaviorSubject<RegistrationModel>(null);
  currentRegistration = this.messageSource.asObservable();

  private infoMessage = new BehaviorSubject<string>('');
  currentInfoMessage = this.infoMessage.asObservable(); 

  private requestTrack = new BehaviorSubject<RequestModel>(null);
  currentRequestTrack = this.requestTrack.asObservable();
  

  constructor() { }

  newRequestTrack(track: RequestModel) {
    this.requestTrack.next(track);
  }

  newRegistration(model: RegistrationModel) {
    this.messageSource.next(model);
  }

  newInfoMessage(message: string) {
    this.infoMessage.next(message);
  }

  newRequestNumber(requestNo: number) {
    this.requestNumber = requestNo;
  }

  getNewRequestNumber() {
    return (++this.requestNumber);
  }

  getCurrentRequestId() {
    return this.requestNumber;
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}