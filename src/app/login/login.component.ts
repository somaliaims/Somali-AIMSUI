import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { UserService } from '../services/user-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';

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

  constructor(private userService: UserService, private securityService: SecurityHelperService,
    private router: Router, private storeService: StoreService) { }

  ngOnInit() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn == 'true') {
      this.router.navigateByUrl('');
    }

    this.model = new LoginModel('', '');
    this.storeService.currentErrorMessage.subscribe(message => {
      if (message) {
        this.errorMessage = message;
        this.isError = true;
        this.resetError();
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
    this.userService.authenticateUser(this.model.Email, this.model.Password).subscribe( data => {
      console.log(data);
      if (data) {
        if (data.token) {
          this.securityService.storeLoginData(data);
          //this.router.navigateByUrl('');
          //setTimeout(function() {
            location.reload();
          //}, 1000);
          
        }
      } else {
      }
    },
    error => {
      console.log("Request Failed: ", error);
    });
  }

}
