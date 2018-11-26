import { Component, OnInit } from '@angular/core';
import { SectorSubCategoryService } from '../services/sector-subcategory-service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-sector-subcategories',
  templateUrl: './sector-subcategories.component.html',
  styleUrls: ['./sector-subcategories.component.css']
})
export class SectorSubCategoriesComponent implements OnInit {

  sectorSubCategoriesList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;

  constructor(private sectorSubCategoryService: SectorSubCategoryService, private router: Router,
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

    this.getSectorSubCategoriesList();
  }

  getSectorSubCategoriesList() {
    this.sectorSubCategoryService.getSectorSubCategoriesList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.sectorSubCategoriesList = data;
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
      
      this.sectorSubCategoryService.filterSectorSubCategories(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.sectorSubCategoriesList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.sectorSubCategoriesList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-sectorsubcategory/' + id);
  }

}
