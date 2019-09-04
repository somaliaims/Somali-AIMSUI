import { Component, OnInit, Input } from '@angular/core';
import { Settings } from 'src/app/config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Messages } from 'src/app/config/messages';
import { ProjectService } from 'src/app/services/project.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';

@Component({
  selector: 'basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.css']
})
export class BasicDataComponent implements OnInit {
  isProjectBtnDisabled: boolean = false;
  fundersSettings: any = [];
  implementersSettings: any = [];
  entryForm: any = null;
  errorMessage: string = null;
  itemsToShowInDropdowns: number = 3;

  funderModel: any = { selectedFunders: [] };
  implementerModel: any = { selectedImplementers: [] };

  @Input()
  projectId: number = 0;
  @Input()
  projectData: any = {};
  @Input()
  projectDocuments: any = [];
  @Input()
  projectFunders: any = [];
  @Input()
  projectImplementers: any = [];
  @Input()
  financialYears: any = [];
  @Input()
  organizationsList: any = [];
  @Input()
  fundingTypesList: any = [];
  @Input()
  currenciesList: any = [];

  descriptionLimit: number = Settings.descriptionLongLimit;
  descriptionLimitLeft: number = Settings.descriptionLongLimit;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.funderModel.selectedFunders = this.projectFunders;
    this.implementerModel.selectedImplementers = this.projectImplementers;
    this.fundersSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: this.itemsToShowInDropdowns,
      allowSearchFilter: true
    };

    this.implementersSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: this.itemsToShowInDropdowns,
      allowSearchFilter: true
    };
  }

  getDescriptionLimitInfo() {
    this.descriptionLimitLeft = (this.descriptionLimit - this.projectData.description.length);
    if (this.descriptionLimitLeft < 0) {
      this.projectData.description = this.projectData.description.substring(0, (this.descriptionLimit - 1));
    }
  }

  saveProject(frm: any) {
    this.entryForm = frm;
    var startingYear = parseInt(this.projectData.startingFinancialYear);
    var endingYear = parseInt(this.projectData.endingFinancialYear);

    if (startingYear > endingYear) {
      this.errorMessage = 'Starting year cannot be greater than ending year';
      this.errorModal.openModal();
      return false;
    }

    this.isProjectBtnDisabled = true;
    if (this.projectId != 0) {
      this.blockUI.start('Saving project...');
      this.projectService.updateProject(this.projectId, this.projectData).subscribe(
        data => {
          if (data) {
          } 
          this.blockUI.stop();
        }
      );
    } else {
      this.blockUI.start('Saving project...');
      this.projectService.addProject(this.projectData).subscribe(
        data => {
          if (data) {
            this.projectId = data;
            localStorage.setItem('active-project', data);
            this.saveProjectFunders();
          } else {
            this.blockUI.stop();
          }
        }
      );
    }
  }

  saveProjectFunders() {
    var funderIds = this.funderModel.selectedFunders.map(f => f.id);
    var model = {
      projectId: this.projectId,
      funderIds: funderIds
    };
    this.projectService.addProjectFunder(model).subscribe(
      data => {
        if (data) {
          this.saveProjectImplementers();
        } else {
          this.blockUI.stop();
        }
      }
    );
  }

  saveProjectImplementers() {
    var implementerIds = this.implementerModel.selectedImplementers.map(i => i.id);
    var model = {
      projectId: this.projectId,
      implementerIds: implementerIds
    };
    this.projectService.addProjectImplementer(model).subscribe(
      data => {
        if (data) {

        }
        this.blockUI.stop();
      }
    );
  }


}
