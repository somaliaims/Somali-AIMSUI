import { Component, OnInit, Input } from '@angular/core';
import { Settings } from 'src/app/config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Messages } from 'src/app/config/messages';
import { ProjectService } from 'src/app/services/project.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';

@Component({
  selector: 'basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.css']
})
export class BasicDataComponent implements OnInit {
  resourceTempId: number = 0;
  isProjectBtnDisabled: boolean = false;
  isSourceVisible: boolean = false;
  fundersSettings: any = [];
  implementersSettings: any = [];
  newDocuments: any = [];
  entryForm: any = null;
  errorMessage: string = null;
  itemsToShowInDropdowns: number = 3;

  funderModel: any = { selectedFunders: [] };
  implementerModel: any = { selectedImplementers: [] };
  documentModel: any = { document: null, documentUrl: null };

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
  exchangeRates: any = [];
  @Input()
  currenciesList: any = [];
  @Input()
  aimsProjects: any = [];
  @Input()
  iatiProjects: any = [];


  isShowSource: boolean = false;
  isProjectSourceAvailable: boolean = false;
  isFunderSourceAvailable: boolean = false;
  isImplementerSourceAvailable: boolean = false;
  descriptionLimit: number = Settings.descriptionLongLimit;
  descriptionLimitLeft: number = Settings.descriptionLongLimit;
  requestNo: number = 0;
  exchangeRate: number = 0;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private errorModal: ErrorModalComponent,
    private storeService: StoreService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    if (this.projectFunders.length > 0) {
      this.projectFunders.forEach(f => {
        this.funderModel.selectedFunders.push({
          id : f.funderId,
          organizationName: f.funder
        });
      });
    }

    if (this.projectImplementers.length > 0) {
      this.projectImplementers.forEach(i => {
        this.implementerModel.selectedImplementers.push({
          id: i.implementerId,
          organizationName: i.implementer
        });
      });
    }
    
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

    if (this.aimsProjects.length > 0 || this.iatiProjects.length > 0) {
      this.isProjectSourceAvailable = true;
    }
    setTimeout(() => {
      this.getDescriptionLimitInfo();
    }, 1000);
  }

  getDescriptionLimitInfo() {
    this.descriptionLimitLeft = (this.descriptionLimit - this.projectData.description.length);
    if (this.descriptionLimitLeft < 0) {
      this.projectData.description = this.projectData.description.substring(0, (this.descriptionLimit - 1));
    }
  }

  getExchangeRateForCurrency() {
    if (this.projectData.currency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.projectData.currency);
      if (exRate.length > 0) {
        this.exchangeRate = exRate[0].rate;
      }
    } else {
      this.exchangeRate = 0;
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
            this.saveProjectFunders();
          } else {
            this.blockUI.stop();
          }
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
          this.saveProjectDocuments();
        } else {
          this.blockUI.stop();
        }
      }
    );
  }

  saveProjectDocuments() {
    var newDocuments = this.projectDocuments.filter(d => d.id <= 0);
    if (newDocuments.length > 0) {
      var model = {
        projectId: this.projectId,
        documents: newDocuments
      };

      this.projectService.addProjectDocument(model).subscribe(
        data => {
          if (data) {
            this.getProjectDocuments();
          } else {
            this.blockUI.stop();
          }
        }
      );
    } else {
      this.blockUI.stop();
    }
  }

  addResource() {
    if (!this.documentModel.document) {
      this.errorMessage = 'Resource name is required';
      this.errorModal.openModal();
      return false;
    } else if (!this.documentModel.documentUrl) {
      this.errorMessage = 'Resource url is required';
      this.errorModal.openModal();
      return false;
    }

    this.projectDocuments.unshift({
      id: (--this.resourceTempId),
      documentTitle: this.documentModel.document,
      documentUrl: this.documentModel.documentUrl
    });
    this.documentModel.document = null;
    this.documentModel.documentUrl = null;
  }

  removeResource(id) {
    if (id) {
      this.projectDocuments = this.projectDocuments.filter(d => d.id != id);
    }
  }

  getProjectDocuments() {
      this.projectService.getProjectDocuments(this.projectId.toString()).subscribe(
        data => {
          if (data) {
            this.projectDocuments = data;
          }
          this.blockUI.stop();
        }
      );
  }

  deleteResource(id) {
    if (id) {
      this.blockUI.start('Deleting resource');
      this.projectService.deleteProjectDocument(id).subscribe(
        data => {
          if (data) {
            this.projectDocuments = this.projectDocuments.filter(d => d.id != id);
          }
          this.blockUI.stop();
        }
      );
    }
  }

}
