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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isSearchVisible = false;
  projectsList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};
  sectorsSettings: any = [];
  selectedSectors: any = []; 
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  organizationsSettings: any = [];
  locationsSettings: any = [];

  model: any = { title: '', organizationIds: [], startDate: null, endDate: null, 
  sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
  selectedLocations: []
  }
  sectorsList: any = [];
  organizationsList: any = [];
  locationsList: any = [];

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorService: SectorService, private organizationService: OrganizationService,
    private locationService: LocationService) { }

  ngOnInit() {
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.permissions = this.securityService.getUserPermissions();
    this.getProjectsList();
    this.getSectorsList();
    this.getOrganizationsList();
    this.getLocationsList();

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

  }

  getProjectsList() {
    this.blockUI.start('Loading Projects...');
    this.projectService.getProjectsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.projectsList = data;
          this.blockUI.stop();
        }
      },
      error => {
        this.blockUI.stop();
        console.log(error);
      }
    );
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectorsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  searchProjects() {
    this.blockUI.start('Searching Projects...');
    if (this.criteria != null) {
      this.projectService.filterProjects(this.criteria).subscribe(
        data => {
          if (data && data.length) {
            this.projectsList = data;
            this.blockUI.stop();
          }
        },
        error => {
          this.blockUI.stop();
        }
      );
    } else {
      this.getProjectsList();
    }
  }

  advancedSearchProjects() {
    var startDate = null;
    var endDate = null;

    if (this.model.startDate != null) {
      startDate = this.model.startDate.year + '-' + this.model.startDate.month + '-' + 
          this.model.startDate.day;
    }
    
    if (this.model.endDate != null) {
      endDate = this.model.endDate.year + '-' + this.model.endDate.month + '-' + 
          this.model.endDate.day;
    }

    var searchModel = {
      title: this.model.title,
      startDate: startDate,
      endDate: endDate,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
      locationIds: this.selectedLocations
    };    

    this.criteria = null;
    this.blockUI.start('Searching Projects...');
    this.projectService.searchProjectsViewByCriteria(searchModel).subscribe(
      data => {
        this.projectsList = data;
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
}
