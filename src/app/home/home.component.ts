import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import {Settings} from '../config/settings';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user-service';
import { OrganizationService } from '../services/organization-service';
import { ProjectService } from '../services/project.service';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  infoMessage: string = null;
  showMessage: boolean = false;
  usersCount: number = 0;
  projectsCount: number = 0;
  organizationsCount: number = 0;
  currentYearDisbursements: number = 0;
  defaultCurrency: string = null;
  currentYear: number = 0;
  
  constructor(private storeService: StoreService, private route: ActivatedRoute,
    private userService: UserService, private organizationService: OrganizationService,
    private projectService: ProjectService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.currentYear = this.storeService.getCurrentYear();
    this.getUsersCount();
    this.getProjectsCount();
    this.getOrganizationsCount();
    this.getCurrentYearDisbursements();
    this.getDefaultCurrency();
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
          this.currentYearDisbursements = data;
        }
      }
    );
  }

}
