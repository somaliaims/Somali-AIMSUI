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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isSearchVisible = false;
  projectsList: any = [];
  errorMessage: string = null;
  criteria: string = null;
  isLoading: boolean = false;
  infoMessage: string = null;
  showMessage: boolean = false;
  isLoggedIn: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  requestNo: number = 0;
  permissions: any = {};
  sectorsSettings: any = [];
  selectedSectors: any = [];
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  organizationsSettings: any = [];
  locationsSettings: any = [];
  yearsList: any = [];
  sectorsList: any = [];
  organizationsList: any = [];
  locationsList: any = [];
  userProjectIds: any = [];
  deleteProjectIds: any = [];
  searchField: FormControl;

  model: any = {
    title: '', organizationIds: [], startingYear: 0, endingYear: 0,
    sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
    selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: []
  }

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorService: SectorService, private organizationService: OrganizationService,
    private locationService: LocationService, private fyService: FinancialYearService,
    private errorModal: ErrorModalComponent
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

    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(_ => (this.isLoading = true)),
      switchMap(term => this.projectService.filterProjects(term)),
      tap(_ => (this.isLoading = false))
    ).subscribe(
      data => {
        this.projectsList = data;
      },
      error => {
        console.log(error);
      }
    )

  }

  getProjectsList() {
    this.projectService.getProjectsList().subscribe(
      data => {
        if (data && data.length) {
          this.projectsList = data;
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
    this.sectorService.getSectorsList().subscribe(
      data => {
        if (data) {
          this.sectorsList = data;
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
      title: this.model.title,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
      locationIds: this.selectedLocations
    };

    this.criteria = null;
    this.blockUI.start('Searching Projects...');
    this.projectService.searchProjectsViewByCriteria(searchModel).subscribe(
      data => {
        if (data) {
          this.projectsList = data;  
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
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
