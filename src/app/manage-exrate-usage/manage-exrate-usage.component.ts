import { Component, OnInit } from '@angular/core';
import { ExRateUsageService } from '../services/exrate-usage.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  model: any = { source: null, usageSection: null, order: null };

  sources: any = [
    { id: 1, text: 'Open Exchange', code: 'OpenExchange' },
    { id: 2, text: 'Central Bank', code: 'CentralBank' }
  ];

  usageSections: any = [
    { id: 1, text: 'Data entry', code: 'DataEntry' },
    { id: 2, text: 'Reporting', code: 'Reporting' }
  ];

  orderNumbers: any = [1, 2];

  constructor(private exRateUsageService: ExRateUsageService, private securityService: SecurityHelperService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCurrency) {
      this.router.navigateByUrl('home');
    }

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.getExrateUsage(id);
      }
    }
  }

  getExrateUsage(id: string) {
    this.exRateUsageService.getExRateUsageById(id).subscribe(
      data => {
        if (data) {
          this.model.source = data.source;
          this.model.usageSection = data.usageSection;
          this.model.order = data.order;
        }
      }
    );
  }

  saveExRateUsage(frm: any) {
    this.btnText = 'Saving data...';
    this.isBtnDisabled = true;
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
