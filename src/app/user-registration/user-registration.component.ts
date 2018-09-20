import { Component, OnInit } from '@angular/core';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';

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
  
  constructor(private userService: UserService) { 
    
  }
 
  onSubmit() {
    console.log(JSON.stringify(this.model))
  }

  ngOnInit() {
    this.model = new RegistrationModel('', '', '', '', '');
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
        }
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

}
