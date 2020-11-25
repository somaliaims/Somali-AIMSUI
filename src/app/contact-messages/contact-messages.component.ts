import { Component, OnInit } from '@angular/core';
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

}
