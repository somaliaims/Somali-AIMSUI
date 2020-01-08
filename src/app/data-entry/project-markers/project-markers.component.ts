import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Settings } from 'src/app/config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Messages } from 'src/app/config/messages';
import { ProjectService } from 'src/app/services/project.service';
import { StoreService } from 'src/app/services/store-service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';

@Component({
  selector: 'project-markers',
  templateUrl: './project-markers.component.html',
  styleUrls: ['./project-markers.component.css']
})
export class ProjectMarkersComponent implements OnInit {

  @Input()
  projectId: number = 0;
  @Input()
  markersList: any = [];
  @Input()
  currentProjectMarkers: any = [];
  @Output()
  projectMarkersChanged = new EventEmitter<any[]>();
  @Output()
  proceedToNext = new EventEmitter();

  currentSelectedFieldValues: any = [];
  fieldModel = { projectId: 0, fieldId: 0, values: [], dropdownId: null, newText: null };
  fieldTypeConstants: any = {
    'Dropdown': 1,
    'Checkbox': 2,
    'Text': 3,
    'Radio': 4
  }
  fieldTypes: any = Settings.markerTypes;
  errorMessage: string = null;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private storeService: StoreService,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
  }

  selectFieldValue(fieldType: any, id: number, fieldId: number, el: any, isTypeText = false) {
    if (id == -1) {
      id = el.target.value;
    }

    if (!id) {
      return false;
    }

    var result = [];
    if (isTypeText) {
      result = this.markersList.filter(f => f.fieldType == fieldType && f.id == fieldId);
      if (result.length > 0) {
        var isExists = this.currentSelectedFieldValues.filter(f => f.fieldId == fieldId);
        if (isExists.length > 0) {
          this.fieldModel.newText = isExists[0].values[0].value;
        } else {
          var newTextField = {
            fieldId: fieldId,
            fieldType: fieldType,
            values: [
              { id: 1, value: result[0].values }
            ]
          };
          this.currentSelectedFieldValues.push(newTextField);
        }
      }
    } else {
      result = this.markersList.filter(f => f.fieldType == fieldType && f.id == fieldId).map(f => f.values)[0].filter(v => parseInt(v.id) == id);
      if (result.length > 0) {
        var values: any = [];

        if (el.currentTarget.type === 'checkbox') {
          if (!el.currentTarget.checked) {
            result = this.currentSelectedFieldValues.filter(f => f.fieldType == fieldType && f.fieldId == fieldId).map(f => f.values)[0].filter(v => parseInt(v.id) != id);
          }
        }

        if (this.currentSelectedFieldValues.length > 0) {
          var isExists = this.currentSelectedFieldValues.filter(f => f.fieldId == fieldId);
          if (isExists.length > 0) {
            if (fieldType != this.fieldTypeConstants.Checkbox) {
              isExists[0].values = [];
            }

            var isValueExists = isExists[0].values.filter(v => v.id == id);
            if (isValueExists.length == 0) {
              isExists[0].values.push({
                id: id,
                value: result[0].value
              });
            }
          } else {
            var newField = {
              fieldId: fieldId,
              fieldType: fieldType,
              values: [
                { id: result[0].id, value: result[0].value }
              ]
            };
            this.currentSelectedFieldValues.push(newField);
          }
        } else {
          var newField = {
            fieldId: fieldId,
            fieldType: fieldType,
            values: [
              { id: result[0].id, value: result[0].value }
            ]
          };
          this.currentSelectedFieldValues.push(newField);
        }
      }
    }
  }

  checkFieldType(typeId: number) {
    var result = this.fieldTypes.filter(f => f.typeId == typeId).map(f => f.field);
    return result;
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  checkIfSelected(fieldId: number, valId: number) {
   /*
   To update
   */
  }

  saveProjectMarkers(id: number) {
    var selectedField = this.currentSelectedFieldValues.filter(f => f.fieldId == id);
    if (selectedField.length > 0) {
      if (selectedField[0].values.length == 0) {
        this.errorMessage = Messages.INVALID_OPTION_VALUE;
        this.errorModal.openModal();
        return false;
      }

      var stringifiedJson = JSON.stringify(selectedField[0].values);
      var saveFieldModel = {
        projectId: this.projectId,
        markerId: id,
        fieldType: selectedField[0].fieldType,
        values: stringifiedJson
      }

      this.blockUI.start('Saving project marker...');
      this.projectService.saveProjectMarker(saveFieldModel).subscribe(
        data => {
          if (data) {
            var isFieldExists = this.currentProjectMarkers.filter(f => f.markerId == id);
            if (isFieldExists.length > 0) {
              var values = [];
              selectedField[0].values.forEach(function (v) {
                values.push({
                  id: v.id,
                  value: v.value
                });
              });
              isFieldExists[0].values = values;
            } else {
              var marker = this.markersList.filter(c => c.id == id);
              var fieldTitle = '';
              if (marker.length > 0) {
                fieldTitle = marker[0].fieldTitle;
              }

              var values = [];
              selectedField[0].values.forEach(function (v) {
                values.push({
                  id: v.id,
                  value: v.value
                });
              });

              this.currentProjectMarkers.push({
                markerId: id,
                fieldTitle: fieldTitle,
                fieldType: selectedField[0].fieldType,
                values: values,
                projectId: this.projectId
              });
            }

            this.updateMarkersToParent();
          }
          this.blockUI.stop();
        }
      );
    }
  }

  deleteProjectMarker(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var fieldId = arr[2];

    this.blockUI.start('Removing Field...');
    this.projectService.deleteProjectMarker(projectId, fieldId).subscribe(
      data => {
        if (data) {
          this.currentProjectMarkers = this.currentProjectMarkers.filter(c => c.markerId != fieldId);
          this.updateMarkersToParent();
        }
        this.blockUI.stop();
      }
    )
  }

  updateMarkersToParent() {
    this.projectMarkersChanged.emit(this.currentProjectMarkers);
  }

  proceedToFinish() {
    this.proceedToNext.emit();
  }


}
