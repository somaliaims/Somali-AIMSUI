import { Component, OnInit } from '@angular/core';
import { EmailMessageService } from '../services/email-message.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { Settings } from '../config/settings';
import { InfoModalComponent } from '../info-modal/info-modal.component';

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
  infoMessage: string = null;
  pagingSize: number = Settings.rowsPerPage;

  constructor(private emailMessageService: EmailMessageService, private securityService: SecurityHelperService,
    private router: Router, private modalService: ModalService, private infoModal: InfoModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEmailMessage) {
      this.router.navigateByUrl('home');
    }

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

}
