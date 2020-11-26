import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.css']
})
export class ContactMessagesComponent implements OnInit {

  isLoading: boolean = true;
  contactMessages: any = [];
  infoMessage: string = null;
  errorMessage: string = null;

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.getContactMessages();
  }

  getContactMessages() {
    this.contactService.getPendingContactMessages().subscribe(
      data => {
        if (data) {
          this.contactMessages = data;
        }
        this.isLoading = false;
      }
    );
  }

  approveMessage(id: number) {
    if (id) {
      this.blockUI.start('Wait approving...');
      
        this.contactService.approveContactMessage(id).subscribe(
          data => {
            if (data) {
              this.contactMessages = this.contactMessages.filter(m => m.id != id);
            }
            this.blockUI.stop();
          }
        );
    }
  }

  delete(id: number) {
    if (id) {
      this.blockUI.start('Wait approving...');
        this.contactService.deleteContactMessage(id.toString()).subscribe(
          data => {
            if (data) {
              this.contactMessages = this.contactMessages.filter(m => m.id != id);
            }
            this.blockUI.stop();
          }
        );
    }
  }

}
