import { Component, OnInit } from '@angular/core';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  userTypes = [];
  model: any = {};
  isEmailOk: boolean = false;
  emailNotAvailable: boolean = false;
  disableEmail: boolean = false;
  isNameFocus: boolean = false;

  constructor(private userService: UserService, private router: Router) { 
  }
 
  onSubmit() {
    console.log(JSON.stringify(this.model));
    this.router.navigateByUrl('user-org-registration');

  }

  ngOnInit() {
    this.model = new RegistrationModel('', '', '', '', '', '');
    this.fillUserTypes();
  }

  fillUserTypes() {
    this.userTypes.push({
      "id": 1,
      "typeName": "Regular"
    });

    this.userTypes.push({
      "id": 2,
      "typeName": "Manager"
    });
  }

  checkIfEmailAvailable() {
    this.userService.checkEmailAvailability(this.model.Email).subscribe(
      data => {
        this.isEmailOk = data;
        if (!this.isEmailOk) {
          this.emailNotAvailable = true;
          this.disableEmail = false;
        } else {
          this.emailNotAvailable = false;
          this.disableEmail = true;
          this.isNameFocus = true;
        }
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  registerUser() {
    this.userService.registerUser(this.model).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log("Request Faild: ", error);
      }
    )
  }

  resetModel() {
    this.model = new RegistrationModel('', '', '', '', '', '');
    this.isEmailOk = false;
    this.emailNotAvailable = false;
    this.disableEmail = false;
  }

}
