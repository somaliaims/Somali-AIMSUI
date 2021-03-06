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
import { faBuilding, faMoneyCheck, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { DocumentLinkService } from '../services/document-link.service';
import { SponsorLogoService } from '../services/sponsor-logo.service';
import { UrlHelperService } from '../services/url-helper-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faBuilding: any = faBuilding;
  faMoneyCheck: any = faMoneyCheck;
  faTasks: any = faTasks;
  faUser: any = faUser;
  infoMessage: string = null;
  showMessage: boolean = false;
  isProjectsLoading: boolean = true;
  isSponsorsLoading: boolean = true;
  isIntroLoading: boolean = true;
  isLinkLoading: boolean = true;
  usersCount: number = 0;
  projectsCount: number = 0;
  organizationsCount: number = 0;
  currentYearDisbursements: number = 0;
  defaultCurrency: string = null;
  defaultCurrencyCode: string = null;
  currentYear: number = 0;
  currentFinancialYear: string = 'FY...';
  model: any = { aimsTitle: null, introductionHeading: null, introductionText: null };
  latestProjects: any = [];
  links: any = [];
  sponsors: any = [];
  requestNo: number = 0;
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
    private embedService: EmbedVideoService,
    private documentService: DocumentLinkService,
    private sponsorService: SponsorLogoService,
    private urlService: UrlHelperService
    ) { }

  ngOnInit() {
    this.yt_video1_frame = this.embedService.embed(this.videoOneUrl, {
      attr: {width: '100%', height: '250px'}
    });
    this.yt_video2_frame = this.embedService.embed(this.videoTwoUrl, {
      attr: {width: '100%', height: '250px'}
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

    this.getCurrentYearDisbursements();
    this.getHomePageSettings();
    this.getUsersCount();
    this.getProjectsCount();
    this.getOrganizationsCount();
    this.getDefaultCurrency();
    this.getLatestProjects();
    this.getDocumentLinks();
    this.getSponsors();
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
          this.currentYear = data.currentYear;
          this.currentFinancialYear = data.financialYear;
          this.currentYearDisbursements = Math.round(data.disbursements);
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
          this.defaultCurrencyCode = (data.defaultCurrency) ? data.defaultCurrency : null;
          this.latestProjects = (data.projects) ? data.projects : [];
        }
        this.isProjectsLoading = false;
      }
    );
  }

  getDocumentLinks() {
    this.documentService.getDocumentLinks().subscribe(
      data => {
        if (data) {
          this.links = data;
        }
        this.isLinkLoading = false;
      }
    );
  }

  getSponsors() {
    var logosBaseUrl = this.urlService.getLogosUrl();
    this.sponsorService.getLogos().subscribe(
      data => {
        if (data) {
          this.sponsors = data.sponsorLogos; 
          this.sponsors.forEach((s) => {
            s.logoPath = logosBaseUrl + s.logoPath;
          });
        }
        this.isSponsorsLoading = false;
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
