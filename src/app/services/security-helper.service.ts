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
      localStorage.setItem('userId', userObj.id);
      localStorage.setItem('userEmail', userObj.email);
      localStorage.setItem('displayName', userObj.displayName);
      localStorage.setItem('organizationId', userObj.organizationId);
      localStorage.setItem('organizationName', userObj.organizationName);
      localStorage.setItem('userType', userObj.userType);
      localStorage.setItem('isUnAffiliated', userObj.isUnAffiliated);
      localStorage.setItem('isLoggedIn', true.toString());
    }
  }

  checkIsLoggedIn() {
    return (localStorage.getItem('isLoggedIn') == 'true') ? true : false;
  }

  checkIsUnAffilated() {
    return (localStorage.getItem('isUnAffiliated') == 'true') ? true : false;
  }
  
  getUserOrganizationId() {
    return localStorage.getItem('organizationId');
  }

  getUserOrganization() {
    return localStorage.getItem("organizationName");
  }

  getUserToken() {
    var token = localStorage.getItem('token');
    if (token && token != null) {
      return this.decryptText(token);
    }
    return null;
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  getUserId() {
    return localStorage.getItem('userId');
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

  addSlashes(str: string) {
    return str.replace(/\\/g, '\\\\').
        replace(/\//g, '\\/').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
 }

  clearLoginSession() {
    localStorage.setItem('token', null);
    localStorage.setItem('displayName', null);
    localStorage.setItem('organizationId', null);
    localStorage.setItem('userType', null);
    localStorage.setItem('isLoggedIn', false.toString());
  }
  
}
