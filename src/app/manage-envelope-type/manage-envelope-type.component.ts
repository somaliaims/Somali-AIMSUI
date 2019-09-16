import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { EnvelopeTypeService } from '../services/envelope-type.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-manage-envelope-type',
  templateUrl: './manage-envelope-type.component.html',
  styleUrls: ['./manage-envelope-type.component.css']
})
export class ManageEnvelopeTypeComponent implements OnInit {

  isBtnDisabled: boolean = false;
  envelopeTypeId: number = 0;
  btnText: string = 'Add envelope type';
  errorMessage: string = '';
  requestNo: number = 0;
  isForEdit: boolean = false;
  isError: boolean = false;
  model = { typeName: null };
  permissions: any = {};
  entryForm: any = null;

  constructor(private securityService: SecurityHelperService, private envelopeTypeService: EnvelopeTypeService,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelopeType) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit envelope type';
        this.isForEdit = true;
        this.envelopeTypeId = id;
        this.envelopeTypeService.getEnvelopeTypeById(id).subscribe(
          data => {
            if (data) {
              this.model.typeName = data.typeName;
            }
          }
        );
      }
      this.requestNo = this.storeService.getNewRequestNumber();
      this.storeService.currentRequestTrack.subscribe(model => {
        if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
          this.errorMessage = model.errorMessage;
        }
      });
    }
  }

  saveEnvelopeType(frm: any) {
    this.entryForm = frm;
    this.btnText = 'Saving...';
    this.isBtnDisabled = true;

    if (this.isForEdit) {
        this.envelopeTypeService.editEnvelopeType(this.envelopeTypeId, this.model).subscribe(
          data => {
            if (data) {
              this.router.navigateByUrl('envelope-types');
            } else {
              this.resetFormState();
            }
          }
        );
    } else {
      this.envelopeTypeService.addEnvelopeType(this.model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('envelope-types');
          } else {
            this.resetFormState();
          }
        }
      );
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add envelope type';
    this.entryForm.resetForm();
  }


}
