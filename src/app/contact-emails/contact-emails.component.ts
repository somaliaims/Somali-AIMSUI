import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'contact-emails',
  templateUrl: './contact-emails.component.html',
  styleUrls: ['./contact-emails.component.css']
})
export class ContactEmailsComponent implements OnInit {

  @Input()
  emails: any = [];

  @Input()
  fromEmail: string = null;

  emailStr: string = null;

  constructor() { 
    this.generateEmailString();
  }

  ngOnInit(): void {
  }

  generateEmailString() {
    this.emailStr = this.emails.join(',');
  }

}
