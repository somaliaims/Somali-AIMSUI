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
import { CurrencyService } from 'src/app/services/currency.service';
import { SectorTypeService } from 'src/app/services/sector-types.service';
import { SectorService } from 'src/app/services/sector.service';
import { LocationService } from 'src/app/services/location.service';
import { ProjectInfoModalComponent } from 'src/app/project-info-modal/project-info-modal.component';
import { MarkerService } from 'src/app/services/marker.service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {
  requestNo: number = 0;
  activeProjectId: number = 0;
  defaultSectorType: string = null;
  defaultSectorTypeId: number = 0;
  isForEdit: boolean = false;
  isUpdatingSectors: boolean = false;
  sectorTotalPercentage: number = 0;
  locationTotalPercentage: number = 0;
  currentTab: string = null;
  isProjectLoading: boolean = true;
  permissions: any = {};
  sourceProjects: number = 0;
  errorMessage: string = null;
  fieldTypes: any = Settings.markerTypes;

  userProjectIds: any = [];
  financialYears: any = [];
  organizationsList: any = [];
  fundingTypesList: any = [];
  sectorTypesList: any = [];
  selectedFunders: any = [];
  currenciesList: any = [];
  sectorsList: any = [];
  defaultSectorsList: any = [];
  locationsList: any = [];
  selectedImplementers: any = [];
  exchangeRates: any = [];
  aimsProjects: any = [];
  iatiProjects: any = [];
  markersList: any = [];
  subLocationsList: any = [];

  selectedProjects: any = [];
  currentProjectFunders: any = [];
  currentProjectImplementers: any = [];
  currentProjectSectors: any = [];
  currentProjectLocations: any = [];
  currentProjectDisbursements: any = [];
  currentProjectDocuments: any = [];
  currentProjectMarkers: any = [];

  viewProject = {};
  viewProjectFunders: any = [];
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectImplementers: any = [];
  viewProjectDocuments: any = [];
  viewProjectDisbursements: any = [];
  viewProjectMarkers: any = [];
  
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

  projectData = { id: 0, title: null, fundingTypeId: null, startDate: null, endDate: null, startingFinancialYear: null, endingFinancialYear: null, 
    description: null, projectValue: null, projectCurrency: null, exchangeRate: 1 };

  displayTabs: any = [
    { visible: true, identity: 'basic' },
    { visible: false, identity: 'financials' },
    { visible: false, identity: 'sectors' },
    { visible: false, identity: 'markers' },
    { visible: false, identity: 'finish' }
  ];

  tabConstants: any = {
    BASIC: 'basic',
    FINANCIALS: 'financials',
    SECTORS: 'sectors',
    MARKERS: 'markers',
    FINISH: 'finish'
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private securityService: SecurityHelperService,
    private router: Router, private yearService: FinancialYearService,
    private orgService: OrganizationService,
    private fundingTypeService: FundingTypeService,
    private currencyService: CurrencyService,
    private sectorTypeService: SectorTypeService,
    private sectorService: SectorService,
    private locationService: LocationService,
    private errorModal: ErrorModalComponent,
    private markerService: MarkerService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.entry);
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    var projectId = localStorage.getItem('active-project');
    var projects = localStorage.getItem('selected-projects');
    if (projects) {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;

      if (this.selectedProjects && this.selectedProjects.length > 0) {
        var filteredIATI = this.selectedProjects.filter(function (project) {
          return project.type == 'IATI';
        });

        var iatiIdsArr = [];
        filteredIATI.forEach(function (project) {
          var obj = { identifier: project.identifier };
          iatiIdsArr.push(obj);
        }.bind(this));
        this.loadIATIProjectsForIds(iatiIdsArr);

        var filteredAIMS = this.selectedProjects.filter(function (project) {
          return project.type == 'AIMS';
        });
        var aimsIdsArr = [];
        filteredAIMS.forEach(function (project) {
          var id = project.identifier;
          aimsIdsArr.push(id);
        });
        this.loadAIMSProjectsForIds(aimsIdsArr);
      } 
    }

    this.getAverageExchangeRates();
    this.getFinancialYears();
    this.getOrganizationsList();
    this.getCurrenciesList();
    this.getFundingTypes();
    this.getSectorTypes();
    this.getLocationsList();
    this.getActiveMarkers();
    
    if (projectId && projectId != '0') {
      this.blockUI.start('Loading project data...');
      this.isForEdit = true;
      this.activeProjectId = parseInt(projectId);
      this.projectData.id = this.activeProjectId;
      this.loadUserProjects(this.activeProjectId);
    } else {
      this.isProjectLoading = false;
    }
    this.currentTab = this.tabConstants.BASIC;
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        if (data) {
          this.aimsProjects = data;
        }
      }
    );
  }

  loadIATIProjectsForIds(modelArr: any) {
    this.iatiService.extractProjectsByIds(modelArr).subscribe(
      data => {
        if (data) {
          this.iatiProjects = data;
          this.amendSectorNames();
        }
      }
    );
  }

  amendSectorNames() {
    if (this.iatiProjects.length > 0 && this.sectorsList.length > 0 && !this.isUpdatingSectors) {
      this.isUpdatingSectors = true;
      this.iatiProjects.forEach((p) => {
        if (p.sectors.length > 0) {
          p.sectors.forEach((s) => {
            if (s.code.length == 5) {
              var matchingSector = this.sectorsList.filter(sec => sec.iatiCode == s.code);
              if (matchingSector.length > 0) {
                s.sectorName = matchingSector[0].sectorName;
              }
            }
          });
        }
      });
      this.isUpdatingSectors = false;
    } else {
      this.isUpdatingSectors = false;
    }
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
          this.projectData.title = data.title;
          this.projectData.description = data.description;
          this.projectData.startDate =  this.formatDateToYMD(data.startDate);
          this.projectData.endDate = this.formatDateToYMD(data.endDate);
          this.projectData.startingFinancialYear = data.startingFinancialYear;
          this.projectData.endingFinancialYear = data.endingFinancialYear;
          this.projectData.projectValue = data.projectValue;
          this.projectData.projectCurrency = data.projectCurrency;
          this.projectData.fundingTypeId = data.fundingTypeId;

          if (data.sectors && data.sectors.length > 0) {
            this.currentProjectSectors = data.sectors;
            this.currentProjectSectors.forEach(s => {
              s.saved = true;
              s.mappingId = s.sectorId;
            });
            this.sectorTotalPercentage = this.calculateSectorPercentage();
          }

          if (data.locations && data.locations.length > 0) {
            this.currentProjectLocations = data.locations;
            this.currentProjectLocations.forEach(l => {
              l.saved = true;
              if (l.subLocations) {
                l.subLocations = l.subLocations;
              } else {
                l.subLocations = [];
              }
            });
            this.locationTotalPercentage = this.calculateLocationPercentage();
          }

          if (data.documents && data.documents.length > 0) {
            this.currentProjectDocuments = data.documents;
          }

          if (data.funders && data.funders.length > 0) {
            this.currentProjectFunders = data.funders;
          } 

          if (data.implementers && data.implementers.length > 0) {
            this.currentProjectImplementers = data.implementers;
          }

          if (data.disbursements && data.disbursements.length > 0) {
            this.currentProjectDisbursements = data.disbursements;
          }

          if (data.markers && data.markers.length > 0) {
            this.currentProjectMarkers = data.markers;
          }
        }
        this.isProjectLoading = false;
      }
    );
  }

  calculateSectorPercentage() {
    var percentageList = this.currentProjectSectors.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  calculateLocationPercentage() {
    var percentageList = this.currentProjectLocations.map(s => parseInt(s.fundsPercentage));
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

  getSectorTypes() {
    this.sectorTypeService.getSectorTypesList().subscribe(
      data => {
        if (data) {
          this.sectorTypesList = data;
          var defaultSectorType = this.sectorTypesList.filter(s => s.isPrimary == 1);
          if (defaultSectorType.length > 0) {
            this.defaultSectorTypeId = defaultSectorType[0].id;
            this.defaultSectorType = defaultSectorType[0].typeName;
          }
          this.getSectors();
        }
      }
    );
  }

  getSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        if (data) {
          this.sectorsList = data;
          this.defaultSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.defaultSectorTypeId)
          this.amendSectorNames();
        }
      }
    );
  }

  getFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypesList = data;
        }
      }
    )
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
        }
        this.getSubLocationsList();
        setTimeout(() => {
          this.blockUI.stop();        
        }, 1000);
      }
    );
  }

  getSubLocationsList() {
    this.locationService.getSubLocationsList().subscribe(
      data => {
        if (data) {
          this.subLocationsList = data;
        }
      }
    );
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data) {
          this.currenciesList = data;
        }
      }
    );
  }

  getActiveMarkers() {
    this.markerService.getActiveMarkers().subscribe(
      data => {
        if (data) {
          var fields = data;
          fields.forEach(function (field) {
            field.values = field.values ? JSON.parse(field.values) : [];
            field.values.forEach(v => v.isSelected = false);
          });
          this.markersList = fields;
        }
      }
    );
  }
  
  getAverageExchangeRates() {
    var model = {
      dated: this.storeService.getCurrentDateSQLFormat()
    };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        this.exchangeRates = data;
      }
    );
  }

  showBasicInfo() {
    this.manageTabsDisplay(this.tabConstants.BASIC);
  }

  showFinancials() {
    this.manageTabsDisplay(this.tabConstants.FINANCIALS);
  }

  showMarkers() {
    this.manageTabsDisplay(this.tabConstants.MARKERS);
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

  formatDateToYMD(dated: string) {
    return this.storeService.convertDateToYMDBySlash(dated);
  }

  /*Updating data from child*/
  updateProjectFunders($event) {
    this.currentProjectFunders = $event;
  }

  updateProjectImplementers($event) {
    this.currentProjectImplementers = $event;
  }

  updateProjectSectors($event) {
    this.currentProjectSectors = $event;
  }

  updateProjectDocuments($event) {
    this.currentProjectDocuments = $event;
  }

  updateProjectLocations($event) {
    this.currentProjectLocations = $event;
  }

  updateProjectMarkers($event) {
    this.currentProjectMarkers = $event;
  }

  updateProjectDisbursements($event) {
    this.currentProjectDisbursements = $event;
  }

  updateProjectId($event) {
    this.activeProjectId = $event;
  }

}
