import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {Settings} from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class SecurityHelperService {
  secretKey: string;
  userTypes: any = {
    "SuperAdmin": "1",
    "Manager": "2",
    "Standard": "3"
  }

  constructor() {
    this.secretKey = Settings.secretKey;
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

  getUserPermissions() {
    var userType = localStorage.getItem("userType");
    var permissions = {};
    if (userType == this.userTypes.Standard) {
      permissions = Settings.permissions.standard;
    } else if (userType == this.userTypes.SuperAdmin) {
      permissions = Settings.permissions.superAdmin;
    } else if (userType == this.userTypes.Manager) {
      permissions = Settings.permissions.manager;
    } else {
      permissions = Settings.permissions.guest;
    }
    return permissions;
  }

  clearLoginSession() {
    localStorage.clear();
    localStorage.setItem('isLoggedIn', false.toString());
  }
  
}
