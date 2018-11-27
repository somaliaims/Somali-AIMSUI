import { Component, OnInit, Input } from '@angular/core';
import { SectorSubCategoryService } from '../services/sector-subcategory-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectorCategoryService } from '../services/sector-category-service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'manage-sector-subcategory',
  templateUrl: './manage-sector-subcategory.component.html',
  styleUrls: ['./manage-sector-subcategory.component.css']
})
export class ManageSectorSubCategoryComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Sector Sub-Category';
  errorMessage: string = '';
  sectorSubCategoryTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  sectorCategories: any = [];
  model = { id: 0, subCategory: '', categoryId: 1 };

  constructor(private sectorSubCategoryService: SectorSubCategoryService, private route: ActivatedRoute,
    private router: Router, private sectorCategoryService: SectorCategoryService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    this.getSectorCategories();
    
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Sector Sub-Category';
        this.isForEdit = true;
        this.orgId = id;
        this.sectorSubCategoryService.getSectorSubCategory(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.subCategory = data.subCategory;
            this.model.categoryId = data.categoryId;
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      } 
    } 

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getSectorCategories() {
    this.sectorCategoryService.getSectorCategoriesList().subscribe(data => {
      if (data && data.length) {
        this.sectorCategories = data

        if (!this.isForEdit && data.length > 0) {
          this.model.categoryId = data[0].id;
        } 
      }
    },
      error => {
      }
    );
  }

  saveSectorSubCategory() {
    var model = {
      SubCategory: this.model.subCategory,
      CategoryId: this.model.categoryId
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.sectorSubCategoryService.updateSectorSubCategory(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Sector Sub-Category' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-subcategories');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.resetFormState();
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.sectorSubCategoryService.addSectorSubCategory(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New Sector Sub-Category' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-subcategories');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    if (this.isForEdit) {
      this.btnText = 'Edit Sector Sub-Category';
    } else {
      this.btnText = 'Add Sector Sub-Category';
    }
  }

}
