import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { ModalService } from '../services/modal.service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'create-org-modal',
  templateUrl: './create-org-modal.component.html',
  styleUrls: ['./create-org-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class CreateOrgModalComponent implements OnInit {
  newOrganizations: any = [];
  organizationForm: any = null;
  organization: string = null;
  isError: boolean = false;
  errorMessage: string = null;
  isSuccess: boolean = false;
  successMessage: string = Messages.ORG_CREATED_ADD_ANOTHER;
  organizationTypes: any = [];
  model: any = { organizationTypeId: null, name: null };
  isBtnDisabled: boolean = false;
  btnText: string = 'Save organization';
  isDataLoading: boolean = true;
  requestNo: number = 0;

  @Output() 
  organizationCreated = new EventEmitter<any>();
  
  constructor(private organizationService: OrganizationService, private modalService: ModalService,
    private storeService: StoreService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
        this.isBtnDisabled = false;
        this.btnText = 'Save organization';
      }
    });
    this.getOrganizationTypes();
  }

  saveOrganization(frm: any) {
    this.isSuccess = false;
    this.isBtnDisabled = true;
    this.organizationForm = frm;
    this.btnText = 'Saving...';
    if (this.model.organizationTypeId) {
      this.model.organizationTypeId = parseInt(this.model.organizationTypeId);
      this.organizationService.addOrganization(this.model).subscribe(
        data => {
          if (data) {
            this.model.id = data;
            var model = {
              id: this.model.id,
              organizationName: this.model.name,
              sourceType: 'User',
              organizationTypeId: this.model.organizationTypeId
            }
            this.newOrganizations.push(model);
            this.isSuccess = true;
            this.model.organizationTypeId = null;
            this.model.name = null;
            this.model.id = 0;
            this.isBtnDisabled = false;
            this.btnText = 'Save organization';
            this.organizationForm.resetForm();
            /*this.updateFundersImplementers();
            setTimeout(() => {
              this.modalService.close('create-org-modal');
            }, 1000);*/
          }
        }
      );
    }
    
  }

  openModal() {
    this.modalService.open('create-org-modal');
  }

  closeModal() {
    if (this.newOrganizations.length > 0) {
      this.model.sourceType = 'User';
      this.organizationCreated.emit(this.newOrganizations);
    }
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
    /*var model = {
      id: this.model.id,
      organizationName: this.model.name,
      sourceType: 'User',
      organizationTypeId: this.model.organizationTypeId
    }*/

    this.model.sourceType = 'User';
    //this.organizationCreated.emit(model);
    this.organizationCreated.emit(this.newOrganizations);
    this.modalService.close('create-org-modal');
  }

}
