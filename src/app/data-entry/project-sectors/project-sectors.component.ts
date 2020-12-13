import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { SectorService } from 'src/app/services/sector.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { Messages } from 'src/app/config/messages';
import { Settings } from 'src/app/config/settings';
import { HelpService } from 'src/app/services/help-service';
import { SublocationModalComponent } from 'src/app/sublocation-modal/sublocation-modal.component';

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
  subLocationsList: any = [];
  @Input()
  currentProjectLocations: any = [];
  
  @Input()
  aimsProjects: any = [];
  @Input()
  iatiProjects: any = [];

  @Output()
  projectSectorsChanged = new EventEmitter<any[]>();
  @Output()
  projectLocationsChanged = new EventEmitter<any[]>();
  @Output()
  proceedToNext = new EventEmitter();

  typeSectorsList: any = [];
  ndpSectorsList: any = [];
  sectorMappings: any = [];
  mappedSectorsList: any = [];
  newProjectSectors: any = [];
  sourceSectorsList: any = [];
  selectedSubLocations: any = [];
  settledSublocations: any = [];
  sectorsSettings: any = {};
  sectorsWithCodeSettings: any = {};
  sectorHelp: any = { sectorType: null, sector: null, mappingSector: null, percentage: null };
  locationHelp: any = { location: null, percentage: null };
  mappingsCount: number = 0;
  sourceSectorPercentage: number = 0;
  selectedLocationId: number = 0;
  requestNo: number = 0;
  currentTab: string = null;
  errorMessage: string = null;
  selectedLocationName: string = null;
  showMappingManual: boolean = false;
  showMappingAuto: boolean = false;
  isSectorsSourceAvailable: boolean = false;
  isLocationsSourceAvailable: boolean = false;
  isSectorHelpLoading: boolean = true;
  isLocationHelpLoading: boolean = true;
  isNdpSectorsLoading: boolean = true;
  isShowSubLocationsSettings: boolean = false;
  sectorModel: any = { sectorTypeId: null, sector: null, selectedSector: null, sectorId: null, selectedMapping: null, mappingId: null, fundsPercentage: null, saved: false };
  newMappings: any = [];
  locationModel: any = { locationId: null, location: null, fundsPercentage: null, saved: false };

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
    private helpService: HelpService,
    private sublocationModal: SublocationModalComponent) { }

  ngOnInit() {
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.blockUI.stop();
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.currentTab = this.tabConstants.SECTORS_LOCATIONS;
    this.sectorsSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'sectorWithCode',
      selectAllText: '',
      unSelectAllText: '',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.getProjectSectorHelp();
    this.getProjectLocationHelp();
    if (this.currentProjectSectors.length == 0) {
      this.blockUI.start('Wait loading data...');
      this.getProjectSectors();
    }
    if (this.currentProjectLocations.length == 0) {
      if (!this.blockUI.isActive) {
        this.blockUI.start('Wait loading data...');
        this.getProjectLocations();
      }
    }
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

    this.locationsList = this.locationsList.filter(l => l.isUnAttributed == false);
  }

  getTypeSectorsList() {
    this.sectorModel.sectorId = null;
    this.showMappingAuto = false;
    this.showMappingManual = false;
    this.sectorModel.selectedSector = null;

    if (!this.sectorModel.sectorTypeId) {
      this.typeSectorsList = [];
    } else {
      var typeSectorsList = this.sectorsList.filter(s => s.sectorTypeId == this.sectorModel.sectorTypeId);
      this.typeSectorsList = typeSectorsList.sort(this.storeService.sortArrayByProperty("sectorName"));
    }
    this.getNDPSectors();
  }

  getNDPSectors() {
    if (this.defaultSectorTypeId) {
      var ndpSectors = this.sectorsList.filter(s => s.sectorTypeId == this.defaultSectorTypeId && s.parentSectorId != 0);
      this.ndpSectorsList = ndpSectors.sort(this.storeService.sortArrayByProperty("sectorName"));
    }
  }

  getSectorMappings() {
    this.sectorModel.selectedMapping = null;
    if (this.defaultSectorTypeId != this.sectorModel.sectorTypeId) {
      if (this.sectorModel.selectedSector && this.sectorModel.selectedSector.length > 0) {
        this.blockUI.start('Fetching sector mappings...');
        var sectorId = this.sectorModel.selectedSector[0].id;
        this.mappingsCount = 0;
        this.sectorMappings = [];

        this.sectorService.getMappingsForSector(sectorId).subscribe(
          data => {
            if (data && data.length > 0) {
              this.showMappingManual = true;
              this.showMappingAuto = false;
              this.mappedSectorsList = data;
              this.ndpSectorsList = data;
              this.mappingsCount = data.length;
              if (data.length >= 1) {
                this.sectorModel.mappingId = data[0].id;
              }
            } else {
              this.mappingsCount = 0;
            }
            this.blockUI.stop();
          }
        );
      }
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
    var sectorPercentage = parseFloat(this.sectorModel.fundsPercentage) + parseFloat(this.calculateSectorPercentage());
    if (sectorPercentage > 100) {
      this.errorMessage = Messages.INVALID_PERCENTAGE;
      this.errorModal.openModal();
      return false;
    }
    this.sectorModel.fundsPercentage = parseFloat(this.sectorModel.fundsPercentage.toFixed(2));

    if (this.sectorModel.sectorTypeId != this.defaultSectorTypeId) {
      if (!this.sectorModel.selectedSector) {
        this.errorMessage = 'Sector is required';
        this.errorModal.openModal();
        return false;
      }
    }

    if (this.sectorModel.sectorTypeId == this.defaultSectorTypeId) {
      if (!this.sectorModel.selectedMapping || (this.sectorModel.selectedMapping && this.sectorModel.selectedMapping.length == 0)) {
        this.errorMessage = 'NDP sector is required';
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
    this.ndpSectorsList = this.defaultSectorsList.filter(s => s.parentSector != null);
    frm.resetForm();
    setTimeout(() => {
      this.sectorModel.sectorTypeId = sectorTypeId;
    },500);
  }

  addLocation(frm: any) {
    var locationPercentage = parseFloat(this.locationModel.fundsPercentage) + parseFloat(this.calculateLocationPercentage());
    if (locationPercentage > 100) {
      this.errorMessage = Messages.INVALID_PERCENTAGE;
      this.errorModal.openModal();
      return false;
    }

    this.locationModel.fundsPercentage = parseFloat(this.locationModel.fundsPercentage.toFixed(2));
    var mappedLocation = this.locationsList.filter(l => l.id == this.locationModel.locationId);
    if (mappedLocation.length > 0) {
      this.locationModel.location = mappedLocation[0].location;
    }

    var islocationExists = this.currentProjectLocations.filter(l => l.locationId == this.locationModel.locationId && l.saved == false);
    if (islocationExists.length > 0) {
      islocationExists[0].fundsPercentage += this.locationModel.fundsPercentage;
    } else {
      this.locationModel.subLocations = [];
      this.currentProjectLocations.unshift(this.locationModel);
    }
    this.locationModel = { locationId: null, location: null, fundsPercentage: null, saved: false };
    frm.resetForm();
  }

  openSubLocationsForLocation(id) {
    if (id) {
      this.selectedLocationId = id;
      var location = this.locationsList.filter(l => l.id == id);
      if (location.length > 0) {
        this.selectedLocationName = location[0].locationName;
        var projectLocation = this.currentProjectLocations.filter(l => l.locationId == id);
        if (projectLocation.length > 0) {
          if (projectLocation[0].subLocations.length > 0) {
            this.settledSublocations = projectLocation[0].subLocations;
          } else {
            this.settledSublocations = [];
          }
        }
      }
      this.selectedSubLocations = this.subLocationsList.filter(s => s.locationId == id);
      this.isShowSubLocationsSettings = true;
      this.sublocationModal.openModal();
    } else {
      this.selectedLocationId = 0;
    }
  }

  updateSubLocationsForLocation($event) {
    var subLocationData = $event;
    if (subLocationData) {
      var locationId = subLocationData.locationId;
      var selectedLocationArr = this.currentProjectLocations.filter(l => l.locationId == locationId);
      if (selectedLocationArr.length > 0) {
        var selectedLocation = selectedLocationArr[0];
        selectedLocation.subLocations = subLocationData.subLocations;
      } 
    }
    this.isShowSubLocationsSettings = false;
  }

  setManualMappings() {
    this.showMappingManual = false;
    this.showMappingAuto = true;
    this.getNDPSectors();
  }

  setAutomaticMappings() {
    this.ndpSectorsList = this.mappedSectorsList;
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
    this.newMappings = this.newMappings.filter(m => m.sectorId != id);
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
            this.newMappings = this.newMappings.filter(m => m.sectorId != sectorId);
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
    var percentageList = this.currentProjectSectors.map(s => parseFloat(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  calculateLocationPercentage() {
    var percentageList = this.currentProjectLocations.map(l => parseFloat(l.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  saveProjectSectors() {
    var unSavedSectors = this.currentProjectSectors.filter(s => !s.saved);
    if (unSavedSectors.length > 0 && this.projectId) {
      unSavedSectors.forEach(s => {
        if (!s.sectorId) {
          s.sectorTypeId = s.sectorTypeId;
          s.sectorId = s.mappingId;
        }
        if (s.sectorTypeId != this.defaultSectorTypeId && s.sectorId != s.mappingId) {
          var exists = this.newMappings.filter(m => m.sectorId == s.sectorId && m.mappingId == s.mappingId);
          if (exists.length == 0) {
            this.newMappings.push({
              sectorTypeId: s.sectorTypeId,
              sectorId: s.sectorId,
              mappingId: s.mappingId
            });
          }
        }
      });

      unSavedSectors.forEach((s) => {
        s.sectorTypeId = parseInt(s.sectorTypeId);
        s.sectorId = parseInt(s.sectorId);
      });

      this.newMappings.forEach((m) => {
        m.sectorTypeId = parseInt(m.sectorTypeId);
        m.sectorId = parseInt(m.sectorId);
        m.mappingId = parseInt(m.mappingId);
      });

      var sectorIds = unSavedSectors.map(s => parseInt(s.sectorId));
      this.newMappings = this.newMappings.filter(m => sectorIds.includes(m.sectorId));
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
      this.sourceSectorsList.forEach((s) => {
        s.sectorTypeId = parseInt(s.sectorTypeId);
      });
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
      unSavedLocations.forEach((l) => {
        l.locationId = parseInt(l.locationId);
      });
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
              fundsPercentage = parseFloat(fundsPercentage);

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
                sectorTypeId: this.defaultSectorTypeId,
                sectorId: sectorId,
                mappingId: parseInt(mappingId),
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

  proceedToMarkers() {
    var unSavedSectors = this.currentProjectSectors.filter(s => !s.saved);
    if (unSavedSectors.length > 0) {
      this.errorMessage = 'You have unsaved sectors data. Please save data first before proceeding next.';
      this.errorModal.openModal();
      return false;
    }
    var unSavedLocations = this.currentProjectLocations.filter(l => !l.saved);
    if (unSavedLocations.length > 0) {
      this.errorMessage = 'You have unsaved locations data. Please save data first before proceeding next.';
      this.errorModal.openModal();
      return false;
    }
    this.updateSectorsToParent();
    this.updateLocationsToParent();
    this.proceedToNext.emit();
  }

  displaySubLocations(subLocations: any = []) {
    var subLocationsStr = '';
    if (subLocations && subLocations.length > 0) {
      subLocationsStr = subLocations.map(l => l.subLocation).join(', ');
    }
    return subLocationsStr;
  }

  /*Sending updated data to parent*/
  updateSectorsToParent() {
    this.projectSectorsChanged.emit(this.currentProjectSectors);
  }

  updateLocationsToParent() {
    this.projectLocationsChanged.emit(this.currentProjectLocations);
  }

  onDeSelectSector() {
    this.sectorModel.selectedSector = null;
    this.sectorModel.selectedMapping = null;
    this.ndpSectorsList = this.defaultSectorsList.filter(s => s.parentSector != null);
    this.showMappingAuto = false;
    this.showMappingManual = false;
    this.mappingsCount = 0;
  }

}
