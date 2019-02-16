import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  model: any = { password: null, confirmPassword: null, token: null };
  isError: boolean = false;
  errorMessage: string = '';
  isInfo: boolean = false;
  infoMessage: string = '';
  btnText: string = 'Update Password';
  isBtnDisabled: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private storeService: StoreService) { }

  ngOnInit() {
    var params = this.route.snapshot.queryParams; 
    var token = null;

    if (params && params.token) {
      token = params.token;
    }
    
    if (token != null) {
      this.model.token = token;
    }
  }

  resetPassword() {
    if (this.model.token == null) {
      this.errorMessage = Messages.INVALID_ATTEMPT;
      this.isError = true;
      return false;
    }
    
    var model = { newPassword: this.model.password, token: this.model.token };
    this.isBtnDisabled = true;
    this.btnText = 'Resetting Password...';
    this.userService.resetPassword(model).subscribe(
      data => {
        if (data) {
          this.btnText = 'Redirecting...';
            this.router.navigateByUrl('home');
            location.reload();
        } else {
          this.isBtnDisabled = false;
        }
      },
      error => {
        this.errorMessage = error;
        this.isError = true;
      }
    )
  }

  resetFormStatus() {
    this.btnText = 'Reset Password';
    this.isBtnDisabled = false;
  }

}
