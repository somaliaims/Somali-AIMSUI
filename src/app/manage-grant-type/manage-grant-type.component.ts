import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrantTypeService } from '../services/grant-type.service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-grant-type',
  templateUrl: './manage-grant-type.component.html',
  styleUrls: ['./manage-grant-type.component.css']
})
export class ManageGrantTypeComponent implements OnInit {
  id: number = 0;
  isForEdit: boolean = false;
  btnText: string = 'Save grant type';
  model: any = { grantType: null };
  isBtnDisabled: boolean = false;
  requestNo: number = 0;
  errorMessage: string = null;
  isError: boolean = false;
  permissions: any = {};

  constructor(private route: ActivatedRoute, private grantTypeService: GrantTypeService,
    private storeService: StoreService, private router: Router, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditGrantType) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit grant type';
        this.isForEdit = true;
        this.id = id;
        this.getGrantType();
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

  getGrantType() {
    this.grantTypeService.getGrantType(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.model.grantType = data.grantType
        }
      }
    );
  }

  saveGrantType() {
    var model = {
      grantType: this.model.grantType,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.grantTypeService.updateGrantType(this.model.id, model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('grant-types');
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
      this.grantTypeService.addGrantType(model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('grant-types');
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
      this.btnText = 'Edit grant type';
    } else {
      this.btnText = 'Add grant type';
    }
  }

}
