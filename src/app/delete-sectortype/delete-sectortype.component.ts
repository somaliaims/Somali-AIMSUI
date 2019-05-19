import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SectorTypeService } from '../services/sector-types.service';
import { SectorService } from '../services/sector.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-delete-sectortype',
  templateUrl: './delete-sectortype.component.html',
  styleUrls: ['./delete-sectortype.component.css']
})
export class DeleteSectortypeComponent implements OnInit {
  id: number = 0;
  requestNo: number = 0;
  errorMessage: string = null;
  deletionMessage: string = 'Deletion confirmation';
  sectors: any = [];
  isLoading: boolean = true;
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private route: ActivatedRoute, private storeService: StoreService,
    private errorModal: ErrorModalComponent, private sectorService: SectorService,
    private sectorTypeService: SectorTypeService, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      this.id = this.route.snapshot.params["{id}"];
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    if (!this.id) {
      this.router.navigateByUrl('sector-types');
    }

    this.getSectorsForType();
  }

  getSectorsForType() {
    this.sectorService.getSectorsForType(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.sectors = data;
          if (this.sectors.length > 0) {
            this.deletionMessage = 'Deletion message';
          }
        }
        this.isLoading = false;
      }
    )
  }

  showList() {
    this.router.navigateByUrl('sector-types');
  }

  delete() {
    this.blockUI.start('Deleting sector type...');
    this.sectorTypeService.deleteSectorType(this.id.toString()).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('sector-types');
        }
        this.blockUI.stop();
      }
    );
  }

}
