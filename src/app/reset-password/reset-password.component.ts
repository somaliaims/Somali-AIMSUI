import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages } from '../config/messages';
import { StoreService } from '../services/store-service';
import { ModalService } from '../services/modal.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  model: any = { password: null, confirmPassword: null, token: null };
  isError: boolean = false;
  requestNo: number = 0;
  errorMessage: string = '';
  isInfo: boolean = false;
  infoMessage: string = '';
  btnText: string = 'Reset Password';
  isBtnDisabled: boolean = false;
  resetSuccessful: boolean = false;

  constructor(private userService: UserService, private route: ActivatedRoute, 
    private router: Router, private storeService: StoreService, 
    private modalService: ModalService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    var params = this.route.snapshot.queryParams; 
    var token = null;

    if (params && params.token) {
      token = params.token;
    }
    
    if (token != null) {
      this.model.token = token;
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
        this.resetFormStatus();
      }
    });
  }

  resetPassword() {
    if (this.model.token == null) {
      this.errorMessage = Messages.INVALID_ATTEMPT;
      this.isError = true;
      return false;
    } else {
      this.isError = false;
    }
    
    var model = { newPassword: this.model.password, token: this.model.token };
    this.isBtnDisabled = true;
    this.btnText = 'Resetting Password...';
    this.userService.resetPassword(model).subscribe(
      data => {
        if (data && data.success) {
            this.infoMessage = Messages.PASSWORD_UPDATED;
            this.resetSuccessful = true;
        } else if (data && !data.success) {
          this.errorMessage = data.message;
          this.isError = true;
          this.isBtnDisabled = false;
          this.resetFormStatus();
        }
      }
    );
  }

  goToLogin() {
    this.router.navigateByUrl('login');
  }

  closeModalAndNavigate() {
    this.modalService.close('message-modal');
    this.router.navigateByUrl('login');
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  resetFormStatus() {
    this.btnText = 'Reset Password';
    this.isBtnDisabled = false;
  }

}
