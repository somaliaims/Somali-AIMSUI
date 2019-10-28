import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FundingTypeService } from '../services/funding-type.service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-manage-funding-type',
  templateUrl: './manage-funding-type.component.html',
  styleUrls: ['./manage-funding-type.component.css']
})
export class ManageFundingTypeComponent implements OnInit {
  id: number = 0;
  isForEdit: boolean = false;
  btnText: string = 'Save funding type';
  model: any = { fundingType: null };
  isBtnDisabled: boolean = false;
  requestNo: number = 0;
  errorMessage: string = null;
  isError: boolean = false;
  permissions: any = {};

  constructor(private route: ActivatedRoute, private fundingTypeService: FundingTypeService,
    private storeService: StoreService, private router: Router, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditFundingType) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit funding type';
        this.isForEdit = true;
        this.id = id;
        this.getFundingType();
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

  getFundingType() {
    this.fundingTypeService.getFundingType(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.model.fundingType = data.fundingType
        }
      }
    );
  }

  saveFundingType() {
    var model = {
      fundingType: this.model.fundingType,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.fundingTypeService.updateFundingType(this.id, model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('funding-types');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.resetFormState();
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.fundingTypeService.addFundingType(model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('funding-types');
          } 
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
        }
      );
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    if (this.isForEdit) {
      this.btnText = 'Edit funding type';
    } else {
      this.btnText = 'Add funding type';
    }
  }

}
