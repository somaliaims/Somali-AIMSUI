import { Component, OnInit } from '@angular/core';
import { Settings } from '../config/settings';
import { SectorTypeService } from '../services/sector-types.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-sectorTypetypes',
  templateUrl: './sectorTypetypes.component.html',
  styleUrls: ['./sectorTypetypes.component.css']
})
export class SectorTypesComponent implements OnInit {

  sectorTypesList: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};

  constructor(private sectorTypeService: SectorTypeService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSectorTypes) {
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
  }

  getSectorTypesList() {
    this.sectorTypeService.getSectorTypesList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.sectorTypesList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchSectorTypes() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.sectorTypeService.filterSectorTypes(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.sectorTypesList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.sectorTypesList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-sectortype/' + id);
  }

}
