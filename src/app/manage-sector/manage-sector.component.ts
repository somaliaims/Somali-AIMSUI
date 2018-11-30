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
  model = { id: 0, sectorName: '', categoryId: 0, subCategoryId: 0 };

  constructor(private sectorService: SectorService, private route: ActivatedRoute,
    private router: Router, private sectorTypeService: SectorTypeService,
    private categoryService: SectorCategoryService, private subcategoryService: SectorSubCategoryService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    this.getSectorTypes();
    this.getCategories();
    this.getSubCategories();

    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Sector';
        this.isForEdit = true;
        this.orgId = id;
        this.sectorService.getSector(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.sectorName = data.sectorName;
            this.model.categoryId = data.categoryId;
            this.model.subCategoryId = data.subCategoryId;
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

  filterCategories(e) {
    console.log(this.categories);
    var id = console.log(e.target.value);
    this.filteredCategories = this.categories.filter(function (category) {
      category.sectorTypeId === id;
    });
    console.log(this.filteredCategories);
  }

  getSubCategories() {
    this.subcategoryService.getSectorSubCategoriesList().subscribe(
      data => {
        this.subCategories = data;
      },
      error => {
      }
    )
  }

  filterSubCategories() {

  }

  saveSector() {
    var model = {
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
            var message = 'Sector Type' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-types');
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
