import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ContactService } from '../services/contact.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-contact-project',
  templateUrl: './contact-project.component.html',
  styleUrls: ['./contact-project.component.css']
})
export class ContactProjectComponent implements OnInit {
  questions: any = [
    { "id": 1, "type": "add", "question": "I want to suggest new data" },
    { "id": 2, "type": "edit", "question": "I want to suggest edit some project data" },
    { "id": 2, "type": "amend", "question": "I want to suggest correction for some project data" }
  ];
  errorMessage: string = null;
  successMessage: string = null;
  isSuccess: boolean = false;
  isLoggedIn: boolean = false;
  isError: boolean = false;
  requestNo: number = 0;
  messageLimit: number = Settings.descriptionMediumLimit;
  messageLimitLeft: number = Settings.descriptionMediumLimit;
  MESSAGE_SENT = 1;
  MESSAGE_TO_REVIEW = 2;

  emailTypes: any = [
    { text: 'Help', val: 1 },
    { text: 'Project information', val: 2 }
  ];

  emailTypeCodes: any = {
    HELP: 1,
    INFORMATION: 2
  };
  
  @BlockUI() blockUI: NgBlockUI;

  model = { senderName: null, senderEmail: '', subject: null, message: null, 
    projectId: 0, projectTitle: null, emailType: this.emailTypeCodes.HELP };
  
  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private contactService: ContactService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private router: Router,
    private securityService: SecurityHelperService) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.model.projectId = id;
        this.getProjectInfo(id);
        this.model.subject = 'Contacting a project';
        this.model.emailType = this.emailTypeCodes.HELP;
      }
    } else {
      this.router.navigateByUrl('home');
    }

    this.isLoggedIn = this.securityService.checkIsLoggedIn();
    if (this.isLoggedIn) {
      this.model.senderEmail = this.securityService.getUserEmail();
    }
    this.storeService.newReportItem(Settings.dropDownMenus.projects);
    this.requestNo = this.storeService.getNewRequestNumber();

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    window.scroll(0, 0);
  }

  sendProjectSugggestion(frm: any) {
    this.isError = false;
    this.isSuccess = false;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.model.projectId == 0) {
      this.errorMessage = 'Select a valid project before proceeding with this request';
      this.errorModal.openModal();
      return false;
    }
    
    this.blockUI.start('Sending message...');
    this.model.projectId = parseInt(this.model.projectId.toString());
    this.model.emailType = parseInt(this.model.emailType.toString());
    this.contactService.sendContactMessage(this.model).subscribe(
      data => {
        if (data) {
          if (data.success && data.returnedId == this.MESSAGE_SENT) {
            this.successMessage = 'Your message for the project is forwarded successfully';
          } else if (data.success && data.returnedId == this.MESSAGE_TO_REVIEW) {
            this.successMessage = 'Your message is sent for review by the management user. Once reviewed, it will be forwarded.';
          }
          this.isSuccess = true;
          frm.resetForm();
          this.resetModel();
        }
        window.scroll(0, 0);
        this.blockUI.stop();
      }
    );
  }

  resetModel() {
    this.model.senderName = null;
    //this.model.senderEmail = '';
    this.model.emailType = this.emailTypeCodes.HELP;
    //this.model.subject = null;
    this.model.message = null;
  }

  getProjectInfo(id) {
    this.projectService.getProject(id).subscribe(
      data => {
        if (data) {
          this.model.projectTitle = data.title;
        }
      }
    );
  }

  getMessageLimitInfo() {
    this.messageLimitLeft = (this.messageLimit - this.model.message.length);
    if (this.messageLimitLeft < 0) {
      this.model.message = this.model.message.substring(0, (this.messageLimit - 1));
    }
  }

}
