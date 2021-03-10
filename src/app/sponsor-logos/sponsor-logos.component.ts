import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
import { SponsorLogoService } from '../services/sponsor-logo.service';
import { StoreService } from '../services/store-service';
import { UrlHelperService } from '../services/url-helper-service';

@Component({
  selector: 'app-sponsor-logos',
  templateUrl: './sponsor-logos.component.html',
  styleUrls: ['./sponsor-logos.component.css']
})
export class SponsorLogosComponent implements OnInit {

  sponsors: any = [];
  filteredSponsors: any = [];
  isLoading: boolean = false;
  requestNo: number = 0;
  criteria: string = null;
  errorMessage: string = null;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};
  logosUrl: string = null;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private logoService: SponsorLogoService,
    private securityService: SecurityHelperService,
    private router: Router,
    private urlService: UrlHelperService) {
      this.logosUrl = this.urlService.getLogosUrl(); 
    }

  ngOnInit(): void {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSponsors) {
      this.router.navigateByUrl('home');
    }
    this.getSponsorLogos();
  }

  searchSponsors() {
    if (this.criteria != null) {
      this.filteredSponsors = this.sponsors.filter(s => s.title.toLowerCase().indexOf(this.criteria.toLowerCase()) != -1);
    }
  }

  getSponsorLogos() {
    this.blockUI.start('Loading sponsors...');
    this.logoService.getLogos().subscribe(
      data => {
        if (data) {
          this.sponsors = data.sponsorLogos;
          this.sponsors.forEach((s) => {
            s.logoPath = this.logosUrl + s.logoPath;
          });
          this.filteredSponsors = this.sponsors;
        }
        this.blockUI.stop();
      }
    );
  }

  edit(id: number) {
    /*if (id) {
      this.router.navigateByUrl('manage-sponsors/' + id.toString());
    }*/
  }

  delete(id: number) {

  }
}
