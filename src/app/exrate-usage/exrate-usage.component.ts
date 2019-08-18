import { Component, OnInit } from '@angular/core';
import { ExRateUsageService } from '../services/exrate-usage.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Settings } from '../config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-exrate-usage',
  templateUrl: './exrate-usage.component.html',
  styleUrls: ['./exrate-usage.component.css']
})
export class ExrateUsageComponent implements OnInit {
  exRatesUsageList: any = [];
  isLoading: boolean = false;
  permissions: any = {};
  requestNo: number = 0;
  errorMessage: string = null;
  pagingSize: number = Settings.rowsPerPage;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private exRateUsageService: ExRateUsageService, private securityService: SecurityHelperService,
    private router: Router, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.getExRateUsageSettings();
  }

  getExRateUsageSettings() {
    this.exRateUsageService.getExRateUsageList().subscribe(
      data => {
        if (data) {
          this.exRatesUsageList = data;
        }
        this.isLoading = false;
      }
    );
  }

  edit(id: string) {
    if (id) {
      this.router.navigateByUrl('/manage-exchange-rate-usage/' + id);
    }
  }

  delete(id: string) {
    if (id) {
      this.blockUI.start('Wait deleting...');
      this.exRateUsageService.deleteExchangeRateUsage(id).subscribe(
        data => {
          if (data) {
            this.exRatesUsageList = this.exRatesUsageList.filter(e => e.id != id);
          }
          this.blockUI.stop();
        }
      );
    }
  }

}
