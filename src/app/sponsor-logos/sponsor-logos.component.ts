import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { SponsorLogoService } from '../services/sponsor-logo.service';

@Component({
  selector: 'app-sponsor-logos',
  templateUrl: './sponsor-logos.component.html',
  styleUrls: ['./sponsor-logos.component.css']
})
export class SponsorLogosComponent implements OnInit {

  sponsorLogos: any = [];
  isLoading: boolean = false;
  requestNo: number = 0;
  pagingSize: number = Settings.rowsPerPage;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private logoService: SponsorLogoService,
    private router: Router) { }

  ngOnInit(): void {
    this.getSponsorLogos();
  }

  getSponsorLogos() {
    this.blockUI.start('Loading sponsors...');
    this.logoService.getLogos().subscribe(
      data => {
        if (data) {
          this.sponsorLogos = data;
        }
        this.blockUI.stop();
      }
    );
  }

  edit(id: number) {
    if (id) {
      this.router.navigateByUrl('manage-sponsors/' + id.toString());
    }
  }

  delete(id: number) {

  }
}
