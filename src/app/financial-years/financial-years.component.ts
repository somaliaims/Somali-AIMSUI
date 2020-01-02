import { Component, OnInit } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';
import { FinancialYearService } from '../services/financial-year.service';
import { Router } from '@angular/router';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-financial-years',
  templateUrl: './financial-years.component.html',
  styleUrls: ['./financial-years.component.css']
})
export class FinancialYearsComponent implements OnInit {

  isLoading: boolean = true;
  permissions: any = {};
  financialYearsList: any = [];
  filteredYearsList: any = [];
  pagingSize: number = Settings.rowsPerPage;
  selectedYearId: number = 0;
  criteria: string = '';

  constructor(private securityService: SecurityHelperService, private storeService: StoreService,
    private financialYearService: FinancialYearService, private router: Router) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditYear) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getFinancialYearsList();
  }

  getFinancialYearsList() {
    this.financialYearService.getYearsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.financialYearsList = data;
          this.filteredYearsList = data;
        }
      }
    );
  }

  searchFinancialYears() {
    if (!this.criteria) {
      this.filteredYearsList = this.financialYearsList;
    } else {
      if (this.financialYearsList.length > 0) {
        this.filteredYearsList = this.financialYearsList.filter(y => 
          (y.financialYear.toString().indexOf(this.criteria) != -1));
      }
    }
  }

  
}
