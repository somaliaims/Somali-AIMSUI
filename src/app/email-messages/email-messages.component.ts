import { Component, OnInit } from '@angular/core';
import { EmailMessageService } from '../services/email-message.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';

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

  constructor(private emailMessageService: EmailMessageService, private securityService: SecurityHelperService,
    private router: Router, private modalService: ModalService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEmailMessage) {
      this.router.navigateByUrl('home');
    }
  }

  getEmailMessages() {
    this.emailMessageService.getEmailMessages().subscribe(
      data => {
        if (data) {
          this.emailMessagesList = data;
        }
      }
    )
  }

  searchLocations() {
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
    this.router.navigateByUrl('/manage-location/' + id);
  }

  closeModal() {
    this.modalService.close('confirmation-modal');
  }

  delete(id) {
    this.router.navigateByUrl('delete-location/' + id);
  }

}
