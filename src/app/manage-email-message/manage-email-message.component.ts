import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailMessageService } from '../services/email-message.service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-email-message',
  templateUrl: './manage-email-message.component.html',
  styleUrls: ['./manage-email-message.component.css']
})
export class ManageEmailMessageComponent implements OnInit {
  isBtnDisabled: boolean = false;
  messageId: number = 0;
  btnText: string = 'Add message';
  errorMessage: string = '';
  requestNo: number = 0;
  isForEdit: boolean = false;
  isError: boolean = false;
  model = { id: 0, typeDefinition: null, message: null };
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

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit message';
        this.isForEdit = true;
        this.messageId = id;
        this.getEmailMessage();
      }
      this.requestNo = this.storeService.getNewRequestNumber();
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getEmailMessage() {
    this.messageService.getEmailMessageById(this.messageId.toString()).subscribe(
      data => {
        if (data) {
          this.model.typeDefinition = data.typeDefinition;
          this.model.message = data.message;
        }
      }
    )
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
        )
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
