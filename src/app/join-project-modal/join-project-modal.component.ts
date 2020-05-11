import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Messages } from '../config/messages';
import { ModalService } from '../services/modal.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'join-project-modal',
  templateUrl: './join-project-modal.component.html',
  styleUrls: ['./join-project-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class JoinProjectModalComponent implements OnInit {

  @Input()
  projectId: number = 0;

  isError: boolean = false;
  errorMessage: string = null;
  isSuccess: boolean = false;
  successMessage: string = null;
  isBtnDisabled: boolean = false;
  requestNo: number = 0;
  btnText: string = 'Apply for membership';

  membershipTypes: any = [
    { id: 1, typeName: 'Funder' },
    { id: 2, typeName: 'Implementer' }
  ];


  model : any = { membershipTypeId: 1 };

  constructor(private projectService: ProjectService, private modalService: ModalService,
    private storeService: StoreService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  applyForProjectMembership() {
    if (this.projectId) {
      this.isBtnDisabled = true;
      this.btnText = 'Wait processing...';
      var model = {
        membershipType: this.model.membershipTypeId,
        projectId: this.projectId
      };
      this.projectService.applyForProjectMembership(model).subscribe(
        data => {
          if (data) {
            this.isSuccess = true;
            this.successMessage = Messages.MEMBERSHIP_REQUEST_MESSAGE;
            this.btnText = 'Membership requested';
            setTimeout(() => {
              this.closeModal();
            }, 3000);
          }
          this.btnText = 'Apply for membership';
          this.isBtnDisabled = false;
        }
      );
    }
  }

  openModal() {
    this.modalService.open('join-project-modal');
  }

  closeModal() {
    this.modalService.close('join-project-modal');
  }

}
