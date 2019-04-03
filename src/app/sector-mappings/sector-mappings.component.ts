import { Component, OnInit } from '@angular/core';
import { SectorService } from '../services/sector.service';

@Component({
  selector: 'app-sector-mappings',
  templateUrl: './sector-mappings.component.html',
  styleUrls: ['./sector-mappings.component.css']
})
export class SectorMappingsComponent implements OnInit {
  defaultSectors: any = [];
  sectorTypes: any = [];
  sectorsForType: any = [];
  sectorMappings: any = [];
  isLoadingMappings: boolean = false;
  permissions: any = {};
  model: any = { selectedSectorId: null, sectorTypeId: null };
  constructor(private sectorService: SectorService) { }

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
      this.sectorMappings = [];
      this.sectorService.getSectorMappings(id).subscribe(
        data => {
          if (data) {
            this.sectorMappings = data;
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
    var id = e.target.value.split('-')[1];
    if (id) {
      
    }
  }

  unMapSector(e) {
    var id = e.target.value.split('-')[1];
    if (id) {
      
    }
  }

}
