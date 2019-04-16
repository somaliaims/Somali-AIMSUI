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
  permissions: any = {};
  userOrganizationId: number = 0;
  envelopeData: any = {funderId: 0, funderName: '', totalFunds: 0.0, sectors: [], envelopeBreakups: []};

  @BlockUI() blockUI: NgBlockUI;
  constructor(private securityService: SecurityHelperService, private router: Router,
    private envelopeService: EnvelopeService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelope) {
      this.router.navigateByUrl('home');
    }
    this.userOrganizationId = parseInt(localStorage.getItem('organizationId'));
  }

  getFunderEnvelope() {
    this.envelopeService.getEnvelopForFunder(this.userOrganizationId).subscribe(
      data => {
        if (data) {
          this.envelopeData = data;
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

}
