import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { StoreService } from 'src/app/services/store-service';
import { Settings } from 'src/app/config/settings';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { UrlHelperService } from 'src/app/services/url-helper-service';
import { OrganizationService } from 'src/app/services/organization-service';
import { CurrencyService } from 'src/app/services/currency.service';
import { SectorService } from 'src/app/services/sector.service';
import { LocationService } from 'src/app/services/location.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-all-projects-report',
  templateUrl: './all-projects-report.component.html',
  styleUrls: ['./all-projects-report.component.css']
})
export class AllProjectsReportComponent implements OnInit {
  isProcessing: boolean = false;
  isLoading: boolean = true;
  excelFile: string = null;
  financialYears: any = [];
  organizationsList: any = [];
  requestNo: number = 0;
  isAnyFilterSet: boolean = false;
  errorMessage: string = null;
  defaultCurrency: string = null;
  btnReportText: string = 'Generate export';
  model: any = { 
    organizationId: 0, startingYear: 0, endingYear: 0,
    useDefaultCurrency: false,
    selectedProjects: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], selectedSubLocations: [],
    description: null, lowerRange: null, upperRange: null,
    sectorLevel: 0
  };
  organizationsSettings: any = {};

  sectorsSettings: any = {};
  locationsSettings: any = {};
  subLocationsSettings: any = {};
  projectsSettings: any = {};

  projectTitles: any = [];
  allSectorsList: any = [];
  sectorsList: any = [];
  locationsList: any = [];
  subLocationsList: any = [];
  filteredSubLocationsList: any = [];

  sectorIds: any = [];
  subSectorIds: any = [];
  subSubSectorIds: any = [];

  sectorLevels: any = [
    { "id": 1, "level": "Parent sectors"},
    { "id": 2, "level": "Sub sectors"},
  ];

  sectorLevelCodes: any = {
    SECTORS: 1,
    SUB_SECTORS: 2,
  }

  
  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private yearsService: FinancialYearService, private errorModal: ErrorModalComponent,
    private urlService: UrlHelperService,
    private organizationService: OrganizationService,
    private currencyService: CurrencyService,
    private sectorService: SectorService,
    private locationService: LocationService,
    private projectService: ProjectService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.getDefaultCurrency();
    this.getFinancialYears();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    this.organizationsSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.subLocationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'subLocation',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.projectsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'title',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Select/Search project titles',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  
    this.getOrganizationsList();
    this.getProjectTitles();
    this.getSectorsList();
    this.getLocationsList();
  }

  getFinancialYears() {
    this.yearsService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }
        this.isLoading = false;
      }
    );
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      }
    );
  }

  getProjectTitles() {
    this.projectService.getProjectTitles().subscribe(
      data => {
        if (data) {
          this.projectTitles = data;
        }
      }
    );
  }

  getSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        if (data) {
          this.allSectorsList = data;
          this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          this.sectorIds = this.sectorsList.map(s => s.id);
          var subSectorsList = this.allSectorsList.filter(s => this.sectorIds.indexOf(s.parentSectorId) != -1);
          this.subSectorIds = subSectorsList.map(s => s.id);
          var subSubSectors = this.allSectorsList.filter(s => this.subSectorIds.indexOf(s.parentSectorId) != -1);
          this.subSubSectorIds = subSubSectors.map(s => s.id);

          if (this.subSubSectorIds.length > 0) {
            this.sectorLevels.push({
              id: 3,
              level: 'Sub-sub sectors'
            });
            this.sectorLevels.sort(s => s.id);
          }
        }
      }
    );
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        if (data) {
          this.locationsList = data;
          this.getSubLocationsList();
        }
      }
    );
  }

  getSubLocationsList() {
    this.locationService.getSubLocationsList().subscribe(
      data => {
        if (data) {
          this.subLocationsList = data;
          this.filteredSubLocationsList = data;
        }
      }
    );
  }

  filterSubLocations() {
    var locationIds = this.model.selectedLocations.map(l => l.id);
    this.filteredSubLocationsList = [];

    if (locationIds.length == 0) {
      this.filteredSubLocationsList = this.subLocationsList;
    } else {
      this.filteredSubLocationsList = this.subLocationsList.filter(s => locationIds.includes(s.locationId));
    }
  }

  manageSectorLevel() {
    if (this.model.sectorLevel) {
      var level = parseInt(this.model.sectorLevel);
      switch(level) {
        case this.sectorLevelCodes.SECTORS:
            this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          break;
        
        case this.sectorLevelCodes.SUB_SECTORS:
            this.sectorsList = this.allSectorsList.filter(s => this.subSectorIds.indexOf(s.id) != -1);
          break;

        default:
          this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
          break;
      }
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onSelectProject(item: any) {
    this.setFilter();
  }

  onDeSelectProject(item: any) {
    if (this.model.selectedProjects.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onSelectAllProjects(items: any) {
    this.setFilter();
  }

  onDeSelectAllProjects(items: any) {
    this.model.selectedProjects = [];
    this.manageResetDisplay();
  }

  onSelectSector(item: any) {
    this.setFilter();
  }

  onDeSelectSector(item: any) {
    if (this.model.selectedSectors.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onSelectAllSectors(items: any) {
    this.setFilter();
  }

  onDeSelectAllSectors(items: any) {
    this.model.selectedSectors = [];
    this.manageResetDisplay();
  }

  onSelectOrganization(item: any) {
    this.setFilter();
  }

  onDeSelectOrganization(item: any) {
    if (this.model.selectedOrganizations.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onSelectAllOrganizations(items: any) {
    this.setFilter();
  }

  onDeSelectAllOrganizations(items: any) {
    this.model.selectedOrganizations = [];
    this.manageResetDisplay();
  }

  onSelectLocation(item: any) {
    this.setFilter();
    this.filterSubLocations();
  }

  onDeSelectLocation(item: any) {
    if (this.model.selectedLocations.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
    this.filterSubLocations();
  }

  onSelectAllLocations(items: any) {
    this.setFilter();
    this.filterSubLocations();
  }

  onDeSelectAllLocations(items: any) {
    this.model.selectedLocations = [];
    this.manageResetDisplay();
    this.filterSubLocations();
  }

  onSubLocationSelect(item: any) {
    this.setFilter();
  }

  onSubLocationDeSelect(item: any) {
    if (this.model.selectedLocations.length == 0) {
      this.manageResetDisplay();
    } 
  }

  onSubLocationSelectAll(items: any) {
    this.setFilter();
  }

  onSubLocationDeSelectAll(items: any) {
    this.model.selectedLocations = [];
    this.manageResetDisplay();
  }

  startingYearChanged() {
    if (this.model.startingYear != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  endingYearChanged() {
    if (this.model.endingYear != 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  descriptionChanged() {
    if (this.model.description && this.model.description.length > 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  getAllProjectsReport() {
    var lowerRange = this.model.lowerRange ? this.model.lowerRange : 0;
    var upperRange = this.model.upperRange ? this.model.upperRange : 0;

    var searchModel = {
      organizationIds: this.model.selectedOrganizations.length > 0 ? [this.model.selectedOrganizations[0].id] : [],
      startingYear: (this.model.startingYear == null) ? 0 : parseInt(this.model.startingYear),
      endingYear: (this.model.endingYear == null) ? 0 : parseInt(this.model.endingYear),
      useDefaultCurrency: this.model.useDefaultCurrency,
      projectIds: this.model.selectedProjects.map(p => p.id),
      sectorIds: this.model.selectedSectors.map(s => parseInt(s.id)),
      locationIds: this.model.selectedLocations.map(l => parseInt(l.id)),
      subLocationIds: this.model.selectedSubLocations.map(l => parseInt(l.id)),
      description: this.model.description,
      lowerRange: lowerRange ? parseFloat(lowerRange) : 0,
      upperRange: upperRange ? parseFloat(upperRange) : 0,
      sectorLevel: this.model.sectorLevel
    };
    console.log('search model', searchModel)
    this.blockUI.start('Loading report...');
    this.excelFile = null;
    this.reportService.getAllProjectsReport(searchModel).subscribe(
      data => {
        if (data) {
          if (data.message) {
            this.excelFile = data.message;
            this.setExcelFile();
          }
        }
        this.blockUI.stop();
      }
    );
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
        }
      }
    );
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.urlService.getExcelFilesUrl() + this.excelFile;
    }
  }

  onChangeStartYear() {
    this.manageResetDisplay();
  }

  onChangeEndYear() {
    this.manageResetDisplay();
  }

  manageResetDisplay() {
    if (this.model.startingYear == 0 && this.model.endingYear == 0 &&
      this.model.selectedProjects.length == 0 && this.model.selectedSectors.length == 0 &&
      this.model.selectedOrganizations.length == 0 && this.model.selectedLocations.length == 0 &&
      this.model.selectedSubLocations.length == 0 && this.model.sectorLevel == 0 &&
      (!this.model.description || this.model.description.length == 0) &&
      (!this.model.lowerRange || this.model.lowerRange == 0) &&
      (!this.model.upperRange || this.model.upperRange == 0)) {
        this.isAnyFilterSet = false;
      } else {
        this.isAnyFilterSet = true;
      }
  }

  toggleCurrencyUsage() {
    this.model.useDefaultCurrency = !this.model.useDefaultCurrency;
    this.excelFile = null;
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  resetFilters() {
    this.model.selectedProjects = [];
    this.model.selectedSectors = [];
    this.model.selectedOrganizations = [];
    this.model.selectedLocations = [];
    this.model.selectedSubLocations = [];
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.model.sectorLevel = 0;
    this.model.description = null;
    this.model.lowerRange = null;
    this.model.upperRange = null;
    this.filteredSubLocationsList = this.subLocationsList;
    this.sectorsList = this.allSectorsList.filter(s => s.parentSectorId == 0);
    this.isAnyFilterSet = false;
  }

}
