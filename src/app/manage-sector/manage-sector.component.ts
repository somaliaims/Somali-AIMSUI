import { Component, OnInit, Input } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SectorTypeService } from '../services/sector-types.service';
import { Settings } from '../config/settings';

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
  btnText: string = 'Add sector';
  sectorTabText: string = 'New sector';
  errorMessage: string = '';
  sectors: any = [];
  sectorTypes: any = [];
  sectorChildren: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { id: 0, sectorTypeId: 0, sectorName: null, parentId: 0 };
  childModel = { childSectorId: null };
  permissions: any = {};
  @BlockUI() blockUI: NgBlockUI;

  constructor(private sectorService: SectorService, private route: ActivatedRoute,
    private router: Router, private errorModal: ErrorModalComponent,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private sectorTypeService: SectorTypeService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('sectors');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.model.id = id;
      }
    }
    
    this.getSectorTypes();
    if (this.model.id != 0) {
        this.btnText = 'Edit Sector';
        this.sectorTabText = 'Edit sector';
        this.isForEdit = true;
        this.sectorId = id;
        this.loadSectorData();
        this.getSectorChildren(id);
        this.isDvDisabled = false;
    }

    this.requestNo = this.storeService.getNewRequestNumber();
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
        if (data) {
          this.sectorTypes = data;
          var sectorType = this.sectorTypes.filter(s => s.isPrimary == true);
          if (sectorType.length > 0) {
            this.model.sectorTypeId = sectorType[0].id;
            this.getSectors();
          }
        }
      }
    )
  }

  getSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        if (data) {
          var sectors = data;
          this.sectors = sectors.filter(s => s.sectorTypeId == this.model.sectorTypeId);
          if (this.model.id != 0) {
            if (this.sectors.filter(s => s.id == this.model.id).length == 0) {
              this.router.navigateByUrl('sectors');
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getSectorChildren(id: string) {
    this.sectorService.getSectorChildren(id).subscribe(
      data => {
        if (data) {
          this.sectorChildren = data;
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  loadSectorData() {
    this.sectorService.getSector(this.sectorId.toString()).subscribe(
      data => {
        if (data) {
          this.model.id = data.id;
          this.model.sectorTypeId = data.sectorTypeId;
          this.model.parentId = data.parentId;
          this.model.sectorName = data.sectorName;
        }
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveSector() {
    var model = {
      SectorTypeId: this.model.sectorTypeId,
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
    this.blockUI.start('Saving sector child...');
    this.sectorService.setChild(this.model.id.toString(), this.childModel.childSectorId).subscribe(
      data => {
        if (data) {
          var sector = this.sectors.filter(s => s.id == this.childModel.childSectorId);
          if (sector && sector.length > 0) {
            var newChild = {
              id: sector[0].id,
              sectorName: sector[0].sectorName
            }
            this.sectorChildren.push(newChild);
          }
        } else {
          this.resetFormState();
        }
        this.blockUI.stop();
      },
      error => {
        this.errorMessage = error;
        this.errorModal.openModal();
        this.resetFormState();
        this.blockUI.stop();
      }
    );
  }

  removeChildSector(id) {
    this.blockUI.start('Removing sector child...');
    this.sectorService.removeChild(this.model.id.toString(), id).subscribe(
      data => {
        if (data) {
          var sector = this.sectors.filter(s => s.id == id);
          if (sector && sector.length > 0) {
            var newChild = {
              id: sector[0].id,
              sectorName: sector[0].sectorName
            }
            this.sectorChildren = this.sectorChildren.filter(s => s.id != id);
          }
        } else {
          this.resetFormState();
        }
        this.blockUI.stop();
      },
      error => {
        this.errorMessage = error;
        this.errorModal.openModal();
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
