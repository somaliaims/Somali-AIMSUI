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

  sectorTypesList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;
  pagingSize: number = Settings.rowsPerPage;

  constructor(private sectorTypeService: SectorTypeService, private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
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

  isTrue(val) {
    return (val) ? 'Yes' : 'No';
  }
  
  edit(id: string) {
    this.router.navigateByUrl('/manage-sectortype/' + id);
  }

  delete(id: string) {
    this.router.navigateByUrl('delete-sectortype/' + id);
  }

}
