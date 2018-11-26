import { Component, OnInit } from '@angular/core';
import { SectorCategoryService } from '../services/sector-category-service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-sector-categories',
  templateUrl: './sector-categories.component.html',
  styleUrls: ['./sector-categories.component.css']
})
export class SectorCategoriesComponent implements OnInit {

  sectorCategoriesList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;

  constructor(private sectorTypeService: SectorCategoryService, private router: Router,
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

    this.getSectorCategoriesList();
  }

  getSectorCategoriesList() {
    this.sectorTypeService.getSectorCategoriesList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.sectorCategoriesList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchSectorCategories() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.sectorTypeService.filterSectorCategories(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.sectorCategoriesList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.sectorCategoriesList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-sectorcategory/' + id);
  }

}
