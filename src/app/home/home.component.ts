import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import {Settings} from '../config/settings';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user-service';
import { OrganizationService } from '../services/organization-service';
import { ProjectService } from '../services/project.service';
import { CurrencyService } from '../services/currency.service';
import { HomePageService } from '../services/home-page.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  infoMessage: string = null;
  showMessage: boolean = false;
  isProjectsLoading: boolean = true;
  isIntroLoading: boolean = true;
  usersCount: number = 0;
  projectsCount: number = 0;
  organizationsCount: number = 0;
  currentYearDisbursements: number = 0;
  defaultCurrency: string = null;
  currentYear: number = 0;
  model: any = { aimsTitle: null, introductionHeading: null, introductionText: null };
  latestProjects: any = [];
  safeSrcVideoOne: SafeResourceUrl;
  safeSrcVideoTwo: SafeResourceUrl;
  yt_video1_frame: any;
  yt_video2_frame: any;
  videoOneUrl: string = "https://www.youtube.com/watch?v=DYG0VayhKcs";
  videoTwoUrl: string = "https://www.youtube.com/watch?v=H_n8DjUbCmk";
  
  constructor(private storeService: StoreService, private route: ActivatedRoute,
    private userService: UserService, private organizationService: OrganizationService,
    private projectService: ProjectService, private currencyService: CurrencyService,
    private homePageService: HomePageService, private router: Router,
    private embedService: EmbedVideoService
    ) { }

  ngOnInit() {
    this.yt_video1_frame = this.embedService.embed(this.videoOneUrl, {
      attr: {width: '100%', height: '350px'}
    });
    this.yt_video2_frame = this.embedService.embed(this.videoTwoUrl, {
      attr: {width: '100%', height: '350px'}
    });
    this.storeService.newReportItem(Settings.dropDownMenus.home);
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.currentYear = this.storeService.getCurrentYear();
    this.getCurrentYearDisbursements();
    this.getHomePageSettings();
    this.getUsersCount();
    this.getProjectsCount();
    this.getOrganizationsCount();
    this.getDefaultCurrency();
    this.getLatestProjects();
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currencyName;
        }
      }
    );
  }

  getUsersCount() {
    this.userService.getUsersCount().subscribe(
      data => {
        if (data) {
          this.usersCount = data;
        }
      }
    );
  }

  getProjectsCount() {
    this.projectService.getProjectsCount().subscribe(
      data => {
        if (data) {
          this.projectsCount = data;
        }
      }
    );
  }

  getOrganizationsCount() {
    this.organizationService.getOrganizationsCount().subscribe(
      data => {
        if (data) {
          this.organizationsCount = data;
        }
      }
    );
  }

  getCurrentYearDisbursements() {
    this.projectService.getCurrentYearsDisbursements().subscribe(
      data => {
        if (data) {
          this.currentYearDisbursements = Math.round(data);
        }
      }
    );
  }

  getHomePageSettings() {
    this.homePageService.getHomePageSettings().subscribe(
      data => {
        if (data) {
          this.model = data;
        }
        this.isIntroLoading = false;
      }
    );
  }

  getLatestProjects() {
    this.projectService.getLatestProjects().subscribe(
      data => {
        if (data) {
          this.latestProjects = data;
        }
        this.isProjectsLoading = false;
      }
    );
  }

  viewProjectDetail(id) {
    if (id) {
      this.router.navigateByUrl('view-project/' + id);
    }
  }

  formatNumberWithCommas(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

}
