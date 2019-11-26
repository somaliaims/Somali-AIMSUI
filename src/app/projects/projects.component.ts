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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isSearchVisible = false;
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
  searchField: FormControl;

  sectorLevels: any = [
    { "id": 1, "level": "Parent sectors"},
    { "id": 2, "level": "Sub sectors"},
    { "id": 3, "level": "Sub sub sectors"},
  ];

  sectorLevelCodes: any = {
    SECTORS: 1,
    SUB_SECTORS: 2,
    SUB_SUB_SECTORS: 3
  }

  model: any = {
    title: null, description: null, organizationIds: [], startingYear: 0, endingYear: 0,
    sectorIds: [], locationIds: [], parentSectorId: 0, selectedProjects: [], selectedSectors: [], 
    selectedOrganizations: [], selectedLocations: [], sectorsList: [], locationsList: [], 
    organizationsList: [], sectorLevel: this.sectorLevelCodes.SECTORS
  }

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorService: SectorService, private organizationService: OrganizationService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private errorModal: ErrorModalComponent, private infoModal: InfoModalComponent
  ) { }

  ngOnInit() {
    this.blockUI.start('Loading Projects...');
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
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
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
    }
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
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
        }
      }
    );
  }

  advancedSearchProjects() {
    var searchModel = {
      projectIds: this.model.projectIds,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
      locationIds: this.selectedLocations,
      description: this.model.description
    };

    this.criteria = null;
    this.blockUI.start('Searching Projects...');
    this.projectService.searchProjectsViewByCriteria(searchModel).subscribe(
      data => {
        if (data) {
          this.projectsList = data;  
          this.filteredProjectsList = data;
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

  onSectorSelect(item: any) {
    var id = item.id;
    if (this.selectedSectors.indexOf(id) == -1) {
      this.selectedSectors.push(id);
    }
  }

  onSectorDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedSectors.indexOf(id);
    this.selectedSectors.splice(index, 1);
  }

  onSectorSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedSectors.indexOf(id) == -1) {
        this.selectedSectors.push(id);
      }
    }.bind(this))
  }

  onOrganizationSelect(item: any) {
    var id = item.id;
    if (this.selectedOrganizations.indexOf(id) == -1) {
      this.selectedOrganizations.push(id);
    }
  }

  onOrganizationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedOrganizations.indexOf(id);
    this.selectedOrganizations.splice(index, 1);
  }

  onOrganizationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedOrganizations.indexOf(id) == -1) {
        this.selectedOrganizations.push(id);
      }
    }.bind(this));
  }

  onLocationSelect(item: any) {
    var id = item.id;
    if (this.selectedLocations.indexOf(id) == -1) {
      this.selectedLocations.push(id);
    }
  }

  onLocationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedLocations.indexOf(id);
    this.selectedLocations.splice(index, 1);
  }

  onLocationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedLocations.indexOf(id) == -1) {
        this.selectedLocations.push(id);
      }
    }.bind(this));
  }

  showSearchOptions() {
    this.isSearchVisible = true;
    return false;
  }

  hideSearchOptions() {
    this.isSearchVisible = false;
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

}
