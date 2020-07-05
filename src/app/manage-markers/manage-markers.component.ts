import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MarkerService } from '../services/marker.service';
import { Settings } from '../config/settings';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../services/store-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-manage-markers',
  templateUrl: './manage-markers.component.html',
  styleUrls: ['./manage-markers.component.css']
})
export class ManageMarkersComponent implements OnInit {
  isBtnDisbaled: boolean = false;
  requestNo: number = 0;
  fieldTypes: any = [];
  dateModel: NgbDateStruct;
  isForEdit: boolean = false;
  btnText: string = 'Save marker';
  tabText: string = 'Create new';
  fieldId: number = 0;
  errorMessage: string = null;
  isError: boolean = false;
  permissions: any = {};
  isManyValuesDisplay: boolean = false;
  isTwoValuesDisplay: boolean = false;
  autoIncrement: number = 0;
  calendarMaxDate: any = {};
  isNewValueFocus: boolean = false;
  originalOptionValues: any = [];
  helpTextLength: number = Settings.helpTextLength;
  
  model: any = { fieldType: null, fieldTitle: null, optionValues: [],
    optionValue1: null, optionValue2: null, newValue: null, help: null };

  constructor(private markerService: MarkerService, private route: ActivatedRoute,
    private router: Router, private storeService: StoreService,
    private securityService: SecurityHelperService, private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.calendarMaxDate = this.storeService.getCalendarUpperLimit();
    this.fieldTypes = Settings.markerTypes;
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Save marker';
        this.tabText = 'Edit marker';
        this.isForEdit = true;
        this.fieldId = id;
        this.markerService.getMarkerById(id).subscribe(
          data => {
            this.model.typeId = data.fieldType;
            this.model.fieldTitle = data.fieldTitle;
            this.model.help = data.help;
            if (data.values) {
              this.model.optionValues = JSON.parse(data.values);
            }
            
            if (this.model.optionValues.length > 0) {
              var ids = this.model.optionValues.map(v => parseInt(v.id));
              var id = Math.max.apply(null, ids);
              if (id) {
                this.autoIncrement = id;
              }
              this.model.optionValues.forEach(val => this.originalOptionValues.push(val.id));
            }

            /*var activeFrom = new Date(data.activeFrom);
            var activeUpto = new Date(data.activeUpto);
            this.model.activeFrom = { year: activeFrom.getFullYear(), month: (activeFrom.getMonth() + 1), day: activeFrom.getDate() };
            this.model.activeUpto = { year: activeUpto.getFullYear(), month: (activeUpto.getMonth() + 1), day: activeUpto.getDate() };*/
            this.setFieldTypeDisplay();
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  setFieldTypeDisplay() {
    var type = this.model.typeId;
    var typeId = parseInt(type);

    switch(typeId) {
      case 1:
      case 2:
      case 4:
        this.isManyValuesDisplay = true;
        this.isTwoValuesDisplay = false;
        break;
      
      case 5:
        this.isTwoValuesDisplay = true;
        this.isManyValuesDisplay = false;
        break;

      default:
        this.isTwoValuesDisplay = false;
        this.isManyValuesDisplay = false;
        break;
    }
  }

  addValue() {
    this.isNewValueFocus = false;
    var isValueExist = this.model.optionValues.filter(v => v.value.toLowerCase().trim() == this.model.newValue.toLowerCase().trim());
    if (isValueExist.length == 0) {
      ++this.autoIncrement;
      var model = {
        id: this.autoIncrement,
        value: this.model.newValue
      };
      this.model.optionValues.push(model);
      this.model.newValue = null;
    }
    setTimeout(() => {
      this.isNewValueFocus = true;
    }, 2000);
  }

  removeValue(e) {
    var id = e.currentTarget.id.split('-')[1];
    this.model.optionValues = this.model.optionValues.filter(o => o.id != id);
  }

  saveMarker() {
    if (this.isManyValuesDisplay && this.model.optionValues.length == 0) {
      this.errorMessage = Messages.INVALID_OPTIONS_LIST;
      this.errorModal.openModal();
      return false;
    } else if(this.isTwoValuesDisplay && (!this.model.optionValue1 || !this.model.optionValue2)) {
      this.errorMessage = Messages.INVALID_RADIO_VALUES;
      this.errorModal.openModal();
      return false;
    }

    this.isBtnDisbaled = true;
    var values = null;
    if (this.isManyValuesDisplay) {
      values = JSON.stringify(this.model.optionValues);
    } else if (this.isTwoValuesDisplay) {
      var valuesModel = [{
        id: 1,
        value: this.model.optionValue1, 
      }, {
        id: 2,
        value: this.model.optionValue2
      }];

      values = JSON.stringify(valuesModel);
    }

    var newModel = {
      fieldTitle: this.model.fieldTitle,
      fieldType: parseInt(this.model.typeId),
      values: values,
      help: this.model.help
    };

    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.markerService.updateMarker(this.fieldId.toString(), newModel).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('markers');
          }
          this.isBtnDisbaled = false;
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.markerService.saveMarker(newModel).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('markers');
          }
          this.isBtnDisbaled = false;
        }
      );
    }
  }

  isAlreadySaved(vid: any) {
    return this.originalOptionValues.includes(vid);
  }

}
