import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
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
    private securityService: SecurityHelperService) { }

  ngOnInit() {
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
    this.btnPasswordText = 'Updating Password...';
    this.userService.editUserPassword(this.model.password).subscribe(
      data => {
        this.infoMessage = Messages.PASSWORD_UPDATED;
        this.isInfo = true;
        this.resetFormsState();
      },
      error => {
        this.resetFormsState();
      }
    )
  }

  confirmDeleteAccount() {
    this.modalService.open('confirmation-modal');
  }

  deleteAccount() {
    this.modalService.close('confirmation-modal');
    this.isBtnDisabled = true;
    this.btnAccountText = 'Deleting Account...';
    this.userService.deleteUserAccount(this.dModel.password).subscribe(
      data => {

        if (data.success) {
          this.storeService
            .newInfoMessage(Messages.ACCOUNT_DELETED);
          this.btnAccountText = 'Setting Environment...';
          this.securityService.clearLoginSession();

          setTimeout(() => {
            this.router.navigateByUrl('home');
            location.reload();
          }, 2000);
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
