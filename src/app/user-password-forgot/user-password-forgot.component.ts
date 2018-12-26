import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { StoreService } from '../services/store-service';
import { UserService } from '../services/user-service';


@Component({
  selector: 'app-userpasswordforgot',
  templateUrl: './user-password-forgot.component.html',
  styleUrls: ['./user-password-forgot.component.css']
})
export class UserPasswordForgotComponent{
  public frmForgotPassword: FormGroup;
  btnText: string = 'SEND';

  constructor(private fb: FormBuilder) {
    this.frmForgotPassword = this.createForgotPasswordForm();
  }

  createForgotPasswordForm(): FormGroup {
    return this.fb.group(
      {
        email: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
          ])
        ],
        confirmEmail: [null, Validators.compose([Validators.required])]
      },
      {
        // Check if  emails match
        validator: CustomValidators.emailMatchValidator
      }
    );
  }

  submit() {
  	//this.userService.forgotPassword().subscribe(
    //  data => {
    //    console.log(data);
       
    //  },
    //  error => {
    //    console.log("Request Failed: ", error);
    //  }

    console.log("Button was enabled and submitted")
  
  };
}