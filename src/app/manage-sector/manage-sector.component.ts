import { Component, OnInit, Input } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SectorTypeService } from '../services/sector-types.service';
import { SectorCategoryService } from '../services/sector-category-service';
import { SectorSubCategoryService } from '../services/sector-subcategory-service';

@Component({
  selector: 'app-manage-sector',
  templateUrl: './manage-sector.component.html',
  styleUrls: ['./manage-sector.component.css']
})
export class ManageSectorComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Sector';
  errorMessage: string = '';
  sectorTypes: any = [];
  categories: any = [];
  filteredCategories: any = [];
  subCategories: any = [];
  filteredSubCategories: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { id: 0, sectorName: '', sectorTypeId: null, categoryId: null, subCategoryId: null };

  constructor(private sectorService: SectorService, private route: ActivatedRoute,
    private router: Router, private sectorTypeService: SectorTypeService,
    private categoryService: SectorCategoryService, private subcategoryService: SectorSubCategoryService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Sector';
        this.isForEdit = true;
        this.orgId = id;
      }
    }

    this.getSectorTypes();
    this.getCategories();
    this.getSubCategories();

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getSectorTypes() {
    this.sectorTypeService.getSectorTypesList().subscribe(
      data => {
        this.sectorTypes = data;
      },
      error => {
      }
    )
  }

  getCategories() {
    this.categoryService.getSectorCategoriesList().subscribe(
      data => {
        this.categories = data;
      },
      error => {
      }
    )
  }

  loadSectorData() {
    this.sectorService.getSector(this.orgId.toString()).subscribe(
      data => {
        this.model.id = data.id;
        this.model.sectorTypeId = data.sectorTypeId;
        this.model.sectorName = data.sectorName;

        //Filter categories for the selected sector type
        this.filteredCategories = this.categories.filter(function (category) {
          return category.id == data.categoryId;
        });
        this.model.categoryId = data.categoryId;

        //Filter sub-categories for the selected category
        this.filteredSubCategories = this.subCategories.filter(function (subCategory) {
          return subCategory.id == data.subCategoryId;
        });
        
        this.model.subCategoryId = data.subCategoryId;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  filterCategories(e) {
    var id = e.target.value;
    this.filteredCategories = this.categories.filter(function (category) {
      return category.sectorTypeId == id;
    });
  }

  getSubCategories() {
    this.subcategoryService.getSectorSubCategoriesList().subscribe(
      data => {
        this.subCategories = data;
        if (this.isForEdit) {
          this.loadSectorData();
        }
      },
      error => {
      }
    )
  }

  filterSubCategories(e) {
    var categoryId = e.target.value;
    this.filteredSubCategories = this.subCategories.filter(function (sCategory) {
      return sCategory.categoryId == categoryId;
    });
  }

  saveSector() {
    var model = {
      SectorTypeId: this.model.sectorTypeId,
      CategoryId: this.model.categoryId,
      SubCategoryId: this.model.subCategoryId,
      SectorName: this.model.sectorName,
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.sectorService.updateSector(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Sector' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sectors');
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
      this.sectorService.addSector(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New sector' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sectors');
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
      this.btnText = 'Edit Sector';
    } else {
      this.btnText = 'Add Sector';
    }
  }

}
