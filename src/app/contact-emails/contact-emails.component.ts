import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'contact-emails',
  templateUrl: './contact-emails.component.html',
  styleUrls: ['./contact-emails.component.css']
})
export class ContactEmailsComponent implements OnInit {

  @Input()
  emails: any = [];

  @Input()
  userEmail: string = null;

  @Output()
  showUsers = new EventEmitter<any>();

  emailStr: string = null;
  emailCopied: boolean = false;
  emailsCopied: boolean = false;

  @ViewChild('txtEmails') txtEmails: ElementRef;
  @ViewChild('txtEmailFrom') txtEmailFrom: ElementRef;
  constructor() { 
  }

  ngOnInit(): void {
  }

  copyEmailFrom() {
    this.txtEmailFrom.nativeElement.select();
    document.execCommand("copy");
    this.txtEmailFrom.nativeElement.setSelectionRange(0, 0);
    this.emailCopied = true;
    setTimeout(() => {
      this.emailCopied = false;
    }, 3000);
  }

  copyEmails() {
    this.txtEmails.nativeElement.select();
    document.execCommand("copy");
    this.txtEmails.nativeElement.setSelectionRange(0, 0);
    this.emailsCopied = true;
    setTimeout(() => {
      this.emailsCopied = false;
    }, 3000);
  }

  ngOnChanges() {
    this.generateEmailString();
  }

  generateEmailString() {
    this.emailStr = this.emails.join(',');
  }

  showUsersManager() {
    this.showUsers.emit(true);
  }

}
