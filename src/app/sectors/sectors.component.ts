import { Component, OnInit } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {

  sectorsList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;
  permissions: any = {};

  constructor(private sectorService: SectorService, private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getSectorsList();
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.sectorsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchSectors() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.sectorService.filterSectors(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.sectorsList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.sectorsList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-sector/' + id);
  }

}
