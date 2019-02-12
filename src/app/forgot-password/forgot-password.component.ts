import { Component } from '@angular/core';
import { UserService } from '../services/user-service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent{
  btnText: string = 'Send Reset Password Link';
  model: any = { email: null };
  isBtnDisabled: boolean = false;
  isInfo: boolean = false;
  successMessage: string = '';
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private infoModal: InfoModalComponent) {
  }

  sendPasswordResetLink() {
    this.isError = false;
    this.isInfo = false;
    this.btnText = 'Checking and setting...';
    this.isBtnDisabled = true;
    this.userService.resetPasswordRequest(this.model).subscribe(
      data => {
        if (data.success) {
          this.successMessage = Messages.PASSWORD_RESET_SENT;
          this.isInfo = true;
          this.resetFormStatus();
        } else {
          this.errorMessage = Messages.EMAIL_NOT_FOUND;
          this.isError = true;
          this.resetFormStatus();
        }
      },
      error => {
        this.errorMessage = error;
        this.isError = true;
      }
    );
  };

  resetFormStatus() {
    this.isBtnDisabled = false;
    this.btnText = 'Send Reset Password Link';
    this.model.email = null;
  }

}