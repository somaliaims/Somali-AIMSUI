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
  
}
