import { Component, OnInit, Input } from '@angular/core';
import { SectorTypeService } from '../services/sector-types.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-manage-sectortype',
  templateUrl: './manage-sectortype.component.html',
  styleUrls: ['./manage-sectortype.component.css']
})
export class ManageSectortypeComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Sector Type';
  errorMessage: string = '';
  sectorTypeTypes: any = null;
  requestNo: number = 0;
  isError: boolean = false;
  model = { id: 0, typeName: '' };

  constructor(private sectorTypeService: SectorTypeService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit SectorType';
        this.isForEdit = true;
        this.orgId = id;
        this.sectorTypeService.getSectorType(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.typeName = data.typeName;
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

  saveSectorType() {
    var model = {
      TypeName: this.model.typeName,
      Id: this.model.id
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.sectorTypeService.updateSectorType(this.model.id, model).subscribe(
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
