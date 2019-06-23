import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-project-membership',
  templateUrl: './project-membership.component.html',
  styleUrls: ['./project-membership.component.css']
})
export class ProjectMembershipComponent implements OnInit {
  projectData: any = {};
  selectedProjectId: number = 0;
  isShowSuccessMessage: boolean = false;
  requestNo: number = 0;
  successMessage: string = Messages.MEMBERSHIP_REQUEST_MESSAGE;
  errorMessage: string = null;
  isError: boolean = false;
  btnText: string = 'Apply for project membership';
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private router: Router, private route: ActivatedRoute, 
    private projectService: ProjectService, private errorModal: ErrorModalComponent,
    private storeService: StoreService) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      this.selectedProjectId = this.route.snapshot.params["{id}"];
      if (this.selectedProjectId) {
        this.loadProject(this.selectedProjectId);
      } else {
        this.router.navigateByUrl('home');
      }
    } else {
      this.router.navigateByUrl('home');
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  applyForProjectMembership() {
    this.blockUI.start('Wait submitting request...');
    this.projectService.applyForProjectMembership(this.selectedProjectId).subscribe(
      data => {
        if (data) {
          this.isShowSuccessMessage = true;
        }
        this.blockUI.stop();
      }
    );
  }

  loadProject(id) {
    this.projectService.getProject(id).subscribe(
      data => {
        if (data) {
          this.projectData = data;
        }
        this.blockUI.stop();
      }
    );
  }

  displayLongDateString(dated) {
    return this.storeService.getLongDateString(dated);
  }

}
