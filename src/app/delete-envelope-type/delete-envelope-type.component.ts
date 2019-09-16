import { Component, OnInit } from '@angular/core';
import { EnvelopeTypeService } from '../services/envelope-type.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-delete-envelope-type',
  templateUrl: './delete-envelope-type.component.html',
  styleUrls: ['./delete-envelope-type.component.css']
})
export class DeleteEnvelopeTypeComponent implements OnInit {

  envelopeTypes: any = [];
  envelopeTypeId: string = null;
  requestNo: number = 0;
  errorMessage: string = null;
  model: any = { envelopeTypeId: 0};
  permissions: any = {};
  isLoading: boolean = true;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private envelopeTypeService: EnvelopeTypeService, private securityService: SecurityHelperService,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }
  
  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data) {
      this.envelopeTypeId = this.route.snapshot.params["{id}"];
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.getEnvelopeTypes();
  }

  getEnvelopeTypes() {
    this.envelopeTypeService.getAllEnvelopeTypes().subscribe(
      data => {
        if (data) {
          this.envelopeTypes = data.filter(d => d.id != this.envelopeTypeId);
        }
        this.isLoading = false;
      }
    );
  }

  deleteAndMapType() {
    if (!this.envelopeTypeId) {
      this.errorMessage = 'Id must be provided for the envelope type to be deleted';
      this.errorModal.openModal();
      return false;
    }

    if (!this.model.envelopeTypeId) {
      this.errorMessage = 'Please select envelope type to be mapped after this type is deleted';
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Wait deleting...');
    var id = parseInt(this.envelopeTypeId);
    this.envelopeTypeService.deleteEnvelopeType(id, this.model.envelopeTypeId).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('envelope-types');
        }
        this.blockUI.stop();
      }
    );
  }

}
