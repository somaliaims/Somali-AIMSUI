import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SmtpService } from '../services/smtp.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-smtp-settings',
  templateUrl: './smtp-settings.component.html',
  styleUrls: ['./smtp-settings.component.css']
})
export class SmtpSettingsComponent implements OnInit {

  btnText: string = 'Save SMTP Settings';
  errorMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  infoMessage: string = null;
  model: any = { host: null, port: null, username: null, password: null, adminEmail: null };
  
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private smtpService: SmtpService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.getSMTPSettings();
  }

  getSMTPSettings() {
    this.smtpService.getSMTPSettings().subscribe(
      data => {
        this.model.host = data.host;
        this.model.port = data.port;
        this.model.adminEmail = data.adminEmail;
        this.model.username = data.username;
      }
    )
  }

  saveSMTPSettings() {
    this.blockUI.start('Saving Settings...');
    this.smtpService.saveSMTPSettings(this.model).subscribe(
      data => {
        this.infoMessage = 'Email Settings' + Messages.SAVED_SUCCESSFULLY;
        this.infoModal.openModal();
        this.model.password = null;
        this.blockUI.stop();
      },
      error => {
        this.errorMessage = 'An error occured: ' + error;
        this.errorModal.openModal();
        console.log(error);
      }
    )
  }

}
