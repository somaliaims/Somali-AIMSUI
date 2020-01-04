import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { SectorService } from 'src/app/services/sector.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';
import { Settings } from 'src/app/config/settings';
import { HelpService } from 'src/app/services/help-service';

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
  currentProjectSectors: any = [];
  @Input()
  defaultSectorsList: any = [];
  @Input()
  defaultSectorTypeId: number = 0;
  @Input()
  defaultSectorType: string = null;
  @Input()
  locationsList: any = [];
  @Input()
  currentProjectLocations: any = [];
  @Input()
  markersList: any = [];
  @Input()
  currentProjectMarkers: any = [];
  @Input()
  aimsProjects: any = [];
  @Input()
  iatiProjects: any = [];

  @Output()
  projectSectorsChanged = new EventEmitter<any[]>();
  @Output()
  projectLocationsChanged = new EventEmitter<any[]>();
  @Output()
  projectMarkersChanged = new EventEmitter<any[]>();
  @Output()
  proceedToFinish = new EventEmitter();

  fieldTypes: any = Settings.markerTypes;
  typeSectorsList: any = [];
  ndpSectorsList: any = [];
  sectorMappings: any = [];
  mappedSectorsList: any = [];
  newProjectSectors: any = [];
  sourceSectorsList: any = [];
  currentSelectedFieldValues: any = [];
  sectorsSettings: any = {};
  sectorHelp: any = { sectorType: null, sector: null, mappingSector: null, percentage: null };
  locationHelp: any = { location: null, percentage: null };
  mappingsCount: number = 0;
  sourceSectorPercentage: number = 0;
  requestNo: number = 0;
  currentTab: string = null;
  errorMessage: string = null;
  showMappingManual: boolean = false;
  showMappingAuto: boolean = false;
  isSectorsSourceAvailable: boolean = false;
  isLocationsSourceAvailable: boolean = false;
  isSectorHelpLoading: boolean = true;
  isLocationHelpLoading: boolean = true;
  isNdpSectorsLoading: boolean = true;
  sectorModel: any = { sectorTypeId: null, sector: null, selectedSector: null, sectorId: null, selectedMapping: null, mappingId: null, fundsPercentage: null, saved: false };
  newMappings: any = [];
  locationModel: any = { locationId: null, location: null, fundsPercentage: null, saved: false };
  fieldModel = { projectId: 0, fieldId: 0, values: [], dropdownId: null, newText: null };
  fieldTypeConstants: any = {
    'Dropdown': 1,
    'Checkbox': 2,
    'Text': 3,
    'Radio': 4
  }

  sourceTypes: any = {
    IATI: 'IATI',
    AIMS: 'AIMS'
  }

  displayTabs: any = [
    { visible: true, identity: 'sectors-locations' },
    { visible: false, identity: 'sectors-source' },
    { visible: false, identity: 'locations-source' },
  ];

  tabConstants: any = {
    SECTORS_LOCATIONS: 'sectors-locations',
    SECTORS_SOURCE: 'sectors-source',
    LOCATIONS_SOURCE: 'locations-source'
  };
  
  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private sectorService: SectorService,
    private storeService: StoreService, private errorModal: ErrorModalComponent,
    private helpService: HelpService) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.currentTab = this.tabConstants.SECTORS_LOCATIONS;
    this.sectorsSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: '',
      unSelectAllText: '',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.getProjectSectorHelp();
    this.getProjectLocationHelp();
  }

  getProjectSectorHelp() {
    this.helpService.getProjectSectorHelpFields().subscribe(
      data => {
        if (data) {
          this.sectorHelp = data;
        }
      }
    );
  }

  getProjectLocationHelp() {
    this.helpService.getProjectLocationHelpFields().subscribe(
      data => {
        if (data) {
          this.locationHelp = data;
        }
      }
    );
  }

  ngOnChanges() {
    this.iatiProjects.forEach(p => {
      if (p.sectors.length > 0) {
        this.isSectorsSourceAvailable = true;
        p.sectors.forEach((s) => {
          s.mappingId = 0;
        });
      }

      if (p.locations.length > 0) {
        this.isLocationsSourceAvailable = true;
      }
    });

    this.aimsProjects.forEach(p => {
      if (p.sectors.length > 0) {
        this.isSectorsSourceAvailable = true;
      }

      if (p.locations.length > 0) {
        this.isLocationsSourceAvailable = true;
      }
    });

    this.ndpSectorsList = this.defaultSectorsList.filter(s => s.parentSector != null);
    if (this.ndpSectorsList.length > 0) {
      this.isNdpSectorsLoading = false;
    } 
    
    if (this.currentTab == this.tabConstants.SECTORS_SOURCE) {
      this.isNdpSectorsLoading = false;
      this.ndpSectorsList = this.defaultSectorsList.filter(s => s.parentSector != null);
    }
  }

  getTypeSectorsList() {
    this.sectorModel.sectorId = null;
    if (!this.sectorModel.sectorTypeId) {
      this.typeSectorsList = [];
    } else {
      this.typeSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.sectorModel.sectorTypeId);
    }
    if (this.sectorModel.sectorTypeId == this.defaultSectorTypeId) {
      this.sectorMappings = this.defaultSectorsList;
    }
  }

  getNDPSectors() {
    if (this.defaultSectorTypeId) {
      this.ndpSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.defaultSectorTypeId);
    }
  }

  getSectorMappings() {
    if (this.defaultSectorTypeId != this.sectorModel.sectorTypeId) {
      this.blockUI.start('Fetching sector mappings...');
      var sectorId = this.sectorModel.sectorId;
      this.mappingsCount = 0;
      this.sectorMappings = [];

      this.sectorService.getMappingsForSector(sectorId).subscribe(
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
          this.blockUI.stop();
        }
      );
    }
  }

  getSectorMappingsByName() {
    if (this.defaultSectorTypeId != this.sectorModel.sectorTypeId) {
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
      );
    }
  }

  addSector(frm: any) {
    var sectorPercentage = this.sectorModel.fundsPercentage + this.calculateSectorPercentage();
    if (sectorPercentage > 100) {
      this.errorMessage = Messages.INVALID_PERCENTAGE;
      this.errorModal.openModal();
      return false;
    }

    if (this.sectorModel.sectorTypeId != this.defaultSectorTypeId) {
      if (!this.sectorModel.selectedSector) {
        this.errorMessage = 'Sector is requred';
        this.errorModal.openModal();
        return false;
      }
    }

    if (this.sectorModel.sectorTypeId != this.defaultSectorTypeId) {
      if (!this.sectorModel.selectedMapping) {
        this.errorMessage = 'Sector mapping is requred';
        this.errorModal.openModal();
        return false;
      }
    }

    var mappingId = 0;
    if (this.sectorModel.selectedMapping && this.sectorModel.selectedMapping.length > 0) {
      mappingId = this.sectorModel.selectedMapping[0].id;
    }

    var mappedSector = this.sectorsList.filter(s => s.id == mappingId);
    if (mappedSector.length > 0) {
      this.sectorModel.sector = mappedSector[0].sectorName;
    }

    var isSectorExists = [];
    if (this.defaultSectorTypeId == this.sectorModel.sectorTypeId) {
      isSectorExists = this.currentProjectSectors.filter(s => s.mappingId == mappingId && s.saved == false);
    } else {
      isSectorExists = this.currentProjectSectors.filter(s => s.mappingId == mappingId && s.saved == false);
    }
    
    if (isSectorExists.length > 0) {
      isSectorExists[0].fundsPercentage += this.sectorModel.fundsPercentage;
    } else {
      if (this.sectorModel.selectedSector && this.sectorModel.selectedSector.length > 0) {
        this.sectorModel.sectorId = this.sectorModel.selectedSector[0].id;
      }
      if (this.sectorModel.selectedMapping && this.sectorModel.selectedMapping.length > 0) {
        this.sectorModel.mappingId = this.sectorModel.selectedMapping[0].id;
      }
      this.currentProjectSectors.unshift(this.sectorModel);
    }
    
    var sectorTypeId = this.sectorModel.sectorTypeId;
    this.sectorModel = { sectorTypeId: null, sectorId: null, mappingId: null, saved: false };
    this.mappingsCount = 0;
    this.sectorMappings = [];
    frm.resetForm();
    setTimeout(() => {
      this.sectorModel.sectorTypeId = sectorTypeId;
    },500);
  }

  addLocation(frm: any) {
    var locationPercentage = this.locationModel.fundsPercentage + this.calculateLocationPercentage();
    if (locationPercentage > 100) {
      this.errorMessage = Messages.INVALID_PERCENTAGE;
      this.errorModal.openModal();
      return false;
    }

    var mappedLocation = this.locationsList.filter(l => l.id == this.locationModel.locationId);
    if (mappedLocation.length > 0) {
      this.locationModel.location = mappedLocation[0].location;
    }

    var islocationExists = this.currentProjectLocations.filter(l => l.locationId == this.locationModel.locationId && l.saved == false);
    if (islocationExists.length > 0) {
      islocationExists[0].fundsPercentage += this.locationModel.fundsPercentage;
    } else {
      this.currentProjectLocations.unshift(this.locationModel);
    }
    this.locationModel = { locationId: null, location: null, fundsPercentage: null, saved: false };
    frm.resetForm();
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

  removeProjectSector(id, isSomaliSector: boolean) {
    var filterSectorsList = [];
    if (isSomaliSector) {
      this.currentProjectSectors.forEach((s) => {
        if (s.saved) {
          filterSectorsList.push(s);
        } else if (!s.saved && s.mappingId != id) {
          filterSectorsList.push(s);
        }
      });
    } else {
      this.currentProjectSectors.forEach((s) => {
        if (s.saved) {
          filterSectorsList.push(s);
        } else if (!s.saved && s.sectorId != id) {
          filterSectorsList.push(s);
        }
      });
    }
    this.currentProjectSectors = filterSectorsList;
  }

  removeProjectLocation(id) {
    var filterLocationList = [];
    this.currentProjectLocations.forEach((l) => {
      if (l.saved) {
        filterLocationList.push(l);
      } else if (!l.saved && l.locationId != id) {
        filterLocationList.push(l);
      }
    });
    this.currentProjectLocations = filterLocationList;
  }

  deleteProjectSector(sectorId) {
    if (sectorId && this.projectId) {
      this.blockUI.start('Removing sector...');
      this.projectService.deleteProjectSector(this.projectId.toString(), sectorId).subscribe(
        data => {
          if (data) {
            this.currentProjectSectors = this.currentProjectSectors.filter(s => s.sectorId != sectorId);
            this.updateSectorsToParent();
            this.getProjectSectors();
          }
        }
      );
    }
  }

  deleteProjectLocation(locationId) {
    if (locationId && this.projectId) {
      this.blockUI.start('Removing location...');
      this.projectService.deleteProjectLocation(this.projectId.toString(), locationId).subscribe(
        data => {
          if (data) {
            this.currentProjectLocations = this.currentProjectLocations.filter(l => l.locationId != locationId);
            this.updateLocationsToParent();
            this.getProjectLocations();
          }
        }
      );
    }
  }

  areUnSavedSectors() {
    return this.currentProjectSectors.filter(s => s.saved == false).length > 0 ? true : false;
  }

  areUnSavedLocations() {
    return this.currentProjectLocations.filter(l => l.saved == false).length > 0 ? true : false;
  }

  calculateSectorPercentage() {
    var percentageList = this.currentProjectSectors.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  calculateLocationPercentage() {
    var percentageList = this.currentProjectLocations.map(l => parseInt(l.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  saveProjectSectors() {
    var unSavedSectors = this.currentProjectSectors.filter(s => !s.saved);
    if (unSavedSectors.length > 0 && this.projectId) {
      unSavedSectors.forEach(s => {
        if (!s.sectorId) {
          s.sectorId = s.mappingId;
        }
        if (s.sectorTypeId != this.defaultSectorTypeId && s.sectorId != s.mappingId) {
          this.newMappings.push({
            sectorTypeId: s.sectorTypeId,
            sectorId: s.sectorId,
            mappingId: s.mappingId
          });
        }
      });
      var model = {
        projectId: this.projectId,
        projectSectors: unSavedSectors,
        newMappings: this.newMappings
      };
      this.blockUI.start('Saving sectors');
      this.projectService.addProjectSector(model).subscribe(
        data => {
          if (data) {
            this.getProjectSectors();    
          }
        }
      );
    }
  }

  saveSourceSectors() {
    if (this.sourceSectorsList.length > 0) {
      var model = {
        projectId: this.projectId,
        projectSectors: this.sourceSectorsList,
        newMappings: []
      }

      this.blockUI.start('Saving sectors');
      this.projectService.addProjectSector(model).subscribe(
        data => {
          if (data) {
            this.getProjectSectors();  
            this.sourceSectorsList = [];
            setTimeout(() => {
              this.currentTab = this.tabConstants.SECTORS_LOCATIONS;
            }, 1000);  
            
          }
        }
      );
    }
  }

  saveProjectLocations() {
    var unSavedLocations = this.currentProjectLocations.filter(s => !s.saved);
    if (unSavedLocations.length > 0 && this.projectId) {
      var model = {
        projectId: this.projectId,
        projectLocations: unSavedLocations,
      };
      this.blockUI.start('Saving locations');
      this.projectService.addProjectLocation(model).subscribe(
        data => {
          if (data) {
            this.getProjectLocations();  
          }
        }
      );
    }
  }

  getProjectSectors() {
    this.projectService.getProjectSectors(this.projectId.toString()).subscribe(
      data => {
        if (data) {
          if (data.length > 0) {
            data.forEach(d => {
              d.saved = true;
            });
          }
          this.currentProjectSectors = data;
          this.currentProjectSectors.forEach((s) => {
            s.mappingId = s.sectorId
          });
          this.updateSectorsToParent();
        }
        this.blockUI.stop();
      }
    );
  }

  getProjectLocations() {
    this.projectService.getProjectLocations(this.projectId.toString()).subscribe(
      data => {
        if (data) {
          if (data.length > 0) {
            data.forEach(d => {
              d.saved = true;
            });
          }
          this.currentProjectLocations = data;
          this.updateLocationsToParent();
        }
        this.blockUI.stop();
      }
    );
  }

  selectFieldValue(fieldType: any, id: number, fieldId: number, el: any, isTypeText = false) {
    if (id == -1) {
      id = el.target.value;
    }

    if (!id) {
      return false;
    }

    var result = [];
    if (isTypeText) {
      result = this.markersList.filter(f => f.fieldType == fieldType && f.id == fieldId);
      if (result.length > 0) {
        var isExists = this.currentSelectedFieldValues.filter(f => f.fieldId == fieldId);
        if (isExists.length > 0) {
          this.fieldModel.newText = isExists[0].values[0].value;
        } else {
          var newTextField = {
            fieldId: fieldId,
            fieldType: fieldType,
            values: [
              { id: 1, value: result[0].values }
            ]
          };
          this.currentSelectedFieldValues.push(newTextField);
        }
      }
    } else {
      result = this.markersList.filter(f => f.fieldType == fieldType && f.id == fieldId).map(f => f.values)[0].filter(v => parseInt(v.id) == id);
      if (result.length > 0) {
        var values: any = [];

        if (el.currentTarget.type === 'checkbox') {
          if (!el.currentTarget.checked) {
            result = this.currentSelectedFieldValues.filter(f => f.fieldType == fieldType && f.fieldId == fieldId).map(f => f.values)[0].filter(v => parseInt(v.id) != id);
          }
        }

        if (this.currentSelectedFieldValues.length > 0) {
          var isExists = this.currentSelectedFieldValues.filter(f => f.fieldId == fieldId);
          if (isExists.length > 0) {
            if (fieldType != this.fieldTypeConstants.Checkbox) {
              isExists[0].values = [];
            }

            var isValueExists = isExists[0].values.filter(v => v.id == id);
            if (isValueExists.length == 0) {
              isExists[0].values.push({
                id: id,
                value: result[0].value
              });
            }
          } else {
            var newField = {
              fieldId: fieldId,
              fieldType: fieldType,
              values: [
                { id: result[0].id, value: result[0].value }
              ]
            };
            this.currentSelectedFieldValues.push(newField);
          }
        } else {
          var newField = {
            fieldId: fieldId,
            fieldType: fieldType,
            values: [
              { id: result[0].id, value: result[0].value }
            ]
          };
          this.currentSelectedFieldValues.push(newField);
        }
      }
    }
  }

  checkFieldType(typeId: number) {
    var result = this.fieldTypes.filter(f => f.typeId == typeId).map(f => f.field);
    return result;
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  checkIfSelected(fieldId: number, valId: number) {
   /*
   To update
   */
  }

  saveProjectMarkers(id: number) {
    var selectedField = this.currentSelectedFieldValues.filter(f => f.fieldId == id);
    if (selectedField.length > 0) {
      if (selectedField[0].values.length == 0) {
        this.errorMessage = Messages.INVALID_OPTION_VALUE;
        this.errorModal.openModal();
        return false;
      }

      var stringifiedJson = JSON.stringify(selectedField[0].values);
      var saveFieldModel = {
        projectId: this.projectId,
        markerId: id,
        fieldType: selectedField[0].fieldType,
        values: stringifiedJson
      }

      this.blockUI.start('Saving project marker...');
      this.projectService.saveProjectMarker(saveFieldModel).subscribe(
        data => {
          if (data) {
            var isFieldExists = this.currentProjectMarkers.filter(f => f.markerId == id);
            if (isFieldExists.length > 0) {
              var values = [];
              selectedField[0].values.forEach(function (v) {
                values.push({
                  id: v.id,
                  value: v.value
                });
              });
              isFieldExists[0].values = values;
            } else {
              var marker = this.markersList.filter(c => c.id == id);
              var fieldTitle = '';
              if (marker.length > 0) {
                fieldTitle = marker[0].fieldTitle;
              }

              var values = [];
              selectedField[0].values.forEach(function (v) {
                values.push({
                  id: v.id,
                  value: v.value
                });
              });

              this.currentProjectMarkers.push({
                markerId: id,
                fieldTitle: fieldTitle,
                fieldType: selectedField[0].fieldType,
                values: values,
                projectId: this.projectId
              });
            }

            this.updateMarkersToParent();
          }
          this.blockUI.stop();
        }
      );
    }
  }

  deleteProjectMarker(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var fieldId = arr[2];

    this.blockUI.start('Removing Field...');
    this.projectService.deleteProjectMarker(projectId, fieldId).subscribe(
      data => {
        if (data) {
          this.currentProjectMarkers = this.currentProjectMarkers.filter(c => c.markerId != fieldId);
          this.updateMarkersToParent();
        }
        this.blockUI.stop();
      }
    )
  }

  showSectorsSource() {
    this.currentTab = this.tabConstants.SECTORS_SOURCE;
  }

  showSectorsLocations() {
    this.currentTab = this.tabConstants.SECTORS_LOCATIONS;
  }

  showLocationsSource() {
    this.currentTab = this.tabConstants.LOCATIONS_SOURCE;
  }

  checkIfSectorAdded(sectorName: string) {
    if (sectorName && this.currentProjectSectors.length > 0) {
      return this.currentProjectSectors.filter(s => s.sector.toLowerCase() == sectorName.toLowerCase()).length > 0 ? true : false;
    }
    return false;
  }

  addSourceSectorToList(projectId: number, sectorId: number, type: string, sectorCode: number = 0, iatiSector: string = null) {
    var isSectorAdded = this.sourceSectorsList.filter(s => s.mappingId == sectorId);
    if (isSectorAdded.length > 0) {
      this.sourceSectorsList = this.sourceSectorsList.filter(s => s.mappingId != sectorId);
    } else {
      this.calculateSectorPercentageForSource();
      if (type == this.sourceTypes.IATI) {
        var project = this.iatiProjects.filter(p => p.id == projectId);
        if (project.length > 0) {
          var sectors = project[0].sectors;
          if (sectors && sectors.length > 0) {
            var sector = sectors.filter(s => s.code == sectorCode);
            if (sector.length > 0) {
              var fundsPercentage = sector[0].fundsPercentage;
              var mappingId = sector[0].mappingId;
              var sectorName = sector[0].sector;
              var sectorTypeCode = sector[0].sectorTypeCode;
              var sectorId = 0;
              var sourceSector = [];
              
              if (!fundsPercentage || fundsPercentage < 1 || fundsPercentage > 100) {
                this.errorMessage = 'Sector percentage' + Messages.PERCENTAGE_RANGE;
                this.errorModal.openModal();
                return false;
              }

              var totalPercentage = this.sourceSectorPercentage + fundsPercentage;
              if (totalPercentage > 100) {
                this.errorMessage = Messages.INVALID_PERCENTAGE;
                this.errorModal.openModal();
                return false;
              }

              if (sectorName) {
                sourceSector = this.sectorsList.filter(s => s.sectorName.toLowerCase() == sectorName.toLowerCase());
                if (sourceSector.length > 0) {
                  sectorId = sourceSector[0].id;
                }
              }

              this.sourceSectorsList.push({
                sectorTypeId: sectorTypeCode,
                sectorId: sectorId,
                mappingId: mappingId,
                sectorName: sectorName,
                sector: iatiSector,
                fundsPercentage: fundsPercentage
              });
            }
          }
        }
      } else if (type == this.sourceTypes.AIMS) {
        var project = this.aimsProjects.filter(p => p.id == projectId);
        if (project.length > 0) {
          var sectors = project[0].sectors;
          if (sectors && sectors.length > 0) {
            var sector = sectors.filter(s => s.sectorId == sectorId);
            if (sector.length > 0) {
              var fundsPercentage = sector[0].fundsPercentage;
              var mappingId = sector[0].sectorId;
              var sectorName = sector[0].sector;
              if (!fundsPercentage) {
                this.errorMessage = 'Sector percentage ' + Messages.PERCENTAGE_RANGE;
                this.errorModal.openModal();
                return false;
              }

              this.sourceSectorsList.push({
                sectorTypeId: this.defaultSectorTypeId,
                sectorId: mappingId,
                mappingId: mappingId,
                sector: sectorName,
                fundsPercentage: fundsPercentage
              });
            }
          }
        }
      }
    }
    this.calculateSectorPercentageForSource();
  }

  removeSourceSector(sectorId: number) {
    this.sourceSectorsList = this.sourceSectorsList.filter(s => s.mappingId != sectorId); 
  }

  calculateSectorPercentageForSource() {
    var fundsPercentage = 0;
    this.sourceSectorsList.forEach((s) => {
      fundsPercentage += s.fundsPercentage;
    });

    this.currentProjectSectors.forEach((s) => {
      fundsPercentage += s.fundsPercentage;
    });
    this.sourceSectorPercentage = fundsPercentage;
  }

  checkIfSectorInActionList(sectorId: number) {
    return this.sourceSectorsList.filter(s => s.mappingId == sectorId).length > 0 ? true : false;
  }

  proceedToNext() {
    this.proceedToFinish.emit();
  }

  /*Sending updated data to parent*/
  updateSectorsToParent() {
    this.projectSectorsChanged.emit(this.currentProjectSectors);
  }

  updateLocationsToParent() {
    this.projectLocationsChanged.emit(this.currentProjectLocations);
  }

  updateMarkersToParent() {
    this.projectMarkersChanged.emit(this.currentProjectMarkers);
  }

}
