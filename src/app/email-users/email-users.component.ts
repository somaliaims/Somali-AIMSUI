import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { EmailMessageService } from '../services/email-message.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-email-users',
  templateUrl: './email-users.component.html',
  styleUrls: ['./email-users.component.css']
})
export class EmailUsersComponent implements OnInit {

  messageLimit: number = Settings.emailMessageLimit;
  messageLimitLeft: number = Settings.emailMessageLimit;
  requestNo: number = 0;
  isBtnDisabled: boolean = false;
  usersList: any = [];
  filteredUsersList: any = [];
  managerUsersList: any = [];
  permissions: any = {};
  usersSettings: any = {};
  selectedUsers: any = [];
  selectedManagers: any = [];
  emailsList: any = [];
  btnText: string = 'Send email';
  managersSettings: any = {};
  currentEntryForm: any = null;
  infoMessage: string = null;
  errorMessage: string = null;
  userFilters: any = [
    { id: 1, label: '--All users--' },
    { id: 2, label: 'Standard users'},
    { id: 3, label: 'UnAffiliated users' }
  ];
  userFilterConstants: any = {
    ALL_USERS: 1,
    STANDARD_USERS: 2,
    UN_AFFILIATED_USERS: 3
  };

  selectedUserFilter: any = this.userFilterConstants.ALL_USERS;
  emailModel: any = { subject: null, title: null, message: null, selectedManagers: [], selectedUsers: [], emailsList: [] };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private emailMessageService: EmailMessageService, 
    private userService: UserService, private router: Router,
    private securityService: SecurityHelperService, private storeService: StoreService,
    private infoModal: InfoModalComponent, private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEmailMessage) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.usersSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'email',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.getManagerUsers();
    this.getStandardUsers();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  getManagerUsers() {
    this.userService.getManagerUsers().subscribe(
      data => {
        if (data) {
          this.managerUsersList = data;
        }
      }
    );
  }

  getStandardUsers() {
    this.userService.getStandardUsers().subscribe(
      data => {
        if (data) {
          this.usersList = data;
          this.filteredUsersList = data;
        }
      }
    )
  }

  filterUsers() {
    var filter = parseInt(this.selectedUserFilter);
    switch(filter) {
      case this.userFilterConstants.ALL_USERS:
        this.filteredUsersList = this.usersList;
        break;

      case this.userFilterConstants.STANDARD_USERS:
        this.filteredUsersList = this.usersList.filter(u => u.isUnAffiliated == false);
        break;

      case this.userFilterConstants.UN_AFFILIATED_USERS:
        this.filteredUsersList = this.usersList.filter(u => u.isUnAffiliated == true);
        break;

      default:
        this.filteredUsersList = this.usersList;
        break;
    }
  }

  sendEmailMessage(frm: any) {
    if (this.selectedManagers.length == 0 && this.selectedUsers.length == 0) {
      this.errorMessage = 'You must select at least one receiver for this email to send.';
      this.errorModal.openModal();
      return false;
    }

    this.currentEntryForm = frm;
    this.blockUI.start('Sending email...');
    var emailsList = [];
    this.selectedManagers.forEach(e => emailsList.push({ email: e }));
    this.selectedUsers.forEach(e => emailsList.push({ email: e }));

    var model = {
      title: this.emailModel.title,
      subject: this.emailModel.subject,
      message: this.emailModel.message,
      emailsList: emailsList
    }

    this.emailMessageService.sendEmailMessage(model).subscribe(
      data => {
        if (data) {
          this.selectedManagers = [];
          this.selectedUsers = [];
          this.infoMessage = 'Email sent successfully to the recipient/s';
          this.infoModal.openModal();
        }
        this.blockUI.stop();
        this.resetEmailForm();
      }
    );
  }

  resetEmailForm() {
    this.emailModel = { subject: null, title: null, message: null, selectedManagers: [], selectedUsers: [], emailsList: [] };
    this.currentEntryForm.resetForm();
  }

  onManagerSelect(item: any) {
    var email = item.email;
    if (this.selectedManagers.indexOf(email) == -1) {
      this.selectedManagers.push(email);
    }
  }

  onManagerDeSelect(item: any) {
    var email = item.email;
    var index = this.selectedManagers.indexOf(email);
    this.selectedManagers.splice(index, 1);
  }

  onManagerSelectAll(items: any) {
    items.forEach(function (item) {
      var email = item.email;
      if (this.selectedManagers.indexOf(email) == -1) {
        this.selectedManagers.push(email);
      }
    }.bind(this))
  }

  onUserSelectAll(items: any) {
    items.forEach(function (item) {
      var email = item.email;
      if (this.selectedUsers.indexOf(email) == -1) {
        this.selectedUsers.push(email);
      }
    }.bind(this))
  }

  onUserSelect(item: any) {
    var email = item.email;
    if (this.selectedUsers.indexOf(email) == -1) {
      this.selectedUsers.push(email);
    }
  }

  onUserDeSelect(item: any) {
    var email = item.email;
    var index = this.selectedUsers.indexOf(email);
    this.selectedUsers.splice(index, 1);
  }

  getMessageLimitInfo() {
    this.messageLimitLeft = (this.messageLimit - this.emailModel.message.length);
    if (this.messageLimitLeft < 0) {
      this.emailModel.message = this.emailModel.message.substring(0, (this.messageLimit - 1));
    }
  }

}
