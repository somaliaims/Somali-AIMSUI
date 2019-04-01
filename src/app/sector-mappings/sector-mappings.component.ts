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

}
