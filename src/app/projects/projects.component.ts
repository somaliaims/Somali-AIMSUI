import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
import { SectorService } from '../services/sector.service';
import { OrganizationService } from '../services/organization-service';
import { LocationService } from '../services/location.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FinancialYearService } from '../services/financial-year.service';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormControl, FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Identifiers } from '@angular/compiler';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Messages } from '../config/messages';
import { CurrencyService } from '../services/currency.service';
import { ProjectReportModalComponent } from '../project-report-modal/project-report-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  defaultCurrency: string = null;
  isSearchVisible = false;
  isAnyFilterSet = false;
  projectsList: any = [];
  filteredProjectsList: any = [];
  errorMessage: string = null;
  successMessage: string = null;
  criteria: string = null;
  isLoading: boolean = false;
  infoMessage: string = null;
  showMessage: boolean = false;
  isLoggedIn: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  requestNo: number = 0;
  permissions: any = {};
  projectsSettings: any = {};
  sectorsSettings: any = {};
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  organizationsSettings: any = [];
  locationsSettings: any = [];
  projectTitles: any = [];
  yearsList: any = [];
  organizationsList: any = [];
  locationsList: any = [];
  userProjectIds: any = [];
  deleteProjectIds: any = [];
  allSectorsList: any = [];
  sectorsList: any = [];
  sectorIds: any = [];
  subSectorIds: any = [];
  subSubSectorIds: any = [];
  financialRanges: any = Settings.financialRangeConstants;
  searchField: FormControl;
  currentYearLabel: string = '';
  viewProjectId: number = 0;
  renderReport: boolean = false;

  //variables for project report
  projectData: any = [];
  projectLocations: any = [];
  projectSectors: any = [];
  projectFunders: any = [];
  projectImplementers: any = [];
  projectDisbursements: any = [];
  projectDocuments: any = [];
  projectMarkers: any = [];
  isExcelGenerating: boolean = true;
  excelFile: string = null;
  projectProfileLink: string = null;


  sectorLevels: any = [
    { "id": 1, "level": "Parent sectors"},
    { "id": 2, "level": "Sub sectors"},
    //{ "id": 3, "level": "Sub sub sectors"},
  ];

  sectorLevelCodes: any = {
    SECTORS: 1,
    SUB_SECTORS: 2,
  }

  model: any = {
    title: null, description: null, organizationIds: [], startingYear: 0, endingYear: 0,
    sectorIds: [], locationIds: [], parentSectorId: 0, selectedProjects: [], selectedSectors: [], 
    selectedOrganizations: [], selectedLocations: [], sectorsList: [], locationsList: [], 
    organizationsList: [], sectorLevel: this.sectorLevelCodes.SECTORS, financialRange: 0,
    lowerRange: null, upperRange: null
  }

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorService: SectorService, private organizationService: OrganizationService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private errorModal: ErrorModalComponent, private infoModal: InfoModalComponent,
    private currencyService: CurrencyService,
    private projectReportModal: ProjectReportModalComponent
  ) { }

  ngOnInit() {
    this.blockUI.start('Loading Projects...');
    this.getDefaultCurrency();
    this.isLoggedIn = this.securityService.checkIsLoggedIn();
    if (this.isLoggedIn) {
      this.loadUserProjects();
      this.getDeleteProjectIds();
    } else {
      this.getProjectsList();
    }

    this.storeService.newReportItem(Settings.dropDownMenus.projects);
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.permissions = this.securityService.getUserPermissions();
    this.getProjectTitles();
    this.getSectorsList();
    this.getOrganizationsList();
    this.getLocationsList();
    this.getFinancialYearsList();

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
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
    var id = item.id;
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

  changeFinancialRange() {
    if (this.model.financialRange) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
    }
  }

  onDeSelectOrganization(item: any) {
    var id = item.id;
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
  }

  onDeSelectLocation(item: any) {
    var id = item.id;
    if (this.model.selectedLocations.length == 0) {
      this.manageResetDisplay();
    } else {
      this.setFilter();
    }
  }

  onSelectAllLocations(items: any) {
    this.setFilter();
  }

  onDeSelectAllLocations(items: any) {
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
    if (this.model.description.length > 0) {
      this.setFilter();
    } else {
      this.manageResetDisplay();
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

        case this.sectorLevelCodes.SUB_SUB_SECTORS:
            this.sectorsList = this.allSectorsList.filter(s => this.subSubSectorIds.indexOf(s.id) != -1);
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

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
        } 
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

  filterProjects() {
    if (this.model.title) {
      var title = this.model.title.toLowerCase();
      this.filteredProjectsList = this.projectsList.filter(p => p.title.toLowerCase().indexOf(title) != -1);
    } else {
      this.filteredProjectsList = this.projectsList;
    }
  }

  getProjectsList() {
    this.projectService.getProjectsList().subscribe(
      data => {
        if (data && data.length) {
          this.projectsList = data;
          this.filteredProjectsList = data;
          this.currentYearLabel = data[0].currentYearLabel;
        }
        this.blockUI.stop();
      }
    );
  }

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      data => {
        if (data) {
          this.userProjectIds = data;
        }
        setTimeout(() => {
          this.getProjectsList();
        }, 1000);
        
      }
    );
  }

  getFinancialYearsList() {
    this.fyService.getYearsList().subscribe(
      data => {
        if (data) {
          this.yearsList = data;
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
        }
      }
    );
  }

  getOrganizationsList() {
    this.organizationService.getUserOrganizations().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
        }
      }
    );
  }

  advancedSearchProjects() {
    var lowerRange = this.model.lowerRange ? this.model.lowerRange : 0;
    var upperRange = this.model.upperRange ? this.model.upperRange : 0;
    if (isNaN(lowerRange) || isNaN(upperRange)) {
      this.errorMessage = 'Project value for lower/upper range must be a valid number';
      this.errorModal.openModal();
      return false;
    }

    var searchModel = {
      projectIds: this.model.selectedProjects.map(p => p.id),
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.model.selectedOrganizations.map(o => o.id),
      sectorIds: this.model.selectedSectors.map(s => s.id),
      locationIds: this.model.selectedLocations.map(l => l.id),
      description: this.model.description,
      lowerRange: lowerRange,
      upperRange: upperRange
    };

    this.criteria = null;
    this.blockUI.start('Searching Projects...');
    this.projectService.searchProjectsViewByCriteria(searchModel).subscribe(
      data => {
        if (data) {
          this.projectsList = data;  
          this.filteredProjectsList = data;
          this.currentYearLabel = data[0].currentYearLabel;
        }
        this.blockUI.stop();
      }
    )
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-project/' + id);
  }

  viewDetails(id: string) {
    this.router.navigateByUrl('/view-project/' + id);
  }

  showSearchOptions() {
    this.isSearchVisible = true;
    return false;
  }

  hideSearchOptions() {
    this.isSearchVisible = false;
  }

  formatNumber(value: number) {
    if (!value) {
      return value;
    }
    if (!isNaN(value) && value > 0) {
      return this.storeService.getNumberWithCommas(value);
    }
    return value;
  }

  formatDateUKStyle(dated: any) {
    var validDate = Date.parse(dated);
    if (isNaN(validDate)) {
      return 'Invalid date';
    }
    var datesArr = dated.split('/');
    return this.storeService.formatDateInUkStyle(parseInt(datesArr[2]), parseInt(datesArr[0]), parseInt(datesArr[1]));
  }

  isShowContactToUser(id: number) {
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? false : true;
  }

  isShowDeleteProject(id: number) {
    if (this.deleteProjectIds.includes(id)) {
      return false;
    }
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? true : false;
  }

  contactProject(id: number) {
    if (id) {
      this.router.navigateByUrl('contact-project/' + id);
    }
  }

  makeDeleteRequest(id: number) {
    if (id) {
      var model = { projectId: id, userId: 0 };
      this.blockUI.start('Making project delete request...');
      this.projectService.makeProjectDeletionRequest(model).subscribe(
        data => {
          if (data) {
            this.deleteProjectIds.push(id);
            this.successMessage = Messages.DELETION_REQUEST_INFO;
            this.infoModal.openModal();
          }
          this.blockUI.stop();
        }
      );
    }
  }

  getDeleteProjectIds() {
    this.projectService.getDeleteProjectIds().subscribe(
      data => {
        if (data) {
          this.deleteProjectIds = data;
        }
      }
    );
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  manageResetDisplay() {
    if (this.model.selectedProjects.length == 0 && this.model.startingYear == 0 &&
      this.model.endingYear == 0 && this.model.parentSectorId == 0 &&
      this.model.selectedSectors.length == 0 && this.model.selectedOrganizations.length == 0 &&
      this.model.selectedLocations.length == 0 && !this.model.description) {
      this.isAnyFilterSet = false;
    } else {
      this.isAnyFilterSet = true;
    }
  }

  viewProject(id: number) {
    if (this.renderReport) {
      this.renderReport = false;
    }
    this.blockUI.start('Wait loading...');
    if (id) {
      this.viewProjectId = id;
      setTimeout(() => {
        this.renderReport = true;
        this.blockUI.stop();
      }, 1000);
    }
  }

  setReportRenderStatus(status: boolean) {
    this.renderReport = status;
    console.log('Report render: ' + status);
  }

  resetFilters() {
    this.model.selectedProjects = [];
    this.model.selectedOrganizations = [];
    this.model.selectedLocations = [];
    this.model.selectedSectors = [];
    this.model.financialRange = 0;
    this.model.startingYear = 0;
    this.model.endingYear = 0;
    this.model.description = null;
    this.isAnyFilterSet = false;
  }

  //Section for viewing project report
  getProjectReport(id: number) {
    this.projectService.getProjectReport(id.toString()).subscribe(
      data => {
        if (data && data.projectProfile) {
          var project = data.projectProfile.projects.length > 0 ? data.projectProfile.projects[0] : null;
          if (project) {
              this.projectData.title = project.title;
              this.projectData.startDate = project.startDate;
              this.projectData.endDate = project.endDate;
              this.projectData.dateUpdated = project.dateUpdated;
              this.projectData.projectCurrency = project.projectCurrency;
              this.projectData.projectValue = project.projectValue;
              this.projectData.exchangeRate = project.exchangeRate;
              this.projectData.description = project.description;
              this.projectFunders = project.funders;
              this.projectImplementers = project.implementers;
              this.projectSectors = project.sectors;
              this.projectLocations = project.locations;
              this.projectDisbursements = project.disbursements;
              this.projectDocuments = project.documents;
              this.projectMarkers = project.markers;
              this.isLoading = false;
            }
          }
      });
  }

  /*getProjectExcelReport(id: number) {
    this.projectService.getProjectReport(id.toString()).subscribe(
      data => {
        if (data) {
          if (data.reportSettings) {
            this.excelFile = data.reportSettings.excelReportName;
            this.projectProfileLink = data.reportSettings.reportUrl;
            var currentDate = this.storeService.getLongDateString(new Date());
            //this.dated = currentDate;
            this.setExcelFile();
            var projects = data.projectProfile.projects;
            if (projects.length > 0) {
              var project = projects[0];
              this.projectMarkers = project.markers.filter(m => m.values != '');
            }
          }
          this.isExcelGenerating = false;
        }
      }
    );
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }*/

}
