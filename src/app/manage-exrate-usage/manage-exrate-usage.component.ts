import { Component, OnInit } from '@angular/core';
import { ExRateUsageService } from '../services/exrate-usage.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-manage-exrate-usage',
  templateUrl: './manage-exrate-usage.component.html',
  styleUrls: ['./manage-exrate-usage.component.css']
})
export class ManageExrateUsageComponent implements OnInit {
  permissions: any = {};
  eUsageId: number = 0;
  btnText: string = 'Save setting';
  isBtnDisabled: boolean = false;
  isForEdit: boolean = false;
  requestNo: number = 0;
  errorMessage: string = null;
  model: any = { id: 0, source: null, usageSection: null, order: null };

  sources: any = [
    { id: 1, text: 'Open Exchange', code: 'OpenExchange' },
    { id: 2, text: 'Central Bank', code: 'CentralBank' }
  ];

  usageSections: any = [
    { id: 1, text: 'Data entry', code: 'DataEntry' },
    { id: 2, text: 'Reporting', code: 'Reporting' }
  ];

  sourcesCodes: any = {
    'OpenExchange': 1,
    'CentralBank': 2
  };

  usageSectionCodes: any = {
    'DataEntry': 1,
    'Reporting': 2
  };

  orderNumbers: any = [1, 2];

  constructor(private exRateUsageService: ExRateUsageService, private securityService: SecurityHelperService,
    private router: Router, private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.isForEdit = true;
        this.getExrateUsage(id);
      }
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  getExrateUsage(id: string) {
    this.exRateUsageService.getExRateUsageById(id).subscribe(
      data => {
        if (data) {
          this.model.id = id;
          this.model.source = this.sourcesCodes[data.source];
          this.model.usageSection = this.usageSectionCodes[data.usageSection];
          this.model.order = data.order;
        }
      }
    );
  }

  saveExRateUsage(frm: any) {
    this.btnText = 'Saving data...';
    this.isBtnDisabled = true;

    if (this.isForEdit) {
      this.exRateUsageService.editExchangeRateUsage(this.model.id, this.model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('exchange-rate-usage');
          } else {
            this.btnText = 'Save settings';
            this.isBtnDisabled = false;
          }
        }
      );
    } else {
      this.exRateUsageService.saveExchangeRateUsage(this.model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('exchange-rate-usage');
          } else {
            this.btnText = 'Save settings';
            this.isBtnDisabled = false;
          }
        }
      );
    }
  }

}
