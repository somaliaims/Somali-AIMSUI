import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-manage-currency',
  templateUrl: './manage-currency.component.html',
  styleUrls: ['./manage-currency.component.css']
})
export class ManageCurrencyComponent implements OnInit {

  isBtnDisabled: boolean = false;
  currencyId: number = 0;
  btnText: string = 'Add Currency';
  errorMessage: string = '';
  requestNo: number = 0;
  isError: boolean = false;
  model = { currency: null };
  entryForm: any = null;

  constructor(private currencyService: CurrencyService, private route: ActivatedRoute,
    private router: Router, private storeService: StoreService) {
  }

  ngOnInit() {
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
      this.currencyService.addCurrency(this.model).subscribe(
        data => {
          if (!this.isError) {
            //var message = 'New currency' + Messages.NEW_RECORD;
            //this.storeService.newInfoMessage(message);
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

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Currency';
    this.entryForm.resetForm();
  }

}
