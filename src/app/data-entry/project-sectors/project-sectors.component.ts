import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'project-sectors',
  templateUrl: './project-sectors.component.html',
  styleUrls: ['./project-sectors.component.css']
})
export class ProjectSectorsComponent implements OnInit {

  @Input()
  projectId: number = 0;
  @Input()
  sectorTypesList: any = [];
  @Input()
  sectorsList: any = [];
  @Input()
  defaultSectorsList: any = [];
  @Input()
  defaultSectorTypeId: number = 0;
  @Input()
  defaultSectorType: string = null;

  typeSectorsList: any = [];
  sectorMappings: any = [];
  mappedSectorsList: any = [];
  newProjectSectors: any = [];
  mappingsCount: number = 0;
  showMappingManual: boolean = false;
  showMappingAuto: boolean = false;
  sectorModel: any = { sectorTypeId: null, sectorId: null, sectorName: null, mappingId: null, fundsPercentage: null };

  constructor(private projectService: ProjectService, private sectorService: SectorService) { }

  ngOnInit() {
  }

  getTypeSectorsList() {
    this.sectorModel.sectorId = null;
    if (!this.sectorModel.sectorTypeId) {
      this.typeSectorsList = [];
    } else {
      this.typeSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.sectorModel.sectorTypeId);
    }
  }

  getSectorMappings() {
    var sectorName = this.sectorModel.sectorName;
    this.mappingsCount = 0;
    this.sectorMappings = [];

    this.sectorService.getMappingsForSectorByName(sectorName).subscribe(
      data => {
        if (data && data.length > 0) {
          this.showMappingManual = true;
          this.showMappingAuto = false;
          this.sectorMappings = data;
          this.mappedSectorsList = data;
          this.mappingsCount = data.length;
          if (data.length >= 1) {
            this.sectorModel.mappingId = data[0].id;
          }
        } else {
          this.mappingsCount = 0;
          this.sectorMappings = this.defaultSectorsList;
        }
      }
    )
  }

  setManualMappings() {
    this.sectorMappings = this.defaultSectorsList;
    this.showMappingManual = false;
    this.showMappingAuto = true;
  }

  setAutomaticMappings() {
    this.sectorMappings = this.mappedSectorsList;
    this.showMappingAuto = false;
    this.showMappingManual = true;
  }

}
