import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ContactService } from '../services/contact.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';

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
  isError: boolean = false;
  requestNo: number = 0;

  model = { senderName: null, senderEmail: null, suggestionType: null, subject: null, message: null, 
    projectId: 0, projectTitle: null };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private contactService: ContactService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.model.projectId = id;
        this.getProjectInfo(id);
      }
    } else {
      this.router.navigateByUrl('home');
    }

    this.requestNo = this.storeService.getNewRequestNumber();

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  sendSugggestion(frm: any) {
    if (this.model.projectId == 0) {
      this.errorMessage = 'Select a valid project before proceeding with this request';
      this.errorModal.openModal();
      return false;
    }
    
    this.contactService.sendProjectContactEmail(this.model).subscribe(
      data => {
        if (data) {
          this.successMessage = 'Your suggestion for the project is forwarded successfully';
          this.isSuccess = true;
          frm.resetForm();
        }
      }
    );
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

}
