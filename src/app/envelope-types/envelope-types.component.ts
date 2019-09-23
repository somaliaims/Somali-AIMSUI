import { Component, OnInit } from '@angular/core';
import { EnvelopeTypeService } from '../services/envelope-type.service';
import { Settings } from '../config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';

@Component({
  selector: 'app-envelope-types',
  templateUrl: './envelope-types.component.html',
  styleUrls: ['./envelope-types.component.css']
})
export class EnvelopeTypesComponent implements OnInit {

  envelopeTypes: any = [];
  permissions: any = {};
  filteredEnvelopeTypes: any = [];
  criteria: string = null;
  inputTextHolder: string = 'Enter envelpe type name to search';
  isLoading: boolean = true;
  pagingSize: number = Settings.rowsPerPage;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private envelopeTypeService: EnvelopeTypeService, private securityService: SecurityHelperService,
    private router: Router) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditEnvelopeType) {
      this.router.navigateByUrl('home');
    }

    this.getEnvelopeTypes();
  }

  searchEnvelopeTypes() {
    if (!this.criteria) {
      this.filteredEnvelopeTypes = this.envelopeTypes;
    } else {
      if (this.envelopeTypes.length > 0) {
          var criteria = this.criteria.toLowerCase();
          this.filteredEnvelopeTypes = this.envelopeTypes.filter(e => 
            (e.typeName.toLowerCase().indexOf(criteria) != -1 ));
      }
    }
  }

  getEnvelopeTypes() {
    this.envelopeTypeService.getAllEnvelopeTypes().subscribe(
      data => {
        if (data) {
          this.envelopeTypes = data;
          this.filteredEnvelopeTypes = data;
        }
        this.isLoading = false;
      }
    );
  }

  edit(id: number) {
    if (id) {
      this.router.navigateByUrl('manage-envelope-type/' + id);
    }
  }

  delete(id: number) {
    if (id) {
      this.router.navigateByUrl('delete-envelope-type/' + id);
    }
  }

}
