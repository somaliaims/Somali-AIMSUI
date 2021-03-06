import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailMessageService } from '../services/email-message.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-manage-email-message',
  templateUrl: './manage-email-message.component.html',
  styleUrls: ['./manage-email-message.component.css']
})
export class ManageEmailMessageComponent implements OnInit {
  isBtnDisabled: boolean = false;
  messageId: number = 0;
  btnText: string = 'Save message';
  errorMessage: string = '';
  requestNo: number = 0;
  isForEdit: boolean = false;
  isError: boolean = false;
  messagesList: any = [];
  model = { id: 0, messageType: null, subject: null, typeDefinition: null, message: null, footerMessage: null };
  entryForm: any = null;
  permissions: any = {};

  constructor(private storeService: StoreService, private route: ActivatedRoute,
    private messageService: EmailMessageService, private securityService: SecurityHelperService,
    private router: Router) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEmailMessage) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Save message';
        this.isForEdit = true;
        this.messageId = id;
      }
    }

    this.getEmailMessages();
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getEmailMessages() {
    this.messageService.getEmailMessages().subscribe(
      data => {
        if (data) {
          this.messagesList = data;
          if (this.isForEdit) {
            var message = this.messagesList.filter(m => m.id == this.messageId);
            if (message.length > 0) {
              var messageData = message[0];
              this.model.messageType = messageData.messageType;
              this.model.typeDefinition = messageData.typeDefinition;
              this.model.subject = messageData.subject;
              this.model.message = messageData.message;
              this.model.footerMessage = messageData.footerMessage;
            }
          }
        }
      }
    );
  }

  saveEmailMessage(frm: any) {
    this.entryForm = frm;
    this.btnText = 'Saving...';
    this.isBtnDisabled = true;

    if (this.isForEdit) {
      if (this.messageId) {
        this.messageService.updateEmailMessage(this.messageId.toString(), this.model).subscribe(
          data => {
            if (data) {
              this.router.navigateByUrl('email-messages');
            } else {
              this.resetFormState();
            }
          }
        );
      }
    } else {
      this.messageService.saveEmailMessage(this.model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('email-messages');
          } else {
            this.resetFormState();
          }
        }
      );
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add message';
    this.entryForm.resetForm();
  }

}
