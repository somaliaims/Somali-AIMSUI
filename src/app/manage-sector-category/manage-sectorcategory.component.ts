import { Component, OnInit, Input } from '@angular/core';
import { SectorCategoryService } from '../services/sector-category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SectorTypeService } from '../services/sector-types.service';

@Component({
  selector: 'app-manage-sectorcategory',
  templateUrl: './manage-sectorcategory.component.html',
  styleUrls: ['./manage-sectorcategory.component.css']
})
export class ManageSectorCategoryComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Sector Category';
  errorMessage: string = '';
  sectorCategoryTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  sectorTypes: any = [];
  model = { id: 0, category: '', sectorTypeId: 0 };

  constructor(private sectorCategoryService: SectorCategoryService, private route: ActivatedRoute,
    private router: Router, private sectorTypeService: SectorTypeService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    this.getSectorTypes();
    
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Sector Category';
        this.isForEdit = true;
        this.orgId = id;
        this.sectorCategoryService.getSectorCategory(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.category = data.category;
            this.model.sectorTypeId = data.sectorTypeId;
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
    this.sectorTypeService.getSectorTypesList().subscribe(data => {
      if (data && data.length) {
        this.sectorTypes = data
      }
    },
      error => {
      }
    );
  }

  saveSectorCategory() {
    var model = {
      Category: this.model.category,
      SectorTypeId: this.model.sectorTypeId
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.sectorCategoryService.updateSectorCategory(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Sector Category' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-categories');
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
      this.sectorCategoryService.addSectorCategory(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New sectorCategory' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-categories');
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
      this.btnText = 'Edit Sector Category';
    } else {
      this.btnText = 'Add Sector Category';
    }
  }

}
