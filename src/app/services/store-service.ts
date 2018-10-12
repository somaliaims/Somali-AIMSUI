import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';

@Injectable({
    providedIn: 'root'
  })
  
export class StoreService {

  private messageSource = new BehaviorSubject<RegistrationModel>(null);
  currentRegistration = this.messageSource.asObservable();

  private infoMessage = new BehaviorSubject<string>('');
  currentInfoMessage = this.infoMessage.asObservable(); 

  private errorMessage = new BehaviorSubject<string>('');
  currentErrorMessage = this.errorMessage.asObservable();

  constructor() { }

  newRegistration(model: RegistrationModel) {
    this.messageSource.next(model);
  }

  newInfoMessage(message: string) {
    this.infoMessage.next(message);
  }

  newErrorMessage(message: string) {
    this.errorMessage.next(message);
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