import { Component, OnInit } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sector-mappings',
  templateUrl: './sector-mappings.component.html',
  styleUrls: ['./sector-mappings.component.css']
})
export class SectorMappingsComponent implements OnInit {
  errorMessage: string = null;
  defaultSectors: any = [];
  sectorTypes: any = [];
  sectorsForType: any = [];
  sectorMappings: any = [];
  newMappings: any = [];
  isLoadingMappings: boolean = false;
  permissions: any = {};
  model: any = { selectedSectorId: null, sectorTypeId: null };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private sectorService: SectorService, private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.getDefaultSectors();
    this.getOtherSectorTypes();
  }

  getDefaultSectors() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        if (data) {
          this.defaultSectors = data;
        }
      }
    )
  }

  getOtherSectorTypes() {
    this.sectorService.getOtherSectorTypes().subscribe(
      data => {
        if (data) {
          this.sectorTypes = data;
        }
      }
    )
  }

  getSectorMappings() {
    var id = this.model.selectedSectorId;
    if (id) {
      this.isLoadingMappings = true;
      this.sectorMappings.length = 0;
      this.sectorService.getSectorMappings(id).subscribe(
        data => {
          if (data) {
            this.sectorMappings = data;
            console.log(this.sectorMappings);
          }
          this.isLoadingMappings = false;
        }
      );
    }
  }

  getSectorsForType() {
    if (this.model.sectorTypeId == null) {
      return false;
    }
    var id = this.model.sectorTypeId;
    this.sectorService.getSectorsForType(id).subscribe(
      data => {
        if (data) {
          this.sectorsForType = data;
        }
      }
    )
  }

  viewMappings(e) {
    var id = e.target.id.split('-')[1];
    if (id) {
      this.model.selectedSectorId = id;
      this.getSectorMappings();
    }
  }

  mapSector(e) {
    var id = e.target.id.split('-')[1];
    if (id) {
      var selectSector = this.sectorsForType.filter(s => s.id == id);
      if (selectSector.length > 0) {
        this.newMappings.push(selectSector[0]);
      }
    }
  }

  unMapSector(e) {
    var id = e.target.id.split('-')[1];
    if (id) {
      var selectSector = this.sectorsForType.filter(s => s.id == id);
      if (selectSector.length > 0) {
        this.newMappings = this.newMappings.filter(s => s.id != id);
      }
    }
  }

  saveNewMappings() {
    if (this.model.selectedSectorId == null) {
      this.errorMessage = Messages.INVALID_SECTOR_MAPPING;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving mappings...');
    var ids = this.newMappings.map(m => m.id);
    var model = {
      sectorTypeId: this.model.sectorTypeId,
      sectorId: this.model.selectedSectorId,
      mappingIds: ids
    };

    this.sectorService.saveSectorMappings(model).subscribe(
      data => {
        if (data) {
          for(var i=0; this.newMappings.length; i++) {
            this.sectorMappings.push(this.newMappings[i]);
          }
          this.newMappings = [];
        }
        this.blockUI.stop();
      }
    )
  }

  deleteMapping(e) {
    var mappingId = e.target.id.split('-')[2];
    if (mappingId) {
      this.blockUI.start('Deleting mapping...');
      this.sectorService.deleteSectorMapping(this.model.selectedSectorId, mappingId).subscribe(
        data => {
          if (data) {
          }
          this.blockUI.stop();
        }
      )
    } 
  }

}
