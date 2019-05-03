import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-currency',
  templateUrl: './manage-currency.component.html',
  styleUrls: ['./manage-currency.component.css']
})
export class ManageCurrencyComponent implements OnInit {

  isBtnDisabled: boolean = false;
  currencyId: number = 0;
  btnText: string = 'Add currency';
  errorMessage: string = '';
  requestNo: number = 0;
  isForEdit: boolean = false;
  isError: boolean = false;
  model = { id: 0, currency: null, isDefault: false };
  entryForm: any = null;
  permissions: any = {};

  constructor(private currencyService: CurrencyService, private route: ActivatedRoute,
    private router: Router, private storeService: StoreService,
    private securityService: SecurityHelperService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit currency';
        this.isForEdit = true;
        this.currencyId = id;
        this.currencyService.getCurrency(id).subscribe(
          data => {
            if (data) {
              this.model.id = data.id;
              this.model.currency = data.currency;
              this.model.isDefault = data.isDefault;
            }
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
      this.requestNo = this.storeService.getNewRequestNumber();
    }

    this.requestNo = this.storeService.getNewRequestNumber();

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  saveCurrency(frm: any) {
    this.entryForm = frm;
    this.btnText = 'Saving...';
    this.isBtnDisabled = true;

    if (this.isForEdit) {
      if (this.currencyId) {
        this.currencyService.editCurrency(this.currencyId, this.model).subscribe(
          data => {
            if (data) {
              this.router.navigateByUrl('currencies');
            } else {
              this.resetFormState();
            }
          }
        )
      }
    } else {
      this.currencyService.addCurrency(this.model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('currencies');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
    }
  }

  toggleDefault() {
    if (this.model.isDefault) {
      this.model.isDefault = false;
    } else {
      this.model.isDefault = true;
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Currency';
    this.entryForm.resetForm();
  }

}
