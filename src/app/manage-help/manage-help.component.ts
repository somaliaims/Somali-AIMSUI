import { Component, OnInit } from '@angular/core';
import { Settings } from '../config/settings';
import { HelpService } from '../services/help-service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { StoreService } from '../services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-manage-help',
  templateUrl: './manage-help.component.html',
  styleUrls: ['./manage-help.component.css']
})
export class ManageHelpComponent implements OnInit {
  helpTextLimit: number = Settings.helpTextLength;
  projectModel: any = { title: null, startDate: null, endDate: null, startingFinancialYear: null,
     endingFinancialYear: null, projectValue: null, description: null, fundingType: null };
  funderModel: any = { funder: null };
  implementerModel: any = { implementer: null };
  sectorModel: any = { sectorType: null, sector: null, mappingSector: null, percentage: null };
  locationModel: any = { location: null, percentage: null };
  documentModel: any = { document: null, documentUrl: null };
  disbursementModel: any = { disbursementActual: null, disbursementPlanned: null, year: null };

  currentTab: string = 'project';
  isProjectLoading: boolean = true;
  isFunderLoading: boolean = true;
  isSectorLoading: boolean = true;
  isLocationLoading: boolean = true;
  isImplementerLoading: boolean = true;
  isDisbursementLoading: boolean = true;
  isDocumentLoading: boolean = true;
  errorMessage: string = null;
  successMessage: string = null;
  requestNo: number = 0;

  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' },
    { visible: false, identity: 'disbursement' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' }
  ];

  tabConstants: any = {
    PROJECT: 'project',
    FUNDER: 'funder',
    IMPLEMENTER: 'implementer',
    DISBURSEMENT: 'disbursement',
    DOCUMENT: 'document',
    SECTOR: 'sector',
    LOCATION: 'location'
  };

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private helpService: HelpService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.storeService.newReportItem(Settings.dropDownMenus.help);
    this.getHelpForProject();
    this.getHelpForFunder();
    this.getHelpForImplementer();
    this.getHelpForSector();
    this.getHelpForLocation();
    this.getHelpForDocuments();
    this.getHelpForDisbursements();
  }

  getHelpForProject() {
    this.helpService.getProjectHelpFields().subscribe(
      data => {
        if (data) {
          this.projectModel = data;
        }
        this.isProjectLoading = false;
      }
    );
  }

  getHelpForFunder() {
    this.helpService.getProjectFunderHelpFields().subscribe(
      data => {
        if (data) {
          this.funderModel = data;
        }
        this.isFunderLoading = false;
      }
    );
  }

  getHelpForImplementer() {
    this.helpService.getProjectImplementerHelpFields().subscribe(
      data => {
        if (data) {
          this.implementerModel = data;
        }
        this.isImplementerLoading = false;
      }
    );
  }

  getHelpForSector() {
    this.helpService.getProjectSectorHelpFields().subscribe(
      data => {
        if (data) {
          this.sectorModel = data;
        }
        this.isSectorLoading = false;
      }
    );
  }

  getHelpForLocation() {
    this.helpService.getProjectLocationHelpFields().subscribe(
      data => {
        if (data) {
          this.locationModel = data;
        }
        this.isLocationLoading = false;
      }
    );
  }

  getHelpForDisbursements() {
    this.helpService.getProjectDisbursementsHelpFields().subscribe(
      data => {
        if (data) {
          this.disbursementModel = data;
        }
        this.isDisbursementLoading = false;
      }
    );
  }

  getHelpForDocuments() {
    this.helpService.getProjectDocumentsHelpFields().subscribe(
      data => {
        if (data) {
          this.documentModel = data;
        }
        this.isDocumentLoading = false;
      }
    );
  }

  saveProjectHelp(frm: any) {
    this.blockUI.start('Saving help...');
    this.helpService.saveProjectHelp(this.projectModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectFunderHelp(frm: any) {
    this.blockUI.start('Saving help...');
    this.helpService.saveProjectFunderHelp(this.funderModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectImplementerHelp(frm: any) {
    this.blockUI.start('Saving help for Implementer...');
    this.helpService.saveProjectImplementerHelp(this.implementerModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectDisbursementHelp(frm: any) {
    this.blockUI.start('Saving help for disbursement...');
    this.helpService.saveProjectDisbursementHelp(this.disbursementModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectSectorHelp(frm: any) {
    this.blockUI.start('Saving help for sector...');
    this.helpService.saveProjectSectorHelp(this.sectorModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectLocationHelp(frm: any) {
    this.blockUI.start('Saving help for location...');
    this.helpService.saveProjectLocationHelp(this.locationModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  saveProjectDocumentHelp(frm: any) {
    this.blockUI.start('Saving help for document...');
    this.helpService.saveProjectDocumentHelp(this.documentModel).subscribe(
      data => {
        if (data) {
        }
        this.blockUI.stop();
      }
    );
  }

  showProjectTab() {
    this.manageTabsDisplay(this.tabConstants.PROJECT);
  }

  showFunderTab() {
    this.manageTabsDisplay(this.tabConstants.FUNDER);
  }

  showImplementerTab() {
    this.manageTabsDisplay(this.tabConstants.IMPLEMENTER);
  }

  showDisbursementTab() {
    this.manageTabsDisplay(this.tabConstants.DISBURSEMENT);
  }

  showDocumentTab() {
    this.manageTabsDisplay(this.tabConstants.DOCUMENT);
  }

  showSectorTab() {
    this.manageTabsDisplay(this.tabConstants.SECTOR);
  }

  showLocationTab() {
    this.manageTabsDisplay(this.tabConstants.LOCATION);
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

}
