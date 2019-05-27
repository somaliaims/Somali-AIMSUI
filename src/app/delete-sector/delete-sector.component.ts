import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SectorService } from '../services/sector.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-delete-sector',
  templateUrl: './delete-sector.component.html',
  styleUrls: ['./delete-sector.component.css']
})
export class DeleteSectorComponent implements OnInit {

  sectorsList: any = [];
  projectsList: any = [];
  id: string = null;
  requestNo: number = 0;
  errorMessage: string = null;
  model: any = { sectorId: 0};
  isLoading: boolean = true;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private sectorService: SectorService, private route: ActivatedRoute,
    private storeService: StoreService, private errorModal: ErrorModalComponent,
    private router: Router) { }

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

    this.getSectorsList();
    this.getSectorProjects();
  }

  getSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        if (data) {
          this.sectorsList = data;
          this.sectorsList = this.sectorsList.filter(o => o.id != this.id);
        }
      }
    )
  }

  getSectorProjects() {
    this.sectorService.getSectorProjects(this.id).subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
        this.isLoading = false;
      }
    )
  }

  deleteAndMergeSector() {
    this.blockUI.start('Deleting sector...');
    this.sectorService.deleteSector(this.id, this.model.sectorId).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('sectors');
        }
        this.blockUI.stop();
      }
    )
  }


}
