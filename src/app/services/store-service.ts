import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationModel } from '../models/registration';

@Injectable({
    providedIn: 'root'
  })
  
export class StoreService {

  private messageSource = new BehaviorSubject<RegistrationModel>(null);
  currentRegistration = this.messageSource.asObservable();

  constructor() { }

  newRegistration(model: RegistrationModel) {
    this.messageSource.next(model);
  }

}