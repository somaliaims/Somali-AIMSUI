import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Settings } from 'src/app/config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { IATIService } from 'src/app/services/iati.service';
import { SecurityHelperService } from 'src/app/services/security-helper.service';
import { Router } from '@angular/router';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import { FundingTypeService } from 'src/app/services/funding-type.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {
  requestNo: number = 0;
  activeProjectId: number = 0;
  isForEdit: boolean = false;
  sectorTotalPercentage: number = 0;
  locationTotalPercentage: number = 0;
  currentTab: string = null;

  permissions: any = {};
  fieldTypes: any = Settings.customFieldTypes;

  userProjectIds: any = [];
  financialYears: any = [];
  organizationsList: any = [];
  fundingTypesList: any = [];
  selectedFunders: any = [];
  selectedImplementers: any = [];

  currentProjectFundersList: any = [];
  currentProjectImplementersList: any = [];
  currentProjectSectorsList: any = [];
  currentProjectLocationsList: any = [];
  currentProjectDisbursementsList: any = [];
  currentProjectDocumentsList: any = [];
  currentProjectMarkersList: any = [];
  
  monthsList: any = [
    { key: 'January', value: 1 },
    { key: 'February', value: 2 },
    { key: 'March', value: 3 },
    { key: 'April', value: 4 },
    { key: 'May', value: 5 },
    { key: 'June', value: 6 },
    { key: 'July', value: 7 },
    { key: 'August', value: 8 },
    { key: 'September', value: 9 },
    { key: 'October', value: 10 },
    { key: 'November', value: 11 },
    { key: 'December', value: 12 }
  ];

  fieldType: any = {
    1: 'Dropdown',
    2: 'Checkbox',
    3: 'Text',
    4: 'Radio'
  };

  projectData = { id: 0, title: null, fundingTypeId: 0, startingFinancialYear: null, endingFinancialYear: null, 
    description: null, projectValue: 0 };

  displayTabs: any = [
    { visible: true, identity: 'basic' },
    { visible: false, identity: 'financials' },
    { visible: false, identity: 'sectors' },
    { visible: false, identity: 'finish' }
  ];

  tabConstants: any = {
    BASIC: 'basic',
    FINANCIALS: 'financials',
    SECTORS: 'sectors',
    FINISH: 'finish'
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private securityService: SecurityHelperService,
    private router: Router, private yearService: FinancialYearService,
    private orgService: OrganizationService,
    private fundingTypeService: FundingTypeService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.getFinancialYears();
    this.getOrganizationsList();
    this.requestNo = this.storeService.getCurrentRequestId();
    var projectId = localStorage.getItem('active-project');

    if (projectId && projectId != '0') {
      this.blockUI.start('Loading project data...');
      this.isForEdit = true;
      this.activeProjectId = parseInt(projectId);
      this.projectData.id = this.activeProjectId;
      this.loadUserProjects(this.activeProjectId);
    }
    this.currentTab = this.tabConstants.BASIC;
  }

  loadUserProjects(projectId: number) {
    this.projectService.getUserProjects().subscribe(
      data => {
        if (data) {
          this.userProjectIds = data;
          if (this.userProjectIds.map(p => p.id).indexOf(projectId) == -1) {
            this.router.navigateByUrl('project-membership/' + projectId);
          } else {
            this.loadProjectData(projectId);
          }
        }
      }
    );
  }

  loadProjectData(id: number) {
    this.projectService.getProjectProfileReport(id.toString()).subscribe(
      result => {
        if (result && result.projectProfile) {
          var data = result.projectProfile;
          //Setting project data
          console.log(data);
          this.projectData.title = data.title;
          this.projectData.description = data.description;
          this.projectData.startingFinancialYear = data.startingFinancialYear;
          this.projectData.endingFinancialYear = data.endingFinancialYear;
          this.projectData.projectValue = data.projectValue;

          //Setting sectors data
          if (data.sectors && data.sectors.length > 0) {
            this.currentProjectSectorsList = data.sectors;
            this.sectorTotalPercentage = this.calculateSectorPercentage();
          }

          if (data.locations && data.locations.length > 0) {
            this.currentProjectLocationsList = data.locations;
            this.locationTotalPercentage = this.calculateLocationPercentage();
          }

          if (data.documents && data.documents.length > 0) {
            this.currentProjectDocumentsList = data.documents;
          }

          if (data.funders && data.funders.length > 0) {
            this.currentProjectFundersList = data.funders;
          } 

          if (data.implementers && data.implementers.length > 0) {
            this.currentProjectImplementersList = data.implementers;
          }

          if (data.disbursements && data.disbursements.length > 0) {
            this.currentProjectDisbursementsList = data.disbursements;
          }

          if (data.customFields && data.customFields.length > 0) {
            this.currentProjectMarkersList = data.markers;
          }
        }
        setTimeout(() => {
          this.blockUI.stop();
        }, 1000);
      }
    );
  }

  calculateSectorPercentage() {
    var percentageList = this.currentProjectSectorsList.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  calculateLocationPercentage() {
    var percentageList = this.currentProjectLocationsList.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  getFinancialYears() {
    this.yearService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }
      }
    );
  }

  getOrganizationsList() {
    this.orgService.getUserOrganizations().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
        }
      }
    );
  }

  loadFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypesList = data;
        }
      }
    )
  }

  showBasicInfo() {
    this.manageTabsDisplay(this.tabConstants.BASIC);
  }

  showFinancials() {
    this.manageTabsDisplay(this.tabConstants.FINANCIALS);
  }

  showSectors() {
    this.manageTabsDisplay(this.tabConstants.SECTORS);
  }

  showFinish() {
    this.manageTabsDisplay(this.tabConstants.FINISH);
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
