import { Component, OnInit } from '@angular/core';
import { GrantTypeService } from '../services/grant-type.service';
import { Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-grant-types',
  templateUrl: './grant-types.component.html',
  styleUrls: ['./grant-types.component.css']
})
export class GrantTypesComponent implements OnInit {
  grantTypesList: any = [];
  filteredGrantTypesList: any = [];
  criteria: string = null;
  permissions: any = {};
  isLoading: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  
  constructor(private grantTypeService: GrantTypeService, private router: Router,
    private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditGrantType) {
      this.router.navigateByUrl('home');
    }

    this.getGrantTypes();
  }

  getGrantTypes() {
    this.grantTypeService.getGrantTypesList().subscribe(
      data => {
        if (data) {
          this.grantTypesList = data;
          this.filteredGrantTypesList = data;
        }
      }
    );
  }

  searchGrantTypes() {
    if (!this.criteria) {
      this.filteredGrantTypesList = this.grantTypesList;
    }
    else {
      if (this.grantTypesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredGrantTypesList = this.grantTypesList.filter(g => (g.grantType.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('manage-grant-type/' + id);
  }

  delete(id: string) {

  }

}
