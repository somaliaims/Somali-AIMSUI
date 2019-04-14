import { Component, OnInit } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';
import { SectorTypeService } from '../services/sector-types.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {

  sectorsList: any = [];
  inputTextHolder: string = 'Enter sector name';
  filteredSectorsList: any = [];
  sectorTypesList: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};
  model: any = { sectorTypeId: 0 };

  constructor(private sectorService: SectorService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorTypeService: SectorTypeService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('home');
    }

    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getSectorTypesList();
    this.getSectorsList();
  }

  getSectorTypesList() {
    this.sectorTypeService.getSectorTypesList().subscribe(
      data => {
        if (data) {
          this.sectorTypesList = data;
        }
      }
    )
  }

  getSectorsForType() {
    var typeId = this.model.sectorTypeId;
    this.criteria = null;
    if (typeId != null && typeId > 0) {
      this.filteredSectorsList = this.sectorsList.filter(s => s.sectorTypeId == typeId);
    } else if (typeId == 0) {
      this.filteredSectorsList = this.sectorsList;
    }
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.sectorsList = data;
          this.filteredSectorsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  /*searchSectors() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.sectorService.filterSectors(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.sectorsList = data;
            
            if (this.model.sectorTypeId && this.model.sectorTypeId > 0) {
              this.getSectorsForType();
            } else {
              this.filteredSectorsList = this.sectorsList;
            }
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.sectorsList();
    }
  }*/

  searchSectors() {
    if (!this.criteria) {
      if (this.model.sectorTypeId == 0) {
        this.filteredSectorsList = this.sectorsList;
      } else {
        this.filteredSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.model.sectorTypeId);
      }
    } else {
      if (this.sectorsList.length > 0) {
        var criteria = this.criteria.toLowerCase();
        if (this.model.sectorTypeId > 0) {
          this.filteredSectorsList = this.sectorsList.filter(s => (s.sectorTypeId == this.model.sectorTypeId && s.sectorName.toLowerCase().indexOf(criteria) != -1));
        } else {
          this.filteredSectorsList = this.sectorsList.filter(s => (s.sectorName.toLowerCase().indexOf(criteria) != -1));
        }
      }
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-sector/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('/delete-sector/' + id);
  }

}
