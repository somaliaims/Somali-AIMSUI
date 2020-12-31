import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { ContactService } from '../services/contact.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from '../services/project.service';
import { Settings } from '../config/settings';
import { StoreService } from '../services/store-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  isLoggedIn: boolean = false;
  isError: boolean = false;
  errorMessage: string = null;
  successMessage: string = null;
  isShowSuccessMessage: boolean = false;
  isShowList: boolean = false;
  projectsList: any = [];
  projectsSettings: any = {};
  filteredProjectsList: any = [];
  criteria: string = null;
  isLoading: boolean = false;
  itemsToShowInDropdowns: number = 5;
  MESSAGE_SENT = 1;
  MESSAGE_TO_REVIEW = 2;
  messageLimit: number = Settings.descriptionMediumLimit;
  messageLimitLeft: number = Settings.descriptionMediumLimit;
  model: any = { emailType: null, senderName: null, projectTitle: null, senderEmail: null, 
    projectId: 0, subject: null, message: null, selectedProject: null 
  };

  emailTypes: any = [
    { text: 'Help', val: 1 },
    { text: 'Project information', val: 2 }
  ];

  emailTypeCodes: any = {
    HELP: 1,
    INFORMATION: 2
  };

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private securityService: SecurityHelperService, 
    private contactService: ContactService, private errorModal: ErrorModalComponent,
    private projectService: ProjectService, private storeService: StoreService,
    private router: Router) {
  }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.contact);
    this.isLoggedIn = this.securityService.checkIsLoggedIn();
    if (this.isLoggedIn) {
      this.model.senderEmail = this.securityService.getUserEmail();
    }
    this.getProjects();

    this.projectsSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: this.itemsToShowInDropdowns,
      allowSearchFilter: true
    };
  }

  sendEmailRequest(frm: any) {
    this.isShowSuccessMessage = false;
    if (this.model.selectedProject == null) {
      this.errorMessage = 'Select a project before posting the message';
      this.errorModal.openModal();
      return false;
    }

    this.model.projectId = this.model.selectedProject.id;
    this.blockUI.start('Submitting request...');
    this.model.emailType = parseInt(this.model.emailType);
    this.model.projectTitle = this.model.selectedProject.title;
    this.model.projectId = this.model.selectedProject.id;
    var model = {
      emailType: this.model.emailType, 
      senderName: this.model.senderName, 
      projectTitle: this.model.selectedProject[0].title, 
      senderEmail: this.model.senderEmail, 
      projectId: this.model.selectedProject[0].id, 
      subject: this.model.subject, 
      message: this.model.message
    }
    this.contactService.sendContactMessage(model).subscribe(
      data => {
        if (data) {
          if (data.success && data.returnedId == this.MESSAGE_SENT) {
            this.successMessage = 'Your message for the project is forwarded successfully';
          } else if (data.success && data.returnedId == this.MESSAGE_TO_REVIEW) {
            this.successMessage = 'Your message is sent for review by the management user. Once reviewed, it will be forwarded.';
          }
          this.isShowSuccessMessage = true;
          this.resetModel();
          frm.resetForm();
          window.scroll(0, 0);
        }
        this.blockUI.stop();
      }
    );
  }

  getProjects() {
    this.isLoading = true;
    this.projectService.getProjectTitles().subscribe(
      data => {
        if (data) {
          this.projectsList = data;
          this.filteredProjectsList = data;
          this.isShowList = true;
        }
        this.isLoading = false;
      }
    );
  }

  filterProjects() {
    if (!this.criteria) {
      this.filteredProjectsList = this.projectsList;
    } else {
      if (this.projectsList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredProjectsList = this.projectsList.filter(s => (s.title.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  selectProject(e) {
    var id = parseInt(e.currentTarget.id.split('-')[1]);
    if (id) {
      var selectedProject = this.projectsList.filter(p => p.id == id);
      if (selectedProject.length > 0) {
        this.model.projectId = id;
        this.criteria = selectedProject[0].title;
        this.isShowList = false;
      }
    }
  }

  changeRequest() {
    if (this.model.emailType == this.emailTypeCodes.INFORMATION) {
      this.isShowList = true;
      if (this.projectsList.length == 0) {
        this.getProjects();
      }
    } else {
      this.isShowList = false;
    }
  }

  showProjectsList() {
    this.isShowList = true;
    this.criteria = null;
    this.model.projectId = 0;
    this.filteredProjectsList = this.projectsList;
  }

  resetModel() {
    this.model = { emailType: null, senderName: null, projectTitle: null, senderEmail: null, 
      projectId: 0, subject: null, message: null 
    };
  }

  getMessageLimitInfo() {
    this.messageLimitLeft = (this.messageLimit - this.model.message.length);
    if (this.messageLimitLeft < 0) {
      this.model.message = this.model.message.substring(0, (this.messageLimit - 1));
    }
  }

  clear() {
    this.criteria = null;
    this.model.projectId = 0;
    this.isShowList = true;
    this.filteredProjectsList = this.projectsList;
  }

}
