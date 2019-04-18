import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { EnvelopeService } from '../services/envelope-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  btnText: string = 'Save envelope data';
  permissions: any = {};
  userOrganizationId: number = 0;
  yearsList: any = [];
  envelopeData: any = {funderId: 0, funderName: '', totalFunds: 0.0, sectors: [], envelopeBreakups: []};
  envelopeBreakups: any = [];
  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }
    this.getFunderEnvelope();
  }

  getFunderEnvelope() {
    this.envelopeService.getEnvelopForFunder().subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
          if (this.envelopeData.envelopeBreakups) {
            this.envelopeBreakups = this.envelopeData.envelopeBreakups;
            this.yearsList = this.envelopeData.envelopeBreakups.map(y => y.year);
          }
        }
      }
    )
  }

  saveEnvelopeData() {
    var model = {
      funderId: this.envelopeData.funderId,
      envelopeBreakups: this.envelopeData.envelopeBreakups
    }

    this.blockUI.start('Saving envelope...');
    this.envelopeService.addEnvelope(model).subscribe(
      data => {
        if (data) {

        }
        this.blockUI.stop();
      }
    )
  }

  getSectorAllocation(percent: number, totalAmount: number) {
    return ((totalAmount / 100) * percent).toFixed(2);
  }

}
