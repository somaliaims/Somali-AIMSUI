import { Component, OnInit } from '@angular/core';
import { SectorService } from '../services/sector.service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-sector-mappings',
  templateUrl: './sector-mappings.component.html',
  styleUrls: ['./sector-mappings.component.css']
})
export class SectorMappingsComponent implements OnInit {
  inputTextHolder: string = 'Enter sector name to search';
  errorMessage: string = null;
  requestNo: number = 0;
  defaultSectors: any = [];
  sectorTypes: any = [];
  sectorsList: any = [];
  defaultSectorTypeId: number = 0;
  selectedSectorTypeId: number = 0;
  filteredSectors: any = [];
  sectorsForType: any = [];
  filteredSectorsForType: any = [];
  sectorMappings: any = [];
  allSectorMappings: any = [];
  newMappings: any = [];
  isLoadingMappings: boolean = false;
  isLoadingSectorsForType: boolean = false;
  permissions: any = {};
  isLoading: boolean = false;
  criteria: string = null;
  otherCriteria: string = null;
  model: any = { selectedSectorId: null, sectorTypeId: null };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private sectorService: SectorService, private errorModal: ErrorModalComponent,
    private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getSectorTypes();
    this.getAllSectors();
    this.getAllSectorsMappings();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  getSectorTypes() {
    this.sectorService.getSectorTypes().subscribe(
      data => {
        if (data) {
          this.sectorTypes = data;
          var defaultType = this.sectorTypes.filter(s => s.isDefault == true);
          if (defaultType.length > 0) {
            this.defaultSectorTypeId = defaultType[0].id;
            this.defaultSectors = this.sectorsList.filter(s => s.sectorTypeId == this.defaultSectorTypeId);
            this.sectorTypes = this.sectorTypes.filter(t => t.id != this.defaultSectorTypeId);
          }
        }
      }
    );
  }

  getAllSectors() {
    this.sectorService.getAllSectors().subscribe(
      data => {
        if (data) {
          this.sectorsList = data;
        }
      }
    );
  }

  getAllSectorsMappings() {
    this.sectorService.getAllSectorMappings().subscribe(
      data => {
        if (data) {
          this.allSectorMappings = data;
        }
      }
    );
  }

  getSectorMappings() {
    var id = this.model.selectedSectorId;
    if (id) {
      this.isLoadingMappings = true;
      this.sectorMappings.length = 0;
      this.sectorService.getSectorMappings(id).subscribe(
        data => {
          if (data) {
            if (!data.mappedSectors) {
              this.sectorMappings.length = 0;
            } else {
              this.sectorMappings = data.mappedSectors;
            }
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
  
    this.filteredSectorsForType = this.sectorsList.filter(s => s.sectorTypeId == this.model.sectorTypeId);
    this.filteredSectorsForType.forEach((s) => {
      var mapping = this.allSectorMappings.filter(s => s.sectorId == s.id);
      if (mapping.length > 0) {
        s.mappingId = mapping[0].mappingId;
      } else {
        s.mappingId = null;
      }
    });
  }

  viewMappings(e) {
    var id = e.target.id.split('-')[1];
    if (id) {
      this.model.selectedSectorId = id;
      this.getSectorMappings();
    }
  }

  filterSectors() {
    if (!this.criteria) {
        this.filteredSectors = this.defaultSectors;
    } else {
      if (this.defaultSectors.length > 0) {
        var criteria = this.criteria.toLowerCase();
        this.filteredSectors = this.defaultSectors.filter(s => s.sectorName.toLowerCase().indexOf(criteria) != -1);
      }
    }
  }

  filterOtherSectors() {
    if (!this.otherCriteria) {
      this.filteredSectorsForType = this.sectorsForType;
    } else {
      if (this.sectorsForType.length > 0) {
        var criteria = this.otherCriteria.toLowerCase();
        this.filteredSectorsForType = this.sectorsForType.filter(s => s.sectorName.toLowerCase().indexOf(criteria) != -1);
      }
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
          var mappings = [];
          if (this.sectorMappings && this.sectorMappings.length > 0) {
            mappings = this.sectorMappings.filter(s => s.sectorTypeId == this.model.sectorTypeId);
          }

          if (mappings.length > 0) {
            for(var i=0; i < this.newMappings.length; i++) {
              var newMapping = {
                sectorId: this.newMappings[i].id,
                sector: this.newMappings[i].sectorName
              };
              mappings[0].sectors.push(newMapping);
            }
          } else {
            var sectorTypeName = '';
            var sectorTypeObj = this.sectorTypes.filter(s => s.id == this.model.sectorTypeId);
            if (sectorTypeObj.length > 0) {
              var sectors: any = [];
              sectorTypeName = sectorTypeObj[0].typeName;
              for(var i=0; i < this.newMappings.length; i++) {
                sectors.push({
                  sectorId: this.newMappings[i].id,
                  sector: this.newMappings[i].sectorName
                });
              }

              var newSectorType = {
                sectorTypeId: this.model.sectorTypeId,
                sectorType: sectorTypeName,
                sectors: sectors
              }

              if (!this.sectorMappings) {
                this.sectorMappings = [];
              }
              this.sectorMappings.push(newSectorType);
            }
          }
          this.newMappings = [];
        }
        this.blockUI.stop();
      }
    )
  }

  deleteMapping(e) {
    var idsArr = e.target.id.split('-');
    var sectorTypeId = idsArr[1];
    var mappingId = idsArr[2];

    if (mappingId) {
      this.blockUI.start('Deleting mapping...');
      this.sectorService.deleteSectorMapping(this.model.selectedSectorId, mappingId).subscribe(
        data => {
          if (data) {
            var mapping = this.sectorMappings.filter(s => s.sectorTypeId == sectorTypeId);
            if (mapping.length > 0) {
              mapping[0].sectors = mapping[0].sectors.filter(s => s.sectorId != mappingId);
            }
          }
          this.blockUI.stop();
        }
      )
    } 
  }

  checkIfSectorMapped(id) {
    if (this.sectorMappings.length > 0 && this.sectorMappings[0].sectors) {
      var isMapped = this.sectorMappings[0].sectors.filter(s => s.sectorId == id);
      return isMapped.length > 0 ? true : false;
    }
    return false;
  }

}
