import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Settings from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class SecurityHelperService {
  secretKey: string;

  constructor() {
    this.secretKey = Settings.settings.secretKey;
  }

  encryptText(text: string) {
    return (CryptoJS.AES.encrypt(text, this.secretKey));
  }

  decryptText(text: string) {
    return (CryptoJS.AES.decrypt(text, this.secretKey));
  }

  storeLoginData(userObj: any) {
    if (userObj.token && userObj.token != null) {
      var token = userObj.token;
      //var eToken = this.encryptText(token);
      localStorage.setItem('token', token);
      localStorage.setItem('displayName', userObj.displayName);
      localStorage.setItem('organizationId', userObj.organizationId);
      localStorage.setItem('userType', userObj.userType);
      localStorage.setItem('isLoggedIn', true.toString());
    }
  }

  getUserToken() {
    var token = localStorage.getItem('token');
    if (token && token != null) {
      return this.decryptText(token);
    }
    return null;
  }

  clearLoginSession() {
    localStorage.clear();
    localStorage.setItem('isLoggedIn', false.toString());
  }
  
}
