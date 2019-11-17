import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'create-org-modal',
  templateUrl: './create-org-modal.component.html',
  styleUrls: ['./create-org-modal.component.css']
})
export class CreateOrgModalComponent implements OnInit {
  organization: string = null;
  isError: boolean = false;
  organizationTypes: any = [];
  model: any = { id: null, organizationTypeId: null, organizationName: null };
  isBtnDisabled: boolean = false;
  btnText: string = 'Save organization';
  isDataLoading: boolean = true;

  @Output() 
  organizationCreated = new EventEmitter<any>();
  
  constructor(private organizationService: OrganizationService, private modalService: ModalService) { }

  ngOnInit() {
    this.getOrganizationTypes();
  }

  saveOrganization() {
    this.isBtnDisabled = true;
    this.btnText = 'Saving...';
    this.organizationService.addOrganization(this.model).subscribe(
      data => {
        if (data) {
          this.model.id = data;
          this.updateFundersImplementers();
          setTimeout(() => {
            this.modalService.close('org-modal');
          }, 1000);
        }
        this.isBtnDisabled = false;
        this.btnText = 'Save organization';
      }
    );
  }

  openModal() {
    this.modalService.open('create-org-modal');
  }

  closeModal() {
    this.modalService.close('create-org-modal');
  }

  getOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
        this.isDataLoading = false;
      }
    );
  }

  updateFundersImplementers() {
    this.organizationCreated.emit(this.model);
  }

}
