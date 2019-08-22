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
  projectModel: any = { title: null, startDate: null, endDate: null, projectValue: null, 
    description: null };
  funderModel: any = { funder: null };
  implementerModel: any = { implementer: null };
  currentTab: string = 'project';
  isProjectLoading: boolean = true;
  isFunderLoading: boolean = true;
  isImplementerLoading: boolean = true;
  isDisbursementLoading: boolean = true;
  isDocumentLoading: boolean = true;
  errorMessage: string = null;
  successMessage: string = null;
  requestNo: number = 0;

  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' }
  ];
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private helpService: HelpService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent, private storeService: StoreService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.getHelpForProject();
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
      }
    );
  }

  getHelpForImplementer() {
    this.helpService.getProjectImplementerHelpFields().subscribe(
      data => {
        if (data) {
          this.implementerModel = data;
        }
      }
    );
  }

  saveProjectHelp(frm: any) {
    this.blockUI.start('Saving help...');
    this.helpService.saveProjectHelp(this.projectModel).subscribe(
      data => {
        if (data) {
          this.successMessage = 'Help saved successfully for project fields';
          this.infoModal.openModal();
        }
        this.blockUI.stop();
      }
    );
  }

  showProjectTab() {
    this.manageTabsDisplay('project');
  }

  showFunderTab() {
    this.manageTabsDisplay('funder');
  }

  showImplementerTab() {
    this.manageTabsDisplay('implementer');
  }

  showDisbursementTab() {
    this.manageTabsDisplay('disbursement');
  }

  showDocumentTab() {
    this.manageTabsDisplay('document');
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
