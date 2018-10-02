import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationModel } from '../models/registration';

@Injectable({
    providedIn: 'root'
  })
  
export class StoreService {

  private messageSource = new BehaviorSubject<RegistrationModel>(null);
  currentRegistration = this.messageSource.asObservable();

  private infoMessage = new BehaviorSubject<string>('');
  currentInfoMessage = this.infoMessage.asObservable(); 

  constructor() { }

  newRegistration(model: RegistrationModel) {
    this.messageSource.next(model);
  }

  newInfoMessage(message: string) {
    this.infoMessage.next(message);
  }

}