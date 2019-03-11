import { Component, OnInit, Input } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SectorTypeService } from '../services/sector-types.service';
import { SectorCategoryService } from '../services/sector-category-service';
import { SectorSubCategoryService } from '../services/sector-subcategory-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-manage-sector',
  templateUrl: './manage-sector.component.html',
  styleUrls: ['./manage-sector.component.css']
})
export class ManageSectorComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  isDvDisabled: boolean = true;
  sectorId: number = 0;
  btnText: string = 'Add Sector';
  errorMessage: string = '';
  sectors: any = [];
  sectorTypes: any = [];
  categories: any = [];
  filteredCategories: any = [];
  subCategories: any = [];
  filteredSubCategories: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { id: 0, sectorName: null, parentId: 0 };
  childModel = { childSectorId: null };
  permissions: any = {};
  @BlockUI() blockUI: NgBlockUI;

  constructor(private sectorService: SectorService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('sectors');
    }

    this.getSectors();
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Sector';
        this.isForEdit = true;
        this.sectorId = id;
        this.loadSectorData();
        this.isDvDisabled = false;
      }
    }

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }


  getSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectors = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadSectorData() {
    this.sectorService.getSector(this.sectorId.toString()).subscribe(
      data => {
        this.model.id = data.id;
        this.model.parentId = data.parentId;
        this.model.sectorName = data.sectorName;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveSector() {
    var model = {
      SectorName: this.model.sectorName,
      ParentId: this.model.parentId,
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

  saveChildSector() {
    var model = {
      parentSectorId: this.model.id,
      childSector: this.childModel.childSectorId
    };

    this.blockUI.start('Saving sector...');
    this.sectorService.addSector(model).subscribe(
      data => {
        if (data) {

        } else {
          this.resetFormState();
        }
        this.blockUI.stop();
      },
      error => {
        this.errorMessage = error;
        this.isError = true;
        this.resetFormState();
        this.blockUI.stop();
      }
    );
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
