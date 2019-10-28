import { Component, OnInit } from '@angular/core';
import { FundingTypeService } from '../services/funding-type.service';
import { Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-funding-types',
  templateUrl: './funding-types.component.html',
  styleUrls: ['./funding-types.component.css']
})
export class FundingTypesComponent implements OnInit {
  fundingTypesList: any = [];
  filteredFundingTypesList: any = [];
  criteria: string = null;
  permissions: any = {};
  isLoading: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  
  constructor(private fundingTypeService: FundingTypeService, private router: Router,
    private securityService: SecurityHelperService, private storeService: StoreService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditFundingType) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getFundingTypes();
  }

  getFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypesList = data;
          this.filteredFundingTypesList = data;
        }
      }
    );
  }

  searchFundingTypes() {
    if (!this.criteria) {
      this.filteredFundingTypesList = this.fundingTypesList;
    }
    else {
      if (this.fundingTypesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredFundingTypesList = this.fundingTypesList.filter(g => (g.fundingType.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('manage-funding-type/' + id);
  }

  delete(id: string) {

  }

}
