import { Component, OnInit } from '@angular/core';
import { CustomeFieldService } from '../services/custom-field.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit {
  customFields: any = [];
  filteredCustomFields: any = [];
  isLoading: boolean = true;
  fieldType: any = {
    1: 'Dropdown',
    2: 'Checkbox',
    3: 'Text',
    4: 'List',
    5: 'Radio'
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private customFieldService: CustomeFieldService) { }

  ngOnInit() {
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

  displayFieldValues(json: any) {
    return json.stringify();
  }

  getFieldType(id: number) {
    return this.fieldType[id];
  }

  /*saveCustomFields(model: any) {
    this.customFieldService.saveCustomField(model).subscribe(
      data => {
        if (data) {

        }
      }
    )
  }*/

}
