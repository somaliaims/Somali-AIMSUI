import { Component, OnInit } from '@angular/core';
import { CustomeFieldService } from '../services/custom-field.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-delete-field',
  templateUrl: './delete-field.component.html',
  styleUrls: ['./delete-field.component.css']
})

export class DeleteFieldComponent implements OnInit {
  projectsList: any = [];
  permissions: any = {};
  id: number = 0;
  requestNo: number = 0;
  errorMessage: string = null;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private customFieldService: CustomeFieldService, private securityService: SecurityHelperService,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data) {
      this.id = this.route.snapshot.params["{id}"];
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.getFieldProjects();
  }

  getFieldProjects() {
    this.customFieldService.getCustomFieldProjects(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
      }
    )  
  }

  deleteCustomField() {
    this.blockUI.start('Deleting location...');
    this.customFieldService.deleteCustomField(this.id).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('custom-fields');
        }
        this.blockUI.stop();
      }
    )
  }

}
