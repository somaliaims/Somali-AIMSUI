import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  isFunderDataAvailable: boolean = false;
  isImplementerDataAvailable: boolean = false;
  fundersSettings: any = [];
  implementersSettings: any = [];
  newDocuments: any = [];
  sourceFundersList: any = [];
  sourceImplementersList: any = [];
  entryForm: any = null;
  errorMessage: string = null;
  itemsToShowInDropdowns: number = 3;
  currentTab: string = null;

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

  @Output() 
  projectFundersChanged = new EventEmitter<any[]>();
  @Output()
  projectImplementersChanged = new EventEmitter<any[]>();

  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'project-source' },
    { visible: false, identity: 'funders-source' },
    { visible: false, identity: 'implementers-source' },
    { visible: false, identity: 'sectors' },
    { visible: false, identity: 'sectors-source' },
    { visible: false, identity: 'locations-source' },
    { visible: false, identity: 'finish' }
  ];

  tabConstants: any = {
    PROJECT: 'project',
    PROJECT_SOURCE: 'project-source',
    FUNDERS_SOURCE: 'funders-source',
    IMPLEMENTERS_SOURCE: 'implementers-source',
    SECTORS: 'sectors',
    SECTORS_SOURCE: 'sectors-source',
    FINANCIALS: 'financials',
    FINANCIALS_SOURCE: 'financials-source',
    FINISH: 'finish'
  };

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
    this.currentTab = this.tabConstants.PROJECT;
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
  }

  ngOnChanges() {
    if (this.aimsProjects.length > 0 || this.iatiProjects.length > 0) {
      this.isProjectSourceAvailable = true;
    }
    
    if (this.projectData && this.projectData.description) {
      this.getDescriptionLimitInfo();
    }

    if (this.iatiProjects.length > 0) {
      this.iatiProjects.forEach(p => {
        if (p.funders.length > 0) {
          this.isFunderDataAvailable = true;

          p.funders.forEach(f => {
            f.isSaved = true;
          });
        }
      });

      this.iatiProjects.forEach(p => {
        if (p.implementers.length > 0) {
          this.isImplementerDataAvailable = true;
        }

        p.implementers.forEach(i => {
          i.isSaved = true;
        });
      });
    }

    if (this.aimsProjects.length > 0) {
      this.aimsProjects.forEach(p => {
        if (p.funders.length > 0) {
          this.isFunderDataAvailable = true;

          p.funders.forEach(f => {
            f.isSaved = true;
          });
        }
      });

      this.aimsProjects.forEach(p => {
        if (p.implementers.length > 0) {
          this.isImplementerDataAvailable = true;

          p.implementers.forEach(i => {
            i.isSaved = true;
          });
        }
      });
    }
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
        this.projectData.exchangeRate = exRate[0].rate;
      }
    } else {
      this.projectData.exchangeRate = 1;
    }
  }

  saveBasicData() {
    var startingYear = parseInt(this.projectData.startingFinancialYear);
    var endingYear = parseInt(this.projectData.endingFinancialYear);

    if (startingYear > endingYear) {
      this.errorMessage = 'Starting year cannot be greater than ending year';
      this.errorModal.openModal();
      return false;
    }

    if (this.projectId != 0) {
      this.blockUI.start('Saving project...');
      this.projectService.updateProject(this.projectId, this.projectData).subscribe(
        data => {
          if (data) {
            this.showProjectData();
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
            this.showProjectData();
          } 
          this.blockUI.stop();
        }
      );
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
          this.projectFunders = [];
          this.funderModel.selectedFunders.forEach((f) => {
            this.projectFunders.push({
              funderId: f.id,
              funder: f.organizationName
            });
          });
          this.updateFundersToParent();
          this.saveProjectImplementers();
        } else {
          this.blockUI.stop();
        }
      }
    );
  }

  saveProjectFundersFromSource() {
    if (this.sourceFundersList.length > 0) {
      var model = {
        projectId: this.projectId,
        funders: this.sourceFundersList
      }

      this.blockUI.start('Saving funders...');
      this.projectService.addProjectFunderFromSource(model).subscribe(
        data => {
          if (data) {
            this.sourceFundersList = [];
            this.getProjectFunders(true);
          }
        }
      );
    } else {
      this.showProjectData();
    }
  }

  saveProjectImplementersFromSource() {
    if (this.sourceImplementersList.length > 0) {
      var model = {
        projectId: this.projectId,
        implementers: this.sourceImplementersList
      }

      this.blockUI.start('Saving implementers...');
      this.projectService.addProjectImplementerFromSource(model).subscribe(
        data => {
          if (data) {
            this.sourceImplementersList = [];
            this.getProjectImplementers(true);
          }
        }
      );
    } else {
      this.showProjectData();
    }
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
          this.projectImplementers = [];
          this.implementerModel.selectedImplementers.forEach((i) => {
            this.projectImplementers.push({
              implementerId: i.id,
              implementer: i.organizationName
            });
          });
          this.updateImplementersToParent();
          this.saveProjectDocuments();
        } else {
          this.blockUI.stop();
        }
      }
    );
  }

  getProjectFunders(isDBSync: any = false) {
    if (this.projectId) {
      this.projectService.getProjectFunders(this.projectId.toString()).subscribe(
        data => {
          if (data) {
            this.projectFunders = data;
            if (isDBSync) {
              this.funderModel.selectedFunders = [];
              
              this.projectFunders.forEach((f) => {
                this.funderModel.selectedFunders.push({
                  id: f.funderId,
                  organizationName: f.funder
                });
              });
              this.blockUI.stop();
              this.showProjectData();
            }
          }
        }
      );
    }
  }

  getProjectImplementers(isDBSync: any = false) {
    if (this.projectId) {
      this.projectService.getProjectImplementers(this.projectId.toString()).subscribe(
        data => {
          if (data) {
            this.projectImplementers = data;
            if (isDBSync) {
              this.implementerModel.selectedImplementers = [];
              
              this.projectImplementers.forEach((i) => {
                this.implementerModel.selectedImplementers.push({
                  id: i.implementerId,
                  organizationName: i.implementer
                });
              });
              this.blockUI.stop();
              this.showProjectData();
            }
          }
        }
      );
    }
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

  /* Showing tabs, tabs management*/
  showProjectData() {
    this.manageTabsDisplay(this.tabConstants.PROJECT);
  }

  showProjectSource() {
    this.manageTabsDisplay(this.tabConstants.PROJECT_SOURCE);
  }

  showFundersSource() {
    this.manageTabsDisplay(this.tabConstants.FUNDERS_SOURCE);
  }

  showImplementersSource() {
    this.manageTabsDisplay(this.tabConstants.IMPLEMENTERS_SOURCE);
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  /*Sending updated data to parent*/
  updateFundersToParent() {
    this.projectFundersChanged.emit(this.projectFunders);
  }

  updateImplementersToParent() {
    this.projectImplementersChanged.emit(this.projectImplementers);
  }

  /*Handling IATI Stuff*/
  enterProjectTitleAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.title = selectedProject[0].title.trim();
    }
  }

  enterProjectDescAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.description = selectedProject[0].description.trim();
    }
    this.getDescriptionLimitInfo();
  }

  enterCurrencyAIMS(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject.length > 0) {
      this.projectData.projectCurrency = selectProject[0].projectCurrency;
      if (this.projectData.projectCurrency) {
        this.getExchangeRateForCurrency();
      }
    }
  }

  enterStartDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.startingFinancialYear = selectedProject[0].startingFinancialYear;
    }
  }

  enterEndDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.endingFinancialYear = selectedProject[0].endingFinancialYear;
    }
  }

  enterStartDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var sDate = new Date(selectedProject[0].startDate);
      this.projectData.startingFinancialYear = sDate.getFullYear();
    }
  }

  enterEndDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var eDate = new Date(selectedProject[0].endDate);
      this.projectData.endingFinancialYear = eDate.getFullYear();
    }
  }

  enterProjectTitleIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.projectData.title = selectedProject[0].title.trim();
    }
  }

  enterCurrencyIATI(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject.length > 0) {
      this.projectData.projectCurrency = selectProject[0].defaultCurrency;
      if (this.projectData.projectCurrency) {
        this.getExchangeRateForCurrency();
      }
    }
  }

  enterIATIBudget(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var budgetId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var budgets = selectProject[0].budgets;
      var selectedBudget = budgets.filter(b => b.id == budgetId);
      if (selectedBudget && selectedBudget.length > 0) {
        if (selectedBudget.length > 0) {
          this.projectData.projectCurrency = selectedBudget[0].currency;
          this.projectData.projectValue = selectedBudget[0].amount;
          if (this.projectData.projectCurrency) {
            this.getExchangeRateForCurrency();
          }
        }
      }
    }
  }

  enterProjectDescIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.projectData.description = selectedProject[0].description.trim();
    }
    this.getDescriptionLimitInfo();
  }

  checkIfFunderAdded(funder) {
    if (this.projectFunders.length > 0) {
      var isExists = this.projectFunders.filter(f =>
        f.funder.trim().toLowerCase() == funder.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  checkIfImplementerAdded(implementer) {
    if (this.projectImplementers.length > 0) {
      var isExists = this.projectImplementers.filter(i =>
        i.implementer.trim().toLowerCase() == implementer.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  addFunderToList(funder) {
    if (this.sourceFundersList.includes(funder)) {
      this.sourceFundersList = this.sourceFundersList.filter(f => f != funder);
    } else {
      this.sourceFundersList.push(funder);
    }
  }

  addImplementerToList(implementer) {
    if (this.sourceImplementersList.includes(implementer)) {
      this.sourceImplementersList = this.sourceImplementersList.filter(i => i != implementer);
    } else {
      this.sourceImplementersList.push(implementer);
    }
  }

  checkIfFunderInActionList(funder) {
    var result = this.sourceFundersList.filter(f => f.toLowerCase() == funder.toLowerCase()).length > 0 ? true : false;
    return result;
  }

  checkIfImplementerInActionList(implementer) {
    var result = this.sourceImplementersList.filter(i => i.toLowerCase() == implementer.toLowerCase()).length > 0 ? true : false;
    return result;
  }

  removeFunderFromList(funder) {
    this.sourceFundersList = this.sourceFundersList.filter(f => f.toLowerCase() != funder.toLowerCase());
  }

}
