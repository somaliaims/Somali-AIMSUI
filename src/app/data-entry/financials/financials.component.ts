import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoreService } from 'src/app/services/store-service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from 'src/app/services/project.service';
import { HelpService } from 'src/app/services/help-service';

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
  @Input()
  aimsProjects: any = [];
  @Input()
  iatiProjects: any = [];

  @Output()
  disbursementsChanged = new EventEmitter<any[]>();
  @Output()
  proceedToSectors = new EventEmitter();

  help: any = { disbursementActual: null, disbursementPlanned: null };
  projectHelp: any = { title: null, startingFinancialYear: null, endingFinancialYear: null,
    description: null, projectValue: null, projectCurrency: null, fundingType: null,
    startDate: null, endDate: null};

  errorMessage: string = null;
  unsavedDisbursementsMessage: string = Messages.UNSAVED_DISBURSEMENTS;
  requestNo: number = 0;
  disbursementsTotalOnLoad: number = 0;
  disbursementsTotal: number = 0;
  currentYear: any = 0;
  yearList: any = [];
  disbursementModel: any = { currency: null, projectValue: 0, exchangeRate: 0 };
  tabConstants: any = {
    FINANCIALS: 'financials',
    FINANCIALS_SOURCE: 'financials_source'
  };
  disbursementTypeConstants: any = {
    1: 'Actual',
    2: 'Planned'
  };
  disbursementTypeCodes: any = {
    ACTUAL: 1,
    PLANNED: 2
  };

  currentTab: string = this.tabConstants.FINANCIALS;
  isSourceAvailable: boolean = false;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private storeService: StoreService, private errorModal: ErrorModalComponent,
    private projectService: ProjectService,
    private helpService: HelpService) { }

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
    //this.setDisbursementsData();
    this.getExchangeRateForCurrency();
    this.getProjectHelp();
    this.getHelp();
    this.calculateDisbursementsTotal();
    this.disbursementsTotalOnLoad = this.disbursementsTotal;
  }

  ngOnChanges() {
    if (this.aimsProjects.length > 0 || this.iatiProjects.length > 0) {
      this.isSourceAvailable = true;
    }
  }

  indexTracker(index: number) {
    return index;
  }

  getHelp() {
    if (!this.help.disbursementActual) {
      this.helpService.getProjectDisbursementsHelpFields().subscribe(
        data => {
          this.help = data;
        }
      );
    }
  }

  getProjectHelp() {
    if (!this.projectHelp.projectValue) {
      this.helpService.getProjectHelpFields().subscribe(
        data => {
          this.projectHelp = data;
        }
      );
    }
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
    this.projectDisbursements = this.projectDisbursements.filter(d => (d.year >= this.startingYear && d.year <= this.endingYear));
    for (var yr = this.startingYear; yr <= this.endingYear; yr++) {
      var data = this.projectDisbursements.filter(d => d.year == yr);
      if (data.length == 0) {

        if (yr <= this.currentYear) {
          var newDisbursement = {
            financialYear: yr,
            currency: this.projectCurrency,
            exchangeRate: 1,
            disbursementType: 1,
            amount: 0
          };
          this.projectDisbursements.push(newDisbursement);
        }

        if (yr >= this.currentYear) {
          var newDisbursement = {
            financialYear: yr,
            currency: this.projectCurrency,
            exchangeRate: 1,
            disbursementType: 2,
            amount: 0
          };
          this.projectDisbursements.push(newDisbursement);
        }
      }
    }

    if (this.projectDisbursements.length > 0) {
      this.projectDisbursements.sort((a, b) => parseFloat(a.year) - parseFloat(b.year));
      this.calculateDisbursementsTotal();
    }
  }

  calculateDisbursementsTotal() {
    var totalAmount = 0;
    if (this.projectDisbursements.length > 0) {
      this.projectDisbursements.forEach((d) => {
        if (!d.amount) {
          d.amount = 0;
        }
        totalAmount += parseFloat(d.amount);
      });
    }
    this.disbursementsTotal = Math.ceil(totalAmount);
  }

  getDisbursementsTotal() {
    var totalAmount = 0;
    if (this.projectDisbursements.length > 0) {
      this.projectDisbursements.forEach((d) => {
        if (!d.amount) {
          d.amount = 0;
        }
        totalAmount += parseFloat(d.amount);
      });
    }
    return totalAmount;
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

  enterIATIDisbursement(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var disbursementId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var transactions = selectProject[0].disbursementTransactions;
      var selectTransaction = transactions.filter(i => i.id == disbursementId);
      if (selectTransaction && selectTransaction.length > 0) {
        var amount = selectTransaction[0].amount;
        var dated = selectTransaction[0].dated;
        
        if (dated && dated.length > 0) {
          var dateArr = dated.split('-');
          var year = parseInt(dateArr[0]);

          var disbursement = this.projectDisbursements.filter(d => d.year == year);
          if (disbursement.length > 0) {
            disbursement[0].amount = amount;
          }
        }
      }
    }
    this.calculateDisbursementsTotal();
  }

  splitRemainingAmountEqually() {
    var projectValue = this.projectValue;
    var disbursementsTotal = this.getDisbursementsTotal();
    var remainingAmount = projectValue - disbursementsTotal; 
    if (remainingAmount > 0) {
      var countZeros = 0;
      this.projectDisbursements.forEach((d) => {
        if (d.disbursementType == 2) {
          countZeros = (d.amount == 0) ? ++countZeros : countZeros;
        }
      });

      if (countZeros > 0) {
        var equalSplit = (remainingAmount / countZeros).toFixed(1);
         this.projectDisbursements.forEach((d) => {
          if (d.amount == 0 && d.disbursementType == 2) {
            d.amount = equalSplit;
          }
         });
         this.calculateDisbursementsTotal();
      } else {
        this.errorMessage = Messages.INVALID_DISBURSEMENT_SPLIT;
        this.errorModal.openModal();
      }
    }
  }

  enterAIMSDisbursement(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var year = arr[2];
    var type = arr[3];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var disbursements = selectProject[0].disbursements;
      var selectTransaction = disbursements.filter(i => i.year == year && i.disbursementType == type);
      if (selectTransaction && selectTransaction.length > 0) {
        var amount = selectTransaction[0].amount;

        if (year && year > 0) {
          var disbursement = this.projectDisbursements.filter(d => d.year == year && d.disbursementType == type);
          if (disbursement.length > 0) {
            disbursement[0].amount = amount;
          }
        }
      }
    }
    this.calculateDisbursementsTotal();
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

      if (!isDataValid) {
        return false;
      }

      var totalDisbursements = 0;
      this.projectDisbursements.forEach(d => {
        totalDisbursements = (d.disbursement * d.exchangeRate);
      });

      if (totalDisbursements > (this.projectValue * this.exchangeRate)) {
        this.errorMessage = '';
        this.errorModal.openModal();
        return false;
      }

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
              this.disbursementsTotalOnLoad = this.disbursementsTotal;
              this.updateDisbursementsToParent();
              this.currentTab = this.tabConstants.FINANCIALS;
            }
            this.blockUI.stop();
          }
        );
      }
    }
  }

  updateDisbursementsToParent() {
    this.disbursementsChanged.emit(this.projectDisbursements);
  }

  showSource() {
    this.currentTab = this.tabConstants.FINANCIALS_SOURCE;
  }

  showFinancials() {
    this.currentTab = this.tabConstants.FINANCIALS;
  }

  displayNull(val: string) {
    return val ? val : 'N/a';
  }

  checkIfCurrentActual(year, type) {
    if (this.currentYear == year && type == 1) {
      return true;
    }
    return false;
  }

  checkIfCurrentPlanned(year, type) {
    if (this.currentYear == year && type == 2) {
      return true;
    }
    return false;
  }

  checkIfFuturePlanned(year, type) {
    if ((this.currentYear + 1) == year && type == 2) {
      return true;
    }
    return false;
  }

  proceedToNext() {
    if (this.disbursementsTotalOnLoad != this.disbursementsTotal) {
      this.errorMessage = this.unsavedDisbursementsMessage;
      this.errorModal.openModal();
      return false;
    }
    this.proceedToSectors.emit();
  }
  
}
