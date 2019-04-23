import { Component, OnInit } from '@angular/core';
import { CustomeFieldService } from '../services/custom-field.service';
import { Settings } from '../config/settings';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../services/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-custom-fields',
  templateUrl: './manage-custom-fields.component.html',
  styleUrls: ['./manage-custom-fields.component.css']
})
export class ManageCustomFieldsComponent implements OnInit {
  isBtnDisbaled: boolean = false;
  requestNo: number = 0;
  fieldTypes: any = [];
  dateModel: NgbDateStruct;
  isForEdit: boolean = false;
  btnText: string = 'Save custom field';
  fieldId: number = 0;
  errorMessage: string = null;
  isError: boolean = false;
  permissions: any = {};

  model: any = { fieldType: null, fieldTitle: null, activeFrom: null, activeUpto: null };

  constructor(private customFieldService: CustomeFieldService, private route: ActivatedRoute,
    private router: Router, private storeService: StoreService,
    private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }

    this.fieldTypes = Settings.customFieldTypes;
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Location';
        this.isForEdit = true;
        this.fieldId = id;
        this.customFieldService.getCustomFieldById(id).subscribe(
          data => {
            this.model.fieldType = data.fieldType;
            this.model.fieldTitle = data.fieldTitle;
            this.model.values = data.values;

            var activeFrom = new Date(data.activeFrom);
            var activeUpto = new Date(data.activeUpto);
            this.model.activeFrom = { year: activeFrom.getFullYear(), month: (activeFrom.getMonth() + 1), day: activeFrom.getDate() };
            this.model.activeUpto = { year: activeUpto.getFullYear(), month: (activeUpto.getMonth() + 1), day: activeUpto.getDate() };
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  saveCustomField(model: any) {
    this.btnText = 'Saving...';
    this.isBtnDisbaled = true;
    this.customFieldService.saveCustomField(model).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('custom-fields');
        }
        this.isBtnDisbaled = false;
      }
    );
  }

  updateCustomField(model: any) {
    this.btnText = 'Updating...';
    this.isBtnDisbaled = true;
    this.customFieldService.updateCustomField(model).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('custom-fields');
        }
        this.isBtnDisbaled = false;
      }
    );
  }

}
