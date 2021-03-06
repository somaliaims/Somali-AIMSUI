import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Settings } from 'src/app/config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from 'src/app/services/project.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { StoreService } from 'src/app/services/store-service';
import { ProjectInfoModalComponent } from 'src/app/project-info-modal/project-info-modal.component';
import { ProjectiInfoModalComponent } from 'src/app/projecti-info-modal/projecti-info-modal.component';
import { CreateOrgModalComponent } from 'src/app/create-org-modal/create-org-modal.component';
import { HelpService } from 'src/app/services/help-service';
import { SecurityHelperService } from 'src/app/services/security-helper.service';
import { Messages } from 'src/app/config/messages';
import { ModalService } from 'src/app/services/modal.service';

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
  totalDisbursementsValue: number = 0;
  projectTotalValue: number = 0;
  invalidDisbursementsMessage: string = Messages.INVALID_PROJECT_VALUE_DISBURSEMENTS;

  sourceFundersList: any = [];
  sourceImplementersList: any = [];
  sourceDocumentsList: any = [];

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
  @Input()
  projectDisbursements: any = [];

  @Output()
  projectCreated = new EventEmitter<number>();
  @Output() 
  projectFundersChanged = new EventEmitter<any[]>();
  @Output()
  projectImplementersChanged = new EventEmitter<any[]>();
  @Output()
  projectDocumentsChanged = new EventEmitter<any []>();
  @Output()
  proceedToFinancials = new EventEmitter();
  @Output()
  disbursementsChanged = new EventEmitter<any>();

  tooltipOptions = {
    'placement': 'top',
    'show-delay': 500
  }
  basicDataSource: any = {
    TITLE: 1,
    START_DATE: 2,
    END_DATE: 3,
    CURRENCY: 4,
    PROJECT_VALUE: 5,
    GRANT_TYPE: 6
  };

  projectHelp: any = { title: null, startingFinancialYear: null, endingFinancialYear: null,
    description: null, projectValue: null, projectCurrency: null, fundingType: null,
    startDate: null, endDate: null};
  projectFunderHelp: any = { funder: null};
  projectImplementerHelp: any = { implementer: null};
  projectDocumentHelp: any = { document: null, documentUrl: null };
  isProjectHelpLoaded: boolean = false;
  isFunderHelpLoaded: boolean = false;
  isImplementerHelpLoaded: boolean = false;
  isDocumentHelpLoaded: boolean = false;
  previousStartingYear: number = 0;
  previousEndingYear: number = 0;
  basicModel: any = { startDate: null, endDate: null };

  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'project-source' },
    { visible: false, identity: 'funders-source' },
    { visible: false, identity: 'documents-source' },
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
    DOCUMENTS_SOURCE: 'documents-source',
    SECTORS: 'sectors',
    SECTORS_SOURCE: 'sectors-source',
    FINANCIALS: 'financials',
    FINANCIALS_SOURCE: 'financials-source',
    FINISH: 'finish'
  };

  currentSource: number = 0;
  isShowSource: boolean = false;
  isProjectSourceAvailable: boolean = false;
  isFunderSourceAvailable: boolean = false;
  isDocumentSourceAvailable: boolean = false;
  isImplementerSourceAvailable: boolean = false;
  descriptionLimit: number = Settings.descriptionLongLimit;
  descriptionLimitLeft: number = Settings.descriptionLongLimit;
  requestNo: number = 0;
  exchangeRate: number = 0;
  userOrgId: number = 0;

  isShowContact: boolean = false;
  aimsProjectId: number = 0;
  viewProject: any = {};
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewProjectDisbursements: any = [];
  viewProjectBudgets: any = [];
  viewProjectTransactions: any = [];
  viewProjectMarkers: any = [];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private projectInfoModal: ProjectInfoModalComponent,
    private projectIATIInfoModal: ProjectiInfoModalComponent,
    private orgModal: CreateOrgModalComponent,
    private securityService: SecurityHelperService,
    private helpService: HelpService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.currentTab = this.tabConstants.PROJECT;
    this.requestNo = this.storeService.getNewRequestNumber();
    this.userOrgId = parseInt(this.securityService.getUserOrganizationId());
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

    if (this.projectDisbursements.length > 0) {
      this.calculateDisbursements();
    }
    
  }

  ngOnChanges() {
    if (this.aimsProjects.length > 0 || this.iatiProjects.length > 0) {
      this.isProjectSourceAvailable = true;
      console.log(this.iatiProjects);
    }
    
    if (this.projectData && this.projectData.description) {
      this.previousStartingYear = new Date(this.projectData.startDate).getFullYear();
      this.previousEndingYear = new Date(this.projectData.endDate).getFullYear();
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

        if (p.documents.length > 0) {
          this.isDocumentSourceAvailable = true;
        }
      });

      this.iatiProjects.forEach(p => {
        if (p.implementers.length > 0) {
          this.isImplementerDataAvailable = true;
        }

        if (p.documents.length > 0) {
          this.isDocumentSourceAvailable = true;
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

        if (p.documents.length > 0) {
          this.isDocumentSourceAvailable = true;
        }
      });

      this.aimsProjects.forEach(p => {
        if (p.implementers.length > 0) {
          this.isImplementerDataAvailable = true;

          p.implementers.forEach(i => {
            i.isSaved = true;
          });
        }

        if (p.documents.length > 0) {
          this.isDocumentSourceAvailable = true;
        }
      });
    }

    this.calculateDisbursements();
    this.getProjectHelp();
    this.getprojectFunderHelp();
    this.getprojectImplementerHelp();
    this.getProjectDocumentHelp();
  }

  getDescriptionLimitInfo() {
    this.descriptionLimitLeft = (this.descriptionLimit - this.projectData.description.length);
    if (this.descriptionLimitLeft < 0) {
      this.projectData.description = this.projectData.description.substring(0, (this.descriptionLimit - 1));
    }
  }

  getExchangeRateForCurrency() {
    if (this.projectData.projectCurrency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.projectData.projectCurrency);
      if (exRate.length > 0) {
        this.projectData.exchangeRate = exRate[0].rate;
      }
    } else {
      this.projectData.exchangeRate = 1;
    }
  }

  getProjectHelp() {
    if (!this.projectHelp.title) {
      this.helpService.getProjectHelpFields().subscribe(
        data => {
          this.projectHelp = data;
        }
      );
    }
  }

  getprojectFunderHelp() {
    if (!this.projectFunderHelp.funder) {
      this.helpService.getProjectFunderHelpFields().subscribe(
        data => {
          this.projectFunderHelp = data;
        }
      );
    }
  }

  getprojectImplementerHelp() {
    if (!this.projectImplementerHelp.implementer) {
      this.helpService.getProjectImplementerHelpFields().subscribe(
        data => {
          this.projectImplementerHelp = data;
        }
      );
    }
  }

  getProjectDocumentHelp() {
    if (!this.projectDocumentHelp.document) {
      this.helpService.getProjectDocumentsHelpFields().subscribe(
        data => {
          if (data) {
            this.projectDocumentHelp = data;
          }
        }
      );
    }
  }

  updateBasicData() {
    var startingYear = new Date(this.projectData.startDate).getFullYear();
    var endingYear = new Date(this.projectData.endDate).getFullYear();
    this.projectData.startingFinancialYear = startingYear;
    this.projectData.endingFinancialYear = endingYear;

    if (startingYear > endingYear) {
      this.errorMessage = 'Starting year cannot be greater than ending year';
      this.errorModal.openModal();
      return false;
    }

    if ((startingYear > this.previousStartingYear) || (endingYear < this.previousEndingYear)) {
      this.modalService.open('confirmation-modal-source');
      return false;
    }
    this.saveBasicData();
  }

  saveBasicData() {
    var isOrgProvided = false;
    var userOrgInFunders = this.funderModel.selectedFunders.filter(f => f.id == this.userOrgId);
    if (userOrgInFunders.length == 0) {
      var userOrgInImplementers = this.implementerModel.selectedImplementers.filter(i => i.id == this.userOrgId);
      if (userOrgInImplementers.length > 0) {
        isOrgProvided = true;
      }
    } else {
      isOrgProvided = true;
    }

    if (!isOrgProvided) {
      this.errorMessage = Messages.ORG_NOT_PROVIDED_PROJECT;
      this.errorModal.openModal();
      return false;
    }

    if (this.projectId != 0) {
      this.blockUI.start('Saving project...');
      this.projectService.updateProject(this.projectId, this.projectData).subscribe(
        data => {
          if (data) {
            this.previousStartingYear = this.projectData.startingFinancialYear;
            this.previousEndingYear = this.projectData.endingFinancialYear;
            this.showProjectData();
            this.adjustProjectDisbursements();
          } 
          this.blockUI.stop();
        }
      );
    } else {
      this.blockUI.start('Saving project...');
      this.projectService.addProject(this.projectData).subscribe(
        data => {
          if (data) {
            this.previousStartingYear = this.projectData.startingFinancialYear;
            this.previousEndingYear = this.projectData.endingFinancialYear;
            this.projectId = data;
            this.updateProjectIdToParent();
            localStorage.setItem('active-project', data);
            this.showProjectData();
            this.adjustProjectDisbursements();
          } 
          this.blockUI.stop();
        }
      );
    }
  }
  
  updateProject(frm: any) {
    var startingYear = new Date(this.projectData.startDate).getFullYear();
    var endingYear = new Date(this.projectData.endDate).getFullYear();
    this.projectData.startingFinancialYear = startingYear;
    this.projectData.endingFinancialYear = endingYear;

    if (startingYear > endingYear) {
      this.errorMessage = 'Starting year cannot be greater than ending year';
      this.errorModal.openModal();
      return false;
    }

    if (this.projectId > 0) {
      if ((startingYear > this.previousStartingYear) || (endingYear < this.previousEndingYear)) {
        this.modalService.open('confirmation-modal');
        return false;
      } else {
        this.saveProject();
      }
    } else {
      this.saveProject();
    }
  }

  saveProject() {
    this.modalService.close('confirmation-modal');

    if (!this.projectData.description) {
      this.errorMessage = 'Project description is required';
      this.errorModal.openModal();
      return false;
    }

    var isOrgProvided = false;
    var userOrgInFunders = this.funderModel.selectedFunders.filter(f => f.id == this.userOrgId);
    if (userOrgInFunders.length == 0) {
      var userOrgInImplementers = this.implementerModel.selectedImplementers.filter(i => i.id == this.userOrgId);
      if (userOrgInImplementers.length > 0) {
        isOrgProvided = true;
      }
    } else {
      isOrgProvided = true;
    }

    if (!isOrgProvided) {
      this.errorMessage = Messages.ORG_NOT_PROVIDED_PROJECT;
      this.errorModal.openModal();
      return false;
    }

    this.isProjectBtnDisabled = true;
    this.projectData.fundingTypeId = parseInt(this.projectData.fundingTypeId)
    if (this.projectId != 0) {
      this.blockUI.start('Saving project...');
      this.requestNo = this.storeService.getCurrentRequestId();
      this.projectService.updateProject(this.projectId, this.projectData).subscribe(
        data => {
          if (data) {
            this.previousStartingYear = new Date(this.projectData.startDate).getFullYear();
            this.previousEndingYear = new Date(this.projectData.endDate).getFullYear();
            this.saveProjectFunders();
            this.adjustProjectDisbursements();
            this.updateProjectIdToParent();
            this.calculateDisbursements();
          } else {
            this.blockUI.stop();
          }
        }
      );
    } else {
      this.blockUI.start('Saving project...');
      this.requestNo = this.storeService.getCurrentRequestId();
      this.projectService.addProject(this.projectData).subscribe(
        data => {
          if (data) {
            this.previousStartingYear = new Date(this.projectData.startDate).getFullYear();
            this.previousEndingYear = new Date(this.projectData.endDate).getFullYear();
            this.projectId = data;
            localStorage.setItem('active-project', data);
            this.updateProjectIdToParent();
            this.createProjectDisbursements();
            this.saveProjectFunders();
            this.calculateDisbursements();
          } else {
            this.blockUI.stop();
          }
        }
      );
    }
  }

  calculateDisbursements() {
    var totalDisbursements = 0;
    if (this.projectDisbursements.length > 0) {
      this.projectDisbursements.forEach((d) => {
        totalDisbursements += parseFloat(d.amount);
      });
    }
    this.projectTotalValue = (this.projectData.projectValue) ? parseFloat(this.projectData.projectValue) : 0;
    this.totalDisbursementsValue = totalDisbursements;
  }

  saveProjectFunders() {
    var funderIds = this.funderModel.selectedFunders.map(f => f.id);
    var model = {
      projectId: this.projectId,
      funderIds: funderIds
    };
    this.requestNo = this.storeService.getCurrentRequestId();
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
      this.requestNo = this.storeService.getCurrentRequestId();
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
      this.requestNo = this.storeService.getCurrentRequestId();
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
    this.requestNo = this.storeService.getCurrentRequestId();
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

  cancelSaving() {
    this.modalService.close('confirmation-modal');
    this.modalService.close('confirmation-modal-source');
  }

  createProjectDisbursements() {
    this.projectService.createProjectDisbursements(this.projectId.toString()).subscribe(
      data => {
        if (data) {
          this.updateDisbursementsToParent(data);
          this.calculateDisbursements();
        }
      }
    );
  }

  adjustProjectDisbursements() {
    this.projectService.adjustProjectDisbursements(this.projectId.toString()).subscribe(
      data => {
        if (data) {
          this.updateDisbursementsToParent(data);
          this.calculateDisbursements();
        }
      }
    );
  }

  updateDisbursementsToParent(disbursements: any) {
    this.disbursementsChanged.emit(disbursements);
  }

  getProjectFunders(isDBSync: any = false) {
    if (this.projectId) {
      this.requestNo = this.storeService.getCurrentRequestId();
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
      this.requestNo = this.storeService.getCurrentRequestId();
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

      this.requestNo = this.storeService.getCurrentRequestId();
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

  saveProjectDocumentsFromSource() {
    if (this.sourceDocumentsList.length > 0) {
      var model = {
        projectId: this.projectId,
        documents: this.sourceDocumentsList
      }

      this.blockUI.start('Saving documents...');
      this.requestNo = this.storeService.getCurrentRequestId();
      this.projectService.addProjectDocument(model).subscribe(
        data => {
          if (data) {
            this.sourceDocumentsList = [];
            this.getProjectDocuments();
            this.showProjectData();
          }
        }
      );
    } else {
      this.showProjectData();
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
            this.updateDocumentsToParent();
          }
          this.blockUI.stop();
        }
      );
  }

  deleteResource(id) {
    if (id) {
      this.blockUI.start('Deleting resource');
      this.requestNo = this.storeService.getCurrentRequestId();
      this.projectService.deleteProjectDocument(id).subscribe(
        data => {
          if (data) {
            this.projectDocuments = this.projectDocuments.filter(d => d.id != id);
            this.updateDocumentsToParent();
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

  showProjectSource(source: number) {
    this.currentSource = source;
    this.manageTabsDisplay(this.tabConstants.PROJECT_SOURCE);
  }

  showFundersSource() {
    this.manageTabsDisplay(this.tabConstants.FUNDERS_SOURCE);
  }

  showImplementersSource() {
    this.manageTabsDisplay(this.tabConstants.IMPLEMENTERS_SOURCE);
  }

  showDocumentsSource() {
    this.manageTabsDisplay(this.tabConstants.DOCUMENTS_SOURCE);
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

  updateDocumentsToParent() {
    this.projectDocumentsChanged.emit(this.projectDocuments);
  }

  updateProjectIdToParent() {
    this.projectCreated.emit(this.projectId);
  }

  proceedToNext() {
    this.proceedToFinancials.emit();
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

  enterStartYear(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.startingFinancialYear = selectedProject[0].startingFinancialYear;
    }
  }

  enterEndYear(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.endingFinancialYear = selectedProject[0].endingFinancialYear;
    }
  }

  enterStartDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.startDate = this.formatDateToYMD(selectedProject[0].startDate);
    }
  }

  enterEndDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.endDate = this.formatDateToYMD(selectedProject[0].endDate);
    }
  }

  enterProjectValueAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.projectValue = selectedProject[0].projectValue;
    }
  }

  enterProjectValueIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.projectData.projectValue = selectedProject[0].projectValue;
    }
  }

  enterStartDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var sDate = new Date(selectedProject[0].startDate);
      var sDateStr = (sDate.getMonth() + 1) + '/' + sDate.getDate() + '/' + sDate.getFullYear();
      this.projectData.startDate = this.formatDateToYMD(sDateStr);
    }
  }

  enterEndDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var eDate = new Date(selectedProject[0].endDate);
      var eDateStr = ((eDate.getMonth() + 1) + '/' + eDate.getDate() + '/' + eDate.getFullYear());
      this.projectData.endDate = this.formatDateToYMD(eDateStr);
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
          this.projectData.projectValue = selectedBudget[0].amount;
        }
      }
    }
  }

  enterIATITransaction(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var transactionId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var transactions = selectProject[0].transactions;
      var selectedTransaction = transactions.filter(b => b.id == transactionId);
      if (selectedTransaction && selectedTransaction.length > 0) {
        if (selectedTransaction.length > 0) {
          this.projectData.projectValue = selectedTransaction[0].amount;
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
    var exists = [];
    if (this.projectFunders.length > 0) {
      exists = this.projectFunders.filter(f =>
        f.funder.trim().toLowerCase() == funder.trim().toLowerCase());
      return exists.length > 0 ? true : false;
    }
  }

  checkIfImplementerAdded(implementer) {
    var exists = [];
    if (this.projectImplementers.length > 0) {
      exists = this.projectImplementers.filter(i =>
        i.implementer.trim().toLowerCase() == implementer.trim().toLowerCase());
      return exists.length > 0 ? true : false;
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

  checkIfDocumentAdded(documentTitle, documentUrl) {
    if (this.projectDocuments.length > 0) {
      var isExists = this.projectDocuments.filter(d =>
        d.documentTitle.trim().toLowerCase() == documentTitle.trim().toLowerCase() ||
        d.documentUrl.trim().toLowerCase() == documentUrl.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  addDocumentToList(documentTitle, documentUrl) {
    var isDocumentAdded = [];

    if (this.sourceDocumentsList.length > 0) {
      isDocumentAdded = this.sourceDocumentsList.filter(d => d.documentTitle.toLowerCase() == documentTitle.toLowerCase() ||
      d.documentUrl.toLowerCase() == documentUrl.toLowerCase()); 

      if (isDocumentAdded.length > 0) {
        this.sourceDocumentsList = this.sourceDocumentsList.filter(d => d.documentTitle.toLowerCase() != documentTitle.toLowerCase() &&
        d.documentUrl.toLowerCase() != documentUrl.toLowerCase()); 
      }
    }
    
    if (isDocumentAdded.length == 0) {
      this.sourceDocumentsList.push({
        documentTitle: documentTitle,
        documentUrl: documentUrl
      });
    }
  }

  checkIfDocumentInActionList(documentTitle, documentUrl) {
    var result = false;
    if (this.sourceDocumentsList.length > 0) {
      result = this.sourceDocumentsList.filter(d => 
        d.documentTitle.toLowerCase() == documentTitle.toLowerCase() ||
        d.documentUrl.toLowerCase() == documentUrl.toLowerCase()).length > 0 ? true : false;
    }
    return result;
  }

  checkIfDocumentInvalid(document, url) {
    return (!document || !url) ? true : false;
  }


  viewAIMSProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      this.aimsProjectId = projectId;
      this.isShowContact = false;
      var selectProject = this.aimsProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          startDate: projectData.startDate,
          endDate: projectData.endDate
        }
        this.viewProject = projectData;
        this.viewProjectFunders = projectData.funders;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewProjectImplementers = projectData.implementers;
        this.viewProjectDocuments = projectData.documents;
        this.viewProjectMarkers = projectData.markers;
        this.projectInfoModal.openModal();
      }
    }
    return false;
  }

  viewIATIProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.iatiProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          defaultCurrency: projectData.defaultCurrency,
        }
        this.viewProject = project;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewProjectFunders = projectData.funders;
        this.viewProjectImplementers = projectData.implementers;
        this.viewProjectDocuments = projectData.documents;
        this.viewProjectBudgets = projectData.budgets;
        this.viewProjectTransactions = projectData.transactions;
        this.projectIATIInfoModal.openModal();
      }
    }
    return false;
  }

  openCreateOrg(e) {
    e.preventDefault();
    this.orgModal.openModal();
  }

  updateFundersImplementers(newOrganizations) {
    if (newOrganizations && newOrganizations.length > 0) {
      newOrganizations.forEach((model) => {
        this.organizationsList = this.organizationsList.concat({
          id: model.id,
          organizationTypeId: model.organizationTypeId,
          organizationName: model.organizationName,
          sourceType: model.sourceType
        });
      });
    }
  }

  formatToLongDate(dated: string) {
    return this.storeService.getLongDateString(dated);
  }

  formatNumber(value: number) {
    return this.storeService.getNumberWithCommas(value);
  }

  formatDateToYMD(dated: string) {
    return this.storeService.convertToDateInputFormat(dated);
  }
}
