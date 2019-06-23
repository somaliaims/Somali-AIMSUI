import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-membership-requests',
  templateUrl: './membership-requests.component.html',
  styleUrls: ['./membership-requests.component.css']
})
export class MembershipRequestsComponent implements OnInit {
  projectRequests: any = [];
  requestNo: number = 0;
  errorMessage: string = null;
  isLoading: boolean = true;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private projectService: ProjectService, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    //this.getProjectRequests();
  }

  
}
