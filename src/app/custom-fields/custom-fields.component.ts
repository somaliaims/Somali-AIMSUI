import { Component, OnInit } from '@angular/core';
import { CustomeFieldService } from '../services/custom-field.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  fieldType: any = {
    1: 'Dropdown',
    2: 'Checkbox',
    3: 'Text',
    4: 'List',
    5: 'Radio'
  };

  customFields: any = [];
  filteredCustomFields: any = [];
  isLoading: boolean = true;
  permissions: any = {};
  criteria: string = null;
  pagingSize: number = Settings.rowsPerPage;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private customFieldService: CustomeFieldService, private router: Router,
    private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }

    this.getCustomFields();
  }

  getCustomFields() {
    this.customFieldService.getCustomFields().subscribe(
      data => {
        if (data) {
          this.customFields = data;
          this.filteredCustomFields = data;
        }
        this.isLoading = false;
      }
    )
  }

  searchFields() {
    if (!this.criteria) {
      this.filteredCustomFields = this.customFields;
    } else {
      this.filteredCustomFields = this.customFields.filter(c => c.fieldTitle.trim().toLowerCase().indexOf(this.criteria.toLowerCase()) != -1);
    }
  }

  addCustomField() {
    this.router.navigateByUrl('manage-custom-field');
  }

  editCustomField(id: string) {
    this.router.navigateByUrl('manage-custom-field/' + id);
  }

  deleteCustomField(id: string) {
    this.router.navigateByUrl('delete-field/' + id);
  }

  displayFieldValues(json: any) {
    if (json && json.length > 0) {
      var parsedJson = JSON.parse(json);
      var valuesString = '';
      if (parsedJson && parsedJson.length > 0) {
        parsedJson.forEach(function (f) {
          if (valuesString) {
            valuesString += ', ' + f.value;
          } else {
            valuesString += f.value;
          }
        });
      }
      return valuesString;
    }
    return json;
  }

  getFieldType(id: number) {
    return this.fieldType[id];
  }

}
