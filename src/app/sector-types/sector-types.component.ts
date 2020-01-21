import { Component, OnInit } from '@angular/core';
import { SectorTypeService } from '../services/sector-types.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-sector-types',
  templateUrl: './sector-types.component.html',
  styleUrls: ['./sector-types.component.css']
})
export class SectorTypesComponent implements OnInit {

  sectorTypesList: any = [];
  filteredSectorTypesList: any = [];
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;

  constructor(private sectorTypeService: SectorTypeService, private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.management);
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
          this.filteredSectorTypesList = data;
        }
      }
    );
  }

  searchSectorTypes() {
    if (!this.criteria) {
        this.filteredSectorTypesList = this.sectorTypesList;
    } else {
      if (this.sectorTypesList.length > 0) {
        var criteria = this.criteria.toLowerCase();
          this.filteredSectorTypesList = this.sectorTypesList.filter(s => (s.typeName.toLowerCase().indexOf(criteria) != -1));
      }
    }
  }

  isTrue(val: string) {
    return (val) ? 'Yes' : 'No';
  }

  isSourceType(val: string) {
    return (val) ? 'IATI' : 'Manual';
  }

  displayIATICode(code) {
    return (code == 0) ? 'N/a' : code;
  }
  
  edit(id: string) {
    this.router.navigateByUrl('/manage-sectortype/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('delete-sectortype/' + id);
  }

}
