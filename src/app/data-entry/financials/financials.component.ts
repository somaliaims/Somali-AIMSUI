import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from 'src/app/services/store-service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css']
})
export class FinancialsComponent implements OnInit {

  @Input()
  projectId: number = 0;
  @Input()
  currenciesList: any = [];
  @Input()
  projectCurrency: string = null;
  @Input()
  exchangeRate: number = 0;
  @Input()
  projectValue: number = 0;
  @Input()
  projectDisbursements: any = [];
  @Input()
  exchangeRates: any = [];
  @Input()
  startingYear: number = 0;
  @Input()
  endingYear: number = 0;

  errorMessage: string = null;
  requestNo: number = 0;
  currentYear: any = 0;
  yearList: any = [];

  disbursementModel: any = { currency: null, projectValue: 0, exchangeRate: 0 };
  @BlockUI() blockUI: NgBlockUI;
  constructor(private storeService: StoreService, private errorModal: ErrorModalComponent,
    private projectService: ProjectService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.currentYear = this.storeService.getCurrentYear();
    this.disbursementModel.currency = this.projectCurrency;
    this.disbursementModel.projectValue = this.projectValue;
    this.setDisbursementsData();
    this.getExchangeRateForCurrency();
  }

  indexTracker(index: number) {
    return index;
  }

  getExchangeRateForCurrency() {
    if (this.disbursementModel.currency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.disbursementModel.currency);
      if (exRate.length > 0) {
        this.exchangeRate = exRate[0].rate;
      }
    } else {
      this.exchangeRate = 1;
    }
  }

  setDisbursementsData() {
    for (var yr = this.startingYear; yr <= this.endingYear; yr++) {
      var data = this.projectDisbursements.filter(d => d.year == yr);
      if (data.length == 0) {

        if (yr <= this.currentYear) {
          var newDisbursement = {
            year: yr,
            currency: this.projectCurrency,
            exchangeRate: 1,
            disbursementType: 1,
            amount: 0
          };
          this.projectDisbursements.push(newDisbursement);
        }

        if (yr >= this.currentYear) {
          var newDisbursement = {
            year: yr,
            currency: this.projectCurrency,
            exchangeRate: 1,
            disbursementType: 2,
            amount: 0
          };
          this.projectDisbursements.push(newDisbursement);
        }
      }
    }
  }

  handleNullAmount(amount: number) {
    if (amount == null) {
      return 0;
    }
    return amount;
  }

  setDisbursementForYear(e) {
    var newValue = e.target.value;
    if (newValue < 0) {
      this.errorMessage = Messages.NEGATIVE_DISBURSEMENT;
      this.errorModal.openModal();
      e.target.value = 0;
      return false;
    }
    var arr = e.target.id.split('-');
    var year = arr[1];
    var disbursementType = arr[2];

    var disbursement = this.projectDisbursements.filter(d => d.year == year && d.disbursementType == disbursementType);
    if (disbursement.length > 0) {
      disbursement.amount = newValue;
    }
  }

  saveDisbursements(frm: any) {
    if (this.projectDisbursements.length > 0) {
      var isDataValid = true;
      this.projectDisbursements.forEach(d => {
        if (isNaN(d.amount)) {
          this.errorMessage = 'Invalid amount entered for year: ' + d.year;
          this.errorModal.openModal();
          isDataValid = false;
        }
      });

      if (isDataValid) {
        this.blockUI.start('Saving disbursements');
        var model = {
          projectId: this.projectId,
          currency: this.projectCurrency,
          exchangeRate: this.exchangeRate,
          yearlyDisbursements: this.projectDisbursements
        };
        this.projectService.addProjectDisbursement(model).subscribe(
          data => {
            if (data) {
            }
            this.blockUI.stop();
          }
        );
      }
    }
  }
  
}
