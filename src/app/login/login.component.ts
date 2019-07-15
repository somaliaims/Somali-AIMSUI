import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { UserService } from '../services/user-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  errorMessage: string = '';
  isError: boolean = false;
  tenSeconds: number = 10000;
  btnText: string = 'Log In';
  isBtnDisabled: boolean = false;
  requestNo: number = 0;

  constructor(private userService: UserService, private securityService: SecurityHelperService,
    private router: Router, private storeService: StoreService,
    private currencyService: CurrencyService) { }

  ngOnInit() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn == 'true') {
      this.router.navigateByUrl('home');
    }

    this.model = new LoginModel('', '');
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
        this.resetError();
        this.resetDefaultStatus();
      }
    });
  }

  resetError() {
    if (this.isError) {
      setTimeout(() => {
        this.isError = false;
      }, this.tenSeconds);
    }
  }

  authenticateUser() {
    this.isError = false;
    this.btnText = 'Authenticating...';
    this.isBtnDisabled = true;
    this.requestNo = this.storeService.getNewRequestNumber();

    this.userService.authenticateUser(this.model.Email, this.model.Password).subscribe(data => {
      if (data) {
        if (data && data.error) {
          this.errorMessage = 'Username/Password entered is incorrect';
          this.isError = true;
          this.resetDefaultStatus();
        }
        else if (data && !data.error && !data.isApproved) {
          this.errorMessage = 'Your account is not approved yet';
          this.isError = true;
          this.resetDefaultStatus();
        } else if (data.token) {
          this.securityService.storeLoginData(data);
          location.reload();
        } 
      }
    },
      error => {
        console.log("Request Failed: ", error);
        this.resetDefaultStatus();
      });
  }

  getExchangeRates() {
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data) {
          this.storeService.storeExchangeRates(data.rates);
        }
      }
    )
  }

  resetDefaultStatus() {
    this.btnText = 'Log In';
    this.isBtnDisabled = false;
  }

}
