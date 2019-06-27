import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { ContactService } from '../services/contact.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  isLoggedIn: boolean = false;
  errorMessage: string = null;
  successMessage: string = null;
  isShowSuccessMessage: boolean = false;
  projectsList: any = [];
  filteredProjectsList: any = [];
  projectCriteria: string = null;

  model: any = { emailType: null, senderName: null, senderEmail: null, 
    projectId: 0, subject: null, message: null 
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
    private projectService: ProjectService) {

    this.isLoggedIn = this.securityService.checkIsLoggedIn();
  }

  ngOnInit() {
    
  }

  sendEmailRequest() {
    if (this.model.emailType == this.emailTypeCodes.INFORMATION && this.model.projectId <= 0) {
      this.errorMessage = Messages.PROJECT_FOR_INFORMATION_REQUIRED;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Submitting request...');
    this.contactService.sendContactEmail(this.model).subscribe(
      data => {
        if (data) {
          this.successMessage = "Your request is submitted successfully";
          this.isShowSuccessMessage = true;
        }
        this.blockUI.stop();
      }
    );
  }

  getProjects() {
    this.projectService.getProjectsList().subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
      }
    );
  }

  filterProjects() {
    if (!this.criteria) {
      if (this.model.sectorTypeId == 0) {
        this.filteredSectorsList = this.sectorsList;
      } else {
        this.filteredSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.model.sectorTypeId);
      }
    } else {
      if (this.sectorsList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        if (this.model.sectorTypeId > 0) {
          this.filteredSectorsList = this.sectorsList.filter(s => (s.sectorTypeId == this.model.sectorTypeId && s.sectorName.toLowerCase().indexOf(criteria) != -1));
        } else {
          this.filteredSectorsList = this.sectorsList.filter(s => (s.sectorName.toLowerCase().indexOf(criteria) != -1));
        }
      }
    }
  }

}
