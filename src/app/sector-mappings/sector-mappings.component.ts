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
  permissions: any = {};
  model: any = { sectorTypeId: null };
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

  getSectorMappings(id: string) {
    this.sectorService.getSectorMappings(id).subscribe(
      data => {
        if (data) {
          this.sectorMappings = data;
        }
      }
    )
  }

  getSectorForTypes() {
    if (this.model.sectorTypeId == null) {
      return false;
    }
    var id = this.model.sectorTypeId;
    this.sectorService.getSectorForTypes(id).subscribe(
      data => {
        if (data) {
          this.sectorsForType = data;
        }
      }
    )
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
