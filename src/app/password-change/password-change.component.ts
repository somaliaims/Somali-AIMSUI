import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { StoreService } from '../services/store-service';
import { UserService } from '../services/user-service';


@Component({
  selector: 'password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent{
  public frmChangePassword: UntypedFormGroup;
  btnText: string = 'Save';
  isBtnDisabled: boolean = false;

  constructor(private fb: UntypedFormBuilder) {
    this.frmChangePassword = this.createChangePasswordForm();
  }

  createChangePasswordForm(): UntypedFormGroup {
    return this.fb.group(
      {
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(4)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // Check if  password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
  	//this.userService.editPassword().subscribe(
    //  data => {
    //    console.log(data);
       
    //  },
    //  error => {
    //    console.log("Request Failed: ", error);
    //  }

    console.log("Button was enabled and submitted")
  
  };
}