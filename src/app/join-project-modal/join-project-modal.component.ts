import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Messages } from '../config/messages';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'join-project-modal',
  templateUrl: './join-project-modal.component.html',
  styleUrls: ['./join-project-modal.component.css']
})
export class JoinProjectModalComponent implements OnInit {

  @Input()
  projectId: number = 0;

  isError: boolean = false;
  errorMessage: string = null;
  isSuccess: boolean = false;
  successMessage: string = null;
  isBtnDisabled: boolean = false;
  btnText: string = 'Apply for membership';

  membershipTypes: any = [
    { id: 1, typeName: 'Funder' },
    { id: 2, typeName: 'Implementer' }
  ];

  model: { membershipType: null };

  constructor(private projectService: ProjectService, private modalService: ModalService) { }

  ngOnInit() {
  }

  applyForProjectMembership() {
    if (this.projectId) {
      this.isBtnDisabled = true;
      this.btnText = 'Wait processing...';
      this.projectService.applyForProjectMembership(this.projectId).subscribe(
        data => {
          if (data) {
            this.successMessage = Messages.MEMBERSHIP_REQUEST_MESSAGE;

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
