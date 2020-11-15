import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from '../config/messages';
import { Settings } from '../config/settings';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { DocumentLinkService } from '../services/document-link.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-manage-document-link',
  templateUrl: './manage-document-link.component.html',
  styleUrls: ['./manage-document-link.component.css']
})
export class ManageDocumentLinkComponent implements OnInit {

  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Document Link';
  errorMessage: string = '';
  documentlinkTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  permissions: any = {};
  model = { title: null, url: null };

  constructor(private documentlinkService: DocumentLinkService,
    private router: Router, private storeService: StoreService,
    private securityService: SecurityHelperService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditDocument) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  saveLink() {
    this.isBtnDisabled = true;
    
      this.btnText = 'Saving...';
      this.documentlinkService.addDocumentLink(this.model).subscribe(
        data => {
          if (data) {
            var message = 'New document link' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('document-links');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Document Link';
  }

}
