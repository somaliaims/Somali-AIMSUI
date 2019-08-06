import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { ModalService } from '../services/modal.service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {
  model = { password: null };
  dModel = { password: null };
  currentTab: string = 'password';
  btnPasswordText: string = 'Save New Password';
  btnAccountText: string = 'Delete Account';
  isBtnDisabled: boolean = false;
  isInfo: boolean = false;
  isError: boolean = false;
  infoMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router,
    private storeService: StoreService, private modalService: ModalService,
    private securityService: SecurityHelperService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.securityService.checkIsLoggedIn()) {
      this.router.navigateByUrl('home');
    }
  }

  showPasswordTab() {
    this.currentTab = 'password';
    return false;
  }

  showAccountTab() {
    this.currentTab = 'account';
    return false;
  }

  changePassword() {
    this.isBtnDisabled = true;
    this.btnPasswordText = 'Updating password...';
    this.userService.editUserPassword(this.model.password).subscribe(
      data => {
        if (data) {
          this.modalService.open('reset-info-modal');
          this.btnPasswordText = 'Redirecting...';
          this.securityService.clearLoginSession();

          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          this.resetFormsState();
        }
      }
    );
  }

  confirmDeleteAccount() {
    this.modalService.open('confirmation-modal');
  }

  deleteAccount() {
    this.modalService.close('confirmation-modal');
    this.isBtnDisabled = true;
    this.btnAccountText = 'Deleting account...';
    this.userService.deleteUserAccount(this.dModel.password).subscribe(
      data => {
        if (data) {
          this.storeService
            .newInfoMessage(Messages.ACCOUNT_DELETED);
          this.btnAccountText = 'Setting Environment...';
          this.securityService.clearLoginSession();
          location.href += "?deleted=true";
          location.reload();
        } else {
          this.errorMessage = data.message;
          this.isError = true;
          this.resetFormsState();
        }
      },
      error => {
        this.resetFormsState();
        console.log(error);
      }
    )
  }

  closeModal() {
    this.modalService.close('confirmation-modal');
  }

  resetFormsState() {
    this.btnAccountText = 'Delete Account';
    this.btnPasswordText = 'Save New Password';
    this.model.password = null;
    this.dModel.password = null;
    this.isBtnDisabled = false;
  }

}
