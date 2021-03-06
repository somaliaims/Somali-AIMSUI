import { Component, OnInit } from '@angular/core';
import { EmailMessageService } from '../services/email-message.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { Settings } from '../config/settings';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { UserService } from '../services/user-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-email-message',
  templateUrl: './email-messages.component.html',
  styleUrls: ['./email-messages.component.css']
})
export class EmailMessagesComponent implements OnInit {
  emailMessagesList: any = [];
  filteredEmailMessagesList: any = [];
  permissions: any = {};
  criteria: string = null;
  isLoading: boolean = true;
  isBtnDisabled: boolean = false;
  btnText : string = 'Send email';
  infoMessage: string = null;
  errorMessage: string = null;
  currentTab: string = 'messages';
  pagingSize: number = Settings.rowsPerPage;
  standardUsersList: any = [];
  managerUsersList: any = [];
  

  displayTabs: any = [
    { visible: true, identity: 'messages' },
    { visible: false, identity: 'email' },
  ];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private emailMessageService: EmailMessageService, private securityService: SecurityHelperService,
    private router: Router, private modalService: ModalService, private infoModal: InfoModalComponent,
    private userService: UserService, private storeService: StoreService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEmailMessage) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    
    this.getEmailMessages();
  }

  getEmailMessages() {
    this.emailMessageService.getEmailMessages().subscribe(
      data => {
        if (data) {
          this.emailMessagesList = data;
          this.filteredEmailMessagesList = data;
        }
        this.isLoading = false;
      }
    )
  }

  viewEmailMessage(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      var message = this.emailMessagesList.filter(m => m.id == id);
      if (message.length > 0) {
        this.infoMessage = message[0].message;
        this.infoModal.openModal();
      }
    }
    return false;
  }

  searchMessages() {
    if (!this.criteria) {
      this.filteredEmailMessagesList = this.emailMessagesList;
    }
    else {
      if (this.emailMessagesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredEmailMessagesList = this.emailMessagesList.filter(s => (s.message.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-email-message/' + id);
  }

  closeModal() {
    this.modalService.close('confirmation-modal');
  }

  delete(id) {
    this.router.navigateByUrl('delete-email-message/' + id);
  }

  showMessages() {
    this.manageTabsDisplay('messages');
  }

  showEmail() {
    this.manageTabsDisplay('email');
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  

}
