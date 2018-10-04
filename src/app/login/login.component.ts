import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { UserService } from '../services/user-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  constructor(private userService: UserService, private securityService: SecurityHelperService,
    private router: Router) { }

  ngOnInit() {
    this.model = new LoginModel('', '');
  }

  authenticateUser() {
    this.userService.authenticateUser(this.model.Email, this.model.Password).subscribe( data => {
      console.log(data);
      if (data.token && (data.token != null && data.token != '')) {
        this.securityService.storeLoginData(data);
        this.router.navigateByUrl('');
      }
    },
    error => {
      console.log("Request Failed: ", error);
    });
  }

}
