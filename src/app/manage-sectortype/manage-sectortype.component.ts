import { Component, OnInit, Input } from '@angular/core';
import { SectorTypeService } from '../services/sector-types.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { SectorService } from '../services/sector.service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-manage-sectortype',
  templateUrl: './manage-sectortype.component.html',
  styleUrls: ['./manage-sectortype.component.css']
})
export class ManageSectortypeComponent implements OnInit {

  @Input()
  sectorsList: any = [];
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  typeId: number = 0;
  btnText: string = 'Add sector type';
  errorMessage: string = '';
  sectorTypeTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  permissions: any = {};
  model = { id: 0, typeName: '', sourceUrl: null, isPrimary: false, isSourceType: false };

  constructor(private sectorTypeService: SectorTypeService, private route: ActivatedRoute,
    private router: Router, private securityService: SecurityHelperService,
    private sectorService: SectorService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSector) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit sector type';
        this.isForEdit = true;
        this.typeId = id;
        this.sectorTypeService.getSectorType(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.typeName = data.typeName;
            this.model.isPrimary = (data.isPrimary == null) ? false : data.isPrimary ;
            this.model.isSourceType = (data.isSourceType == null) ? false : data.isSourceType;
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

  getSectorsForType(id: string) {
    this.sectorService.getSectorsForType(id).subscribe(
      data => {
        this.sectorsList = data;
      }
    )
  }

  toggleDefault() {
    this.model.isPrimary = (this.model.isPrimary) ? false : true;
  }

  toggleSourceType() {
    this.model.isSourceType = (this.model.isSourceType) ? false : true;
  }

  saveSectorType() {
    var model = {
      TypeName: this.model.typeName,
      Id: parseInt(this.model.id.toString()),
      isPrimary: this.model.isPrimary,
      isSourceType: this.model.isSourceType,
      sourceUrl: this.model.sourceUrl
    };

    this.isBtnDisabled = true;
    if (!model.isPrimary) {
      model.isPrimary = false;
    }

    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.sectorTypeService.updateSectorType(this.model.id, model).subscribe(
        data => {
          if (data) {
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
      model.isSourceType = false;
      this.sectorTypeService.addSectorType(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New sectorType' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('sector-types');
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
      this.btnText = 'Edit Sector Type';
    } else {
      this.btnText = 'Add Sector Type';
    }
  }

}
