import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';
import { IATIService } from '../services/iati.service';
import { ProjectService } from '../services/project.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Messages } from '../config/messages';
import { Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { Sector } from '../models/sector-model';
import { Location } from '../models/location-model';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ProjectInfoModalComponent } from '../project-info-modal/project-info-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocationService } from '../services/location.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { OrganizationService } from '../services/organization-service';
import { ProjectiInfoModalComponent } from '../projecti-info-modal/projecti-info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { CurrencyService } from '../services/currency.service';
import { Organization } from '../models/organization-model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CustomeFieldService } from '../services/custom-field.service';
import { Settings } from '../config/settings';
import { FundingTypeService } from '../services/funding-type.service';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})

export class ProjectEntryComponent implements OnInit {
  isExRateAutoConvert = false;
  filteredOrganizations: Observable<Organization[]>;
  filteredImplementers: Observable<Organization[]>;
  activeProjectId: number = 0;
  selectedSectorId: number = 0;
  selectedFunderId: number = 0;
  selectedImplementerId: number = 0;
  selectedLocationId: number = 0;
  selectedParentSectorId: number = 0;
  sectorTotalPercentage: number = 0;
  locationTotalPercentage: number = 0;
  totalFunds: number = 0;
  mappingsCount: number = 0;
  totalDisbursements: number = 0;
  btnProjectText: string = 'Save Project';
  btnProjectSectorText: string = 'Add Sector';
  btnProjectLocationText: string = 'Add Location';
  btnProjectDocumentText: string = 'Add Document';
  btnProjectFunderText: string = 'Add Funder';
  btnProjectImplementerText: string = 'Add Implementer';
  sectorPlaceHolder: string = 'Enter/Select Sector';
  locationPlaceHolder: string = 'Enter/Select Location';
  exRatePlaceHolder: string = 'Exchange rate';
  isProjectBtnDisabled: boolean = false;
  isProjectBtnSectorDisabled: boolean = false;
  isProjectLocationBtnDisabled: boolean = false;
  isProjectDocumentBtnDisabled: boolean = false;
  isProjectFunderBtnDisabled: boolean = false;
  isProjectImplementerBtnDisabled: boolean = false;
  isSectorVisible: boolean = false;
  isAimsLoading: boolean = false;
  isIatiLoading: boolean = false;
  isFundingExRateReadonly: boolean = true;
  isDisbursementExRateReadonly: boolean = true;
  requestNo: number = 0;
  isError: boolean = false;
  infoMessage: string = '';
  showMessage: boolean = false;
  isForEdit: boolean = false;
  showMappingManual: boolean = false;
  showMappingAuto: boolean = false;
  enableFundingCurrency: boolean = false;
  enableDisbursementCurrency: boolean = false;
  errorMessage: string = '';
  startDateModel: NgbDateStruct;
  currentTab: string = 'project';
  sectorSelectionForm: FormGroup;
  sectorInput = new FormControl();
  locationSelectionForm: FormGroup;
  funderForm: FormGroup;
  implementerForm: FormGroup;
  locationInput = new FormControl();
  parentSectorInput = new FormControl();
  funderInput = new FormControl();
  implementerInput = new FormControl();
  sectorEntryType: string = 'aims';
  locationEntryType: string = 'aims';
  documentEntryType: string = 'aims';
  funderEntryType: string = 'aims';
  implementerEntryType: string = 'aims';
  disbursementEntryType: string = 'aims';
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  viewProject: any = {};
  currentEntryForm: any = null;
  calendarMaxDate: any = {};

  permissions: any = [];
  selectedProjects: any = [];
  selectedProjectSectors: any = [];
  iatiProjects: any = [];
  aimsProjects: any = [];
  currencyList: any = [];
  filteredCurrencyList: any = [];
  sectorTypesList: any = [];
  sectorsList: any = [];
  locationsList: any = [];
  mappedSectorsList: any = [];
  organizationsList: any = [];
  customFieldsList: any = [];
  fundingTypesList: any = [];
  currentProjectSectorsList: any = [];
  currentProjectLocationsList: any = [];
  currentProjectDocumentsList: any = [];
  currentProjectFundersList: any = [];
  currentProjectImplementersList: any = [];
  currentProjectDisbursementsList: any = [];
  currentProjectFieldsList: any = [];
  currentSelectedFieldValues: any = [];
  exchangeRatesList: any = [];
  selectedProjectFields: any = [];

  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewProjectDisbursements: any = [];
  viewProjectFields: any = [];
  yearsList: any = [];
  endingYearsList: any = [];
  sectorMappings: any = [];
  defaultSectorsList: any = [];
  fieldTypes: any = Settings.customFieldTypes;

  monthsList: any = [
    { key: 'January', value: 1 },
    { key: 'February', value: 2 },
    { key: 'March', value: 3 },
    { key: 'April', value: 4 },
    { key: 'May', value: 5 },
    { key: 'June', value: 6 },
    { key: 'July', value: 7 },
    { key: 'August', value: 8 },
    { key: 'September', value: 9 },
    { key: 'October', value: 10 },
    { key: 'November', value: 11 },
    { key: 'December', value: 12 }
  ];

  fieldType: any = {
    1: 'Dropdown',
    2: 'Checkbox',
    3: 'Text',
    4: 'Radio'
  };

  conditionsForCustomFields: any = {
    GRANT_LAON: 'Loan',
    HEALTH_SECTOR: 'Health'
  }

  financeType: any = {
    1: 'Funding',
    2: 'Disbursement'
  }

  fieldTypeConstants : any = {
    'Dropdown': 1,
    'Checkbox': 2,
    'Text': 3,
    'Radio': 4
  }

  exRateSources: any = [
    { id: 1, value: 'Open exchange api' },
    { id: 2, value: 'African bank' },
    { id: 3, value: 'Manual' }
  ];

  exRateSourceCodes: any = {
    'OPEN_EXCHANGE': 1,
    'AFRICAN_BANK': 2,
    'MANUAL': 3
  };

  exRateFor: any = {
    'FUNDING' : 1,
    'DISBURSEMENT': 2
  }

  model = { id: 0, title: '', startDate: null, endDate: null, description: null };
  sectorModel = { projectId: 0, sectorTypeId: null, sectorId: null, sectorName: '', parentId: 0, fundsPercentage: 0.0 };
  locationModel = { projectId: 0, locationId: null, latitude: 0.0, longitude: 0.0, location: '', fundsPercentage: 0.0 };
  documentModel = { id: 0, projectId: 0, documentTitle: null, documentUrl: null };
  funderModel = { id: 0, projectId: 0, funder: null, dated: null, exRateSource: null, fundingTypeId: null, funderId: null, amount: 0.00, currency: null, exchangeRate: null };
  implementerModel = { id: 0, projectId: 0, implementer: null, implementerId: null };
  disbursementModel = { id: 0, projectId: 0, dated: null, amount: 0.0, currency: null, exchangeRate: null, exRateSource: null };
  fieldModel = { projectId: 0, fieldId: 0, values: [], dropdownId: null, newText: null };

  displayTabs: any = [
    { visible: true, identity: 'project' },
    { visible: false, identity: 'sector' },
    { visible: false, identity: 'location' },
    { visible: false, identity: 'document' },
    { visible: false, identity: 'funder' },
    { visible: false, identity: 'implementer' },
    { visible: false, identity: 'disbursement' },
    { visible: false, identity: 'customFields' },
    { visible: false, identity: 'finish' }
  ];

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private storeService: StoreService, private iatiService: IATIService,
    private projectService: ProjectService, private sectorService: SectorService,
    private router: Router, private fb: FormBuilder, private infoModal: InfoModalComponent,
    private locationService: LocationService, private securityService: SecurityHelperService,
    private organizationService: OrganizationService,
    private projectInfoModal: ProjectInfoModalComponent,
    private projectIATIInfoModal: ProjectiInfoModalComponent,
    private errorModal: ErrorModalComponent,
    private currencyService: CurrencyService,
    private customFieldService: CustomeFieldService,
    private fundingTypeService: FundingTypeService
  ) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.calendarMaxDate = this.storeService.getCalendarUpperLimit();
    this.requestNo = this.storeService.getCurrentRequestId();
    var projectId = localStorage.getItem('active-project');
    if (projectId && projectId != '0') {
      this.isForEdit = true;
      this.activeProjectId = parseInt(projectId);
      this.model.id = this.activeProjectId;
      this.btnProjectText = 'Edit Project';
      this.loadProjectData(this.activeProjectId);
    }

    this.sectorSelectionForm = this.fb.group({
      sectorInput: null,
      parentSectorInput: null
    });

    this.funderForm = this.fb.group({
      funderInput: null,
    });

    this.implementerForm = this.fb.group({
      implementerInput: null,
    });


    this.locationSelectionForm = this.fb.group({
      locationInput: null,
    });

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });

    var projects = localStorage.getItem('selected-projects');
    if (projects) {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;
      //Load iati projects
      var filteredIATI = this.selectedProjects.filter(function (project) {
        return project.type == 'IATI';
      });

      var iatiIdsArr = [];
      filteredIATI.forEach(function (project) {
        var obj = { identifier: project.identifier };
        iatiIdsArr.push(obj);
      }.bind(this));
      this.loadIATIProjectsForIds(iatiIdsArr);

      //Load aims projects
      var filteredAIMS = this.selectedProjects.filter(function (project) {
        return project.type == 'AIMS';
      });
      var aimsIdsArr = [];
      filteredAIMS.forEach(function (project) {
        var id = project.identifier;
        aimsIdsArr.push(id);
      });
      this.loadAIMSProjectsForIds(aimsIdsArr);
      this.getExRateSettings();
    }

    this.currencyService.getCurrenciesList().subscribe(
      data => {
        this.currencyList = data;
      }
    )

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lowerLimit = currentYear - 20;
    var upperLimit = currentYear + 10;

    for (var y = currentYear; y >= lowerLimit; y--) {
      this.yearsList.push(y);
    }

    lowerLimit = currentYear - 5;
    for (var y = lowerLimit; y <= upperLimit; y++) {
      this.endingYearsList.push(y);
    }

    this.loadSectorsList();
    this.loadLocationsList();
    this.loadOrganizationsList();
    this.loadDefaultCurrency();
    this.loadNationalCurrency();
    this.loadActiveCustomFields();
    this.loadFundingTypes();
  }

  loadIATIProjectsForIds(modelArr: any) {
    this.isIatiLoading = true;
    this.iatiService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.iatiProjects = data;
        if (this.iatiProjects.length > 0) {
          this.iatiProjects.forEach(function (project) {
            project.isFunderVisible = true;
            project.isImplementerVisible = true;
            project.isBudgetVisible = false;
            project.isTransactionVisible = false;
          });
        }
        console.log(this.iatiProjects);
        this.isIatiLoading = false;
      },
      error => {
        this.isIatiLoading = false;
      }
    )
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.isAimsLoading = true;
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.aimsProjects = data;
        this.isAimsLoading = false;
      },
      error => {
        console.log(error);
        this.isAimsLoading = false;
      }
    )
  }

  loadSectorsList() {
    this.sectorService.getDefaultSectors().subscribe(
      data => {
        this.sectorsList = data;
        this.defaultSectorsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
        }
      }
    )
  }

  loadNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency = data.currency;
        }
      }
    );
  }

  loadFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypesList = data;
        }
      }
    )
  }

  private filterOrganizations(value: string): any[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.organizationsList.filter(organization => organization.organizationName.toLowerCase().indexOf(filterValue) !== -1);
    }
  }

  loadOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
        if (this.currentProjectFundersList.length == 0) {
          this.selectedFunderId = parseInt(localStorage.getItem('organizationId'));
          if (this.selectedFunderId) {
            var selectOrganization = this.organizationsList.filter(o => o.id == this.selectedFunderId);
            if (selectOrganization.length > 0) {
              this.funderInput.setValue(selectOrganization[0]);
              this.funderModel.funder = selectOrganization[0].organizationName;
            }
          }
        }

        this.filteredOrganizations = this.funderInput.valueChanges
          .pipe(
            startWith(''),
            map(organization => organization ? this.filterOrganizations(organization) : this.organizationsList.slice())
          );

        this.filteredImplementers = this.implementerInput.valueChanges
          .pipe(
            startWith(''),
            map(organization => organization ? this.filterOrganizations(organization) : this.organizationsList.slice())
          );
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  loadActiveCustomFields() {
    this.customFieldService.getActiveCustomFields().subscribe(
      data => {
        if (data) {
          var fields = data;
          fields.forEach(function (field) {
            field.values = field.values ? JSON.parse(field.values) : [];
            field.values.forEach(v => v.isSelected = false);
          });
          this.customFieldsList = fields;
        }
      }
    )
  }

  enterProjectTitleAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.title = selectedProject[0].title.trim();
    }
  }

  enterProjectDescAIMS(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.description = selectedProject[0].description.trim();
    }
  }

  enterStartDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var sDate = new Date(selectedProject[0].startDate);
      this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
    }
  }

  enterEndDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.aimsProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var eDate = new Date(selectedProject[0].endDate);
      this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
    }
  }

  enterStartDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var sDate = new Date(selectedProject[0].startDate);
      this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
    }
  }

  enterEndDateIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      var eDate = new Date(selectedProject[0].endDate);
      this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
    }
  }

  enterProjectTitleIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.model.title = selectedProject[0].title.trim();
    }
  }

  enterProjectDescIATI(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.iatiProjects.filter(p => p.id == id);
    if (selectedProject) {
      this.model.description = selectedProject[0].description.trim();
    }
  }

  viewCurrentProject() {
    var startDate = this.model.startDate.day + '/' + this.model.startDate.month + '/' +
      this.model.startDate.year;
    var endDate = this.model.endDate.day + '/' + this.model.endDate.month + '/' +
      this.model.endDate.year;

    var project = {
      title: this.model.title,
      description: this.model.description,
      startDate: startDate,
      endDate: endDate
    }
    this.viewProject = project;
    this.viewProjectFunders = this.currentProjectFundersList;
    this.viewProjectLocations = this.currentProjectLocationsList;
    this.viewProjectSectors = this.currentProjectSectorsList;
    this.viewProjectImplementers = this.currentProjectImplementersList;
    this.viewProjectDocuments = this.currentProjectDocumentsList;
    this.viewProjectFields = this.currentProjectFieldsList;
    this.projectInfoModal.openModal();
  }

  viewAIMSProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.aimsProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          startDate: projectData.startDate,
          endDate: projectData.endDate
        }
        this.viewProject = projectData;
        this.viewProjectFunders = projectData.funders;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewProjectImplementers = projectData.implementers;
        this.viewProjectDocuments = projectData.documents;
        this.projectInfoModal.openModal();
      }
    }
    return false;
  }

  viewIATIProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.iatiProjects.filter(p => p.id == projectId);
      if (selectProject && selectProject.length > 0) {
        var projectData = selectProject[0];
        var project = {
          title: projectData.title,
          description: projectData.description,
          defaultCurrency: projectData.defaultCurrency,
        }
        this.viewProject = project;
        this.viewProjectLocations = projectData.locations;
        this.viewProjectSectors = projectData.sectors;
        this.viewProjectFunders = projectData.funders;
        this.viewProjectImplementers = projectData.implementers;
        this.viewProjectDocuments = projectData.documents;
        this.projectIATIInfoModal.openModal();
      }
    }
    return false;
  }

  enterIATISector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var code = arr[2];
    this.sectorPlaceHolder = 'Select Parent Sector';

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var sectors = selectProject[0].sectors;
      if (sectors && sectors.length > 0) {
        this.sectorEntryType = 'iati';
        var selectSector = sectors.filter(s => s.code == code);
        if (selectSector && selectSector.length > 0) {
          if (selectSector[0].sectorName.length > 0) {
            this.isSectorVisible = true;
            this.sectorModel.sectorName = selectSector[0].sectorName;
            this.getSectorMappings();
          } else {
            this.sectorEntryType = 'aims';
          }
          this.sectorModel.fundsPercentage = selectSector[0].fundsPercentage;
        }
      }
    }
  }

  getSectorMappings() {
    var sectorName = this.sectorModel.sectorName;
    this.mappingsCount = 0;
    this.sectorService.getMappingsForSectorByName(sectorName).subscribe(
      data => {
        if (data && data.length > 0) {
          this.showMappingManual = true;
          this.showMappingAuto = false;
          this.sectorMappings = data;
          this.mappedSectorsList = data;
          this.mappingsCount = data.length;
          if (data.length >= 1) {
            this.sectorModel.sectorId = data[0].id;
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

  enterAIMSSector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var sectorId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var sectors = selectProject[0].sectors;
      if (sectors && sectors.length > 0) {
        var selectSector = sectors.filter(s => s.sectorId == sectorId);
        if (selectSector && selectSector.length > 0) {
          this.sectorEntryType = 'aims';
          this.isSectorVisible = true;
          var sectorObj = { id: selectProject[0].id, sectorName: selectSector[0].sectorName }
          this.sectorInput.setValue(sectorObj);
          this.sectorModel.fundsPercentage = selectSector[0].fundsPercentage;
          this.sectorModel.sectorId = selectSector[0].sectorId;
        }
      }
    }
  }

  enterIATILocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var location = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var locations = selectProject[0].locations;
      this.locationEntryType = 'iati';
      var selectLocation = locations.filter(s => s.name == location);
      if (selectLocation && selectLocation.length > 0) {
        if (selectLocation[0].name.length > 0) {
          this.locationModel.location = selectLocation[0].name;
          this.locationModel.latitude = selectLocation[0].latitude;
          this.locationModel.longitude = selectLocation[0].longitude;
        } else {
          this.locationEntryType = 'aims';
        }

      }
    }
  }

  enterAIMSLocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var locationId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var locations = selectProject[0].locations;
      if (locations && locations.length > 0) {
        var selectLocation = locations.filter(l => l.id == locationId);
        if (selectLocation && selectLocation.length > 0) {
          this.locationEntryType = 'aims';
          this.locationModel.locationId = selectLocation[0].id;
          this.locationModel.fundsPercentage = selectLocation[0].fundsPercentage;
        }
      }
    }
  }

  enterIATIDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var documents = selectProject[0].documents;
      this.documentEntryType = 'iati';
      var selectDocument = documents.filter(d => d.id == documentId);
      if (selectDocument && selectDocument.length > 0) {
        this.documentModel.id = selectDocument[0].id;
        this.documentModel.documentTitle = selectDocument[0].documentTitle;
        this.documentModel.documentUrl = selectDocument[0].documentUrl;
      }
    }
  }

  enterAIMSDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var documents = selectProject[0].documents;
      if (documents && documents.length > 0) {
        var selectDocument = documents.filter(d => d.id == documentId);
        if (selectDocument && selectDocument.length > 0) {
          this.locationEntryType = 'aims';
          var dbDocument = documents.filter(d => d.id == documentId);
          if (dbDocument) {
            this.documentModel.documentTitle = dbDocument[0].documentTitle;
            this.documentModel.documentUrl = dbDocument[0].documentUrl;
          }
        }
      }
    }
  }

  enterIATIFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var funders = selectProject[0].funders;
      var selectFunder = funders.filter(f => f.id == funderId);
      if (selectFunder && selectFunder.length > 0) {
        if (selectFunder[0].name) {
          this.funderModel.funder = selectFunder[0].name;
          this.funderEntryType = 'iati';
        }
      }
    }
  }

  enterIATIBudget(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var budgetId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var budgets = selectProject[0].budgets;
      var selectedBudget = budgets.filter(b => b.id == budgetId);
      if (selectedBudget && selectedBudget.length > 0) {
        if (selectedBudget.length > 0) {
          var eDate = new Date(selectedBudget[0].endDate);
          this.funderModel.dated = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };
          this.funderModel.currency = selectedBudget[0].currency;
          this.funderModel.amount = selectedBudget[0].amount;
        }
      }
    }
  }

  enterIATIFundingTransaction(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var transactionId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var transactions = selectProject[0].fundingTransactions;
      var selectedTransaction = transactions.filter(t => t.id == transactionId);
      if (selectedTransaction && selectedTransaction.length > 0) {
        if (selectedTransaction.length > 0) {
          var dated = new Date(selectedTransaction[0].dated);
          this.funderModel.dated = { year: dated.getFullYear(), month: (dated.getMonth() + 1), day: dated.getDate() };
          this.funderModel.amount = selectedTransaction[0].amount;
        }
      }
    }
  }

  enterAIMSFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var funders = selectProject[0].funders;
      if (funders && funders.length > 0) {
        var selectFunder = funders.filter(f => f.funderId == funderId);
        if (selectFunder && selectFunder.length > 0) {
          this.funderEntryType = 'aims';
          var dbFunder = funders.filter(f => f.funderId == funderId);
          if (dbFunder) {
            var funderObj = {
              id: dbFunder[0].funderId,
              organizationName: dbFunder[0].funder
            };
            this.funderModel.funder = dbFunder[0].funder;
            this.funderModel.funderId = dbFunder[0].funderId;
            this.funderModel.fundingTypeId = dbFunder[0].fundingTypeId;
            this.funderModel.amount = dbFunder[0].amount;
            this.funderModel.exchangeRate = dbFunder[0].exchangeRate;
            this.funderInput.setValue(funderObj);
          }
        }
      }
    }
  }

  //Display management for tabs in funder and implementers
  showFunderTab(id) {
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      project[0].isFunderVisible = true;
      project[0].isImplementerVisible = false;
      project[0].isBudgetVisible = false;
      project[0].isTransactionVisible = false;
    }
  }

  showImplementerTab(id) {
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      project[0].isImplementerVisible = true;
      project[0].isBudgetVisible = false;
      project[0].isTransactionVisible = false;
    }
  }

  showTransactionTab(id) {
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      project[0].isFunderVisible = false;
      project[0].isImplementerVisible = false;
      project[0].isBudgetVisible = false;
      project[0].isTransactionVisible = true;
    }
  }

  showBudgetTab(id) {
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      project[0].isFunderVisible = false;
      project[0].isImplementerVisible = false;
      project[0].isBudgetVisible = true;
      project[0].isTransactionVisible = false;
    }
  }
  /** End of tabs */

  enterIATIImplementer(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var implementerId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var implementers = selectProject[0].implementers;
      this.implementerEntryType = 'iati';
      var selectImplementer = implementers.filter(i => i.id == implementerId);
      if (selectImplementer && selectImplementer.length > 0) {
        this.implementerModel.implementer = selectImplementer[0].name;
      }
    }
  }

  enterAIMSImplementer(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var implementerId = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var implementers = selectProject[0].implementers;
      if (implementers && implementers.length > 0) {
        var dbImplementer = implementers.filter(i => i.implementerId == implementerId);
        if (dbImplementer && dbImplementer.length > 0) {
          this.implementerEntryType = 'aims';
          this.implementerModel.implementerId = dbImplementer[0].implementerId;
        }
      }
    }
  }

  enterIATIDisbursement(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var disbursementId = arr[2];

    var selectProject = this.iatiProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var transactions = selectProject[0].transactions;
      this.disbursementEntryType = 'iati';
      var selectTransaction = transactions.filter(i => i.id == disbursementId);
      if (selectTransaction && selectTransaction.length > 0) {
        this.disbursementModel.amount = selectTransaction[0].amount;
        var dated = selectTransaction[0].dated;
        if (selectTransaction[0].currency) {
          this.disbursementModel.currency = selectTransaction[0].currency;
        }
        if (dated && dated.length > 0) {
          var dateArr = dated.split('-');
          var dateFormatted = { year: parseInt(dateArr[0]), month: parseInt(dateArr[1]), day: parseInt(dateArr[2]) };
          this.disbursementModel.dated = dateFormatted;
        }
      }
    }
  }

  enterAIMSDisbursement(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var id = arr[2];

    var selectProject = this.aimsProjects.filter(p => p.id == projectId);
    if (selectProject && selectProject.length > 0) {
      var disbursements = selectProject[0].disbursements;
      this.disbursementEntryType = 'aims';
      var selectTransaction = disbursements.filter(i => i.id == id);
      if (selectTransaction && selectTransaction.length > 0) {
        this.disbursementModel.amount = selectTransaction[0].amount;
        var dated = selectTransaction[0].dated;
        if (dated && dated.length > 0) {
          var dateArr = dated.split('-');
          var dateFormatted = { year: parseInt(dateArr[0]), month: parseInt(dateArr[1]), day: parseInt(dateArr[2]) };
          this.disbursementModel.dated = dateFormatted;
        }
      }
    }
  }

  loadProjectData(id: number) {
    this.projectService.getProjectProfileReport(id.toString()).subscribe(
      result => {
        if (result && result.projectProfile) {
          var data = result.projectProfile;
          //Setting project data
          this.model.title = data.title;
          this.model.description = data.description;
          var sDate = new Date(data.startDate);
          var eDate = new Date(data.endDate);
          this.model.startDate = { year: sDate.getFullYear(), month: (sDate.getMonth() + 1), day: sDate.getDate() };
          this.model.endDate = { year: eDate.getFullYear(), month: (eDate.getMonth() + 1), day: eDate.getDate() };

          //Setting sectors data
          if (data.sectors && data.sectors.length > 0) {
            this.currentProjectSectorsList = data.sectors;
            this.sectorTotalPercentage = this.calculateSectorPercentage();
          }

          if (data.locations && data.locations.length > 0) {
            this.currentProjectLocationsList = data.locations;
            this.locationTotalPercentage = this.calculateLocationPercentage();
          }

          if (data.documents && data.documents.length > 0) {
            this.currentProjectDocumentsList = data.documents;
          }

          if (data.funders && data.funders.length > 0) {
            this.currentProjectFundersList = data.funders;
          } 

          if (data.implementers && data.implementers.length > 0) {
            this.currentProjectImplementersList = data.implementers;
          }

          if (data.disbursements && data.disbursements.length > 0) {
            this.currentProjectDisbursementsList = data.disbursements;
          }

          if (data.customFields && data.customFields.length > 0) {
            this.currentProjectFieldsList = data.customFields;
          }
        }
      }
    )
  }

  checkIfFunderTabSelected(id) {
    var isSelected = false;
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      isSelected = project[0].isFunderVisible;
    }
    return isSelected;
  }

  checkIfBudgetTabSelected(id) {
    var isSelected = false;
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      isSelected = project[0].isBudgetVisible;
    }
    return isSelected;
  }

  checkIfTransactionTabSelected(id) {
    var isSelected = false;
    var project = this.iatiProjects.filter(p => p.id == id);
    if (project.length > 0) {
      isSelected = project[0].isTransactionVisible;
    }
    return isSelected;
  }

  checkIfSectorAdded(sector) {
    if (this.currentProjectSectorsList.length > 0) {
      var isExists = this.currentProjectSectorsList.filter(s =>
        s.sector.trim().toLowerCase() == sector.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  checkIfLocationAdded(location) {
    if (this.currentProjectLocationsList.length > 0) {
      var isExists = this.currentProjectLocationsList.filter(l =>
        l.location.trim().toLowerCase() == location.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  checkIfFunderAdded(funder) {
    if (this.currentProjectFundersList.length > 0) {
      var isExists = this.currentProjectFundersList.filter(f =>
        f.funder.trim().toLowerCase() == funder.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  checkIfImplementerAdded(implementer) {
    if (this.currentProjectImplementersList.length > 0) {
      var isExists = this.currentProjectImplementersList.filter(i =>
        i.implementer.trim().toLowerCase() == implementer.trim().toLowerCase());
      return isExists.length > 0 ? true : false;
    }
  }

  showProjects() {
    this.manageTabsDisplay('project');
  }

  showSectors() {
    this.manageTabsDisplay('sector');
  }

  showLocations() {
    this.manageTabsDisplay('location');
  }

  showFunders() {
    this.manageTabsDisplay('funder');
    //this.getExchangeRatesList();
  }

  showImplementers() {
    this.manageTabsDisplay('implementer');
  }

  showDocuments() {
    this.manageTabsDisplay('document');
  }

  showDisbursements() {
    this.totalFunds = this.calculateProjectFunding();
    this.totalDisbursements = this.calculateProjectDisbursement();
    this.disbursementModel.dated = this.storeService.getTodaysDateForDtPicker();
    this.manageTabsDisplay('disbursement');
  }

  showCustomFields() {
    this.manageTabsDisplay('customFields');
  }

  showFinishProject() {
    this.manageTabsDisplay('finish');
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  /*Project funders display functions*/
  displayFunder(organization?: any): string | undefined {
    if (organization) {
      this.selectedFunderId = organization.id;
    } else {
      this.selectedFunderId = 0;
    }
    return organization ? organization.organizationName : undefined;
  }

  displayImplementer(organization?: any): string | undefined {
    if (organization) {
      this.selectedImplementerId = organization.id;
    } else {
      this.selectedImplementerId = 0;
    }
    return organization ? organization.organizationName : undefined;
  }

  /*Project sectors filtering and display functions*/
  displaySectorFn(sector?: Sector): string | undefined {
    if (sector) {
      this.selectedSectorId = sector.id;
    } else {
      this.selectedSectorId = 0;
    }
    return sector ? sector.sectorName : undefined;
  }

  private filterSectors(value: string): Sector[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.sectorsList.filter(sector => sector.sectorName.toLowerCase().indexOf(filterValue) !== -1);
    }
  }
  /*End of project sectors filtering and display functions*/

  /*Project locations filtering and display functions*/
  displayLocationFn(location?: Location): string | undefined {
    if (location) {
      this.selectedLocationId = location.id;
    } else {
      this.selectedLocationId = 0;
    }
    return location ? location.location : undefined;
  }

  private filterLocations(value: string): Location[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.locationsList.filter(location => location.location.toLowerCase().indexOf(filterValue) !== -1);
    }
  }
  /*End of project locations filtering and display functions*/

  /* Saving different section of project */
  saveProject(frm: any) {
    this.currentEntryForm = frm;
    var startDate = new Date(this.model.startDate.year + '-' + this.model.startDate.month + '-' +
      this.model.startDate.day);
    var endDate = new Date(this.model.endDate.year + '-' + this.model.endDate.month + '-' +
      this.model.endDate.day);

    if (startDate > endDate) {
      this.errorMessage = 'Start date cannot be greater than end date';
      this.errorModal.openModal();
      return false;
    }

    var model = {
      Title: this.model.title,
      StartDate: startDate,
      EndDate: endDate,
      Description: this.model.description
    };

    this.isProjectBtnDisabled = true;
    if (this.isForEdit) {
      this.btnProjectText = 'Updating...';
      this.blockUI.start('Updating Project...');
      this.projectService.updateProject(this.activeProjectId, model).subscribe(
        data => {
          if (data) {
            this.resetProjectEntry();
            this.blockUI.stop();
            this.currentTab = 'funder';
          } else {
            this.resetProjectEntry();
          }
          this.blockUI.stop();
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.blockUI.stop();
          return false;
        }
      );
    } else {
      this.blockUI.start('Saving Project...');
      this.projectService.addProject(model).subscribe(
        data => {
          if (data) {
            this.resetProjectEntry();
            this.activeProjectId = data;
            var message = 'New project' + Messages.NEW_RECORD;
            this.infoMessage = message;
            localStorage.setItem('active-project', data);
            this.btnProjectText = 'Edit Project';
            this.currentTab = 'funder';
          }
          this.blockUI.stop();
        },
        error => {
          this.resetProjectEntry();
          this.errorMessage = error;
          this.isError = true;
          this.blockUI.stop();
        }
      );
    }
  }

  /** Managing sectors */
  saveProjectSector(frm: any) {
    this.currentEntryForm = frm;
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.sectorModel.projectId = projectId;
    } else {
      this.errorMessage = 'There is no created project. Create/Save a project first and sector for the project';
      this.errorModal.openModal();
      return false;
    }

    if (this.sectorModel.fundsPercentage <= 0 || this.sectorModel.fundsPercentage > 100) {
      this.errorMessage = 'Funds percentage ' + Messages.PERCENTAGE_RANGE;
      this.errorModal.openModal();
      return false;
    }

    if (this.sectorModel.sectorName != null && this.sectorModel.sectorName != '') {
      var isSectorExists = this.currentProjectSectorsList.filter(s => s.sector.toLowerCase() == this.sectorModel.sectorName.toLowerCase());
      if (isSectorExists.length > 0) {
        this.errorMessage = 'Selected sector' + Messages.ALREADY_IN_LIST;
        this.errorModal.openModal();
        return false;
      }
    }

    if (this.currentProjectSectorsList.length > 0) {
      var percentageEntered = this.calculateSectorPercentage();
      var enteredPercentage = this.sectorModel.fundsPercentage;
      var percentageTotal = parseInt(percentageEntered) + parseInt(enteredPercentage.toString());

      if (percentageTotal > 100) {
        this.errorMessage = Messages.INVALID_PERCENTAGE;
        this.errorModal.openModal();
        return false;
      }
    }

    var projectSectorModel = {
      projectId: projectId,
      sectorId: this.sectorModel.sectorId,
      fundsPercentage: this.sectorModel.fundsPercentage,
    };

    this.blockUI.start('Saving Sector...');
    if (this.sectorEntryType == 'iati') {
      var sectorModel = {
        sectorName: this.sectorModel.sectorName,
        parentId: 0,
        mappingSectorId: this.sectorModel.sectorId
      };
      this.sectorService.addIATISector(sectorModel).subscribe(
        data => {
          if (data) {
            //this.sectorModel.sectorId = data;
            this.selectedSectorId = this.sectorModel.sectorId;
            projectSectorModel.sectorId = this.sectorModel.sectorId;
            this.addProjectSector(projectSectorModel);
          } else {
            this.blockUI.stop();
          }
        },
        error => {
          this.blockUI.stop();
        }
      )
    } else {
      this.addProjectSector(projectSectorModel);
    }
  }

  addProjectSector(model: any) {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.sectorModel.projectId = projectId;
    }

    this.projectService.addProjectSector(model).subscribe(
      data => {
        if (data) {
          var sectorObj = {
            projectId: projectId,
            sectorId: model.sectorId,
            sector: this.sectorModel.sectorName,
            fundsPercentage: this.sectorModel.fundsPercentage,
          };

          if (model.sectorId) {
            var selectedSector = this.defaultSectorsList.filter(s => s.id == model.sectorId);
            if (selectedSector.length > 0) {
              sectorObj.sector = selectedSector[0].sectorName;
            }
          }

          if (sectorObj.sector == "") {
            var selectSector = this.sectorsList.filter(s => s.id == sectorObj.sectorId);
            if (selectSector && selectSector.length > 0) {
              sectorObj.sector = selectSector[0].sectorName;
            }
          }

          var fetchExistingSector = this.currentProjectSectorsList.filter(s => s.sectorId == model.sectorId);
          if (fetchExistingSector.length > 0) {
            var oldPercentage = parseInt(fetchExistingSector[0].fundsPercentage);
            fetchExistingSector[0].fundsPercentage = oldPercentage + parseInt(model.fundsPercentage);
          } else {
            this.currentProjectSectorsList.push(sectorObj);
          }

          this.sectorTotalPercentage = this.calculateSectorPercentage();
          this.resetDataEntryValidation();
          this.resetSectorEntry();
        }
        this.blockUI.stop();
      },
      error => {
        this.errorMessage = error;
        this.blockUI.stop();
        this.errorModal.openModal();
      }
    )
  }

  deleteProjectSector(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var sectorId = arr[2];

    this.blockUI.start('Removing Sector...');
    this.projectService.deleteProjectSector(projectId, sectorId).subscribe(
      data => {
        if (data) {
          this.currentProjectSectorsList = this.currentProjectSectorsList.filter(s => s.sectorId != sectorId);
          this.sectorTotalPercentage = this.calculateSectorPercentage();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }
  /**End of managing sectors */

  /**Managing Locations */
  saveProjectLocation(frm: any) {
    this.currentEntryForm = frm;
    if (this.locationModel.locationId == null && this.locationModel.location == '') {
      return false;
    }

    if (this.locationModel.fundsPercentage <= 0) {
      this.errorMessage = 'Funds percentage ' + Messages.PERCENTAGE_RANGE;
      this.errorModal.openModal();
      return false;
    }

    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.locationModel.projectId = projectId;
    } else {
      this.errorMessage = Messages.PROJECT_DEPENDENCY;
      this.errorModal.openModal();
      return false;
    }

    var projectLocationModel = {
      projectId: projectId,
      locationId: this.locationModel.locationId,
      fundsPercentage: this.locationModel.fundsPercentage,
    };

    var searchLocation = this.locationModel.location;
    if (searchLocation != '') {
      var getLocation = this.locationsList.filter(location => location.location == searchLocation);
      if (getLocation && getLocation.length > 0) {
        projectLocationModel.locationId = getLocation[0].id;
      }
    }

    if (this.locationModel.locationId != 0 || this.locationModel.locationId != null) {
      var getLocation = this.locationsList.filter(location => location.id == this.locationModel.locationId);
      if (getLocation && getLocation.length > 0) {
        this.locationModel.location = getLocation[0].location;
      }
    }

    var isLocationExists = this.currentProjectLocationsList.filter(l => l.location.toLowerCase() == this.locationModel.location.toLowerCase()
      || l.id == this.locationModel.locationId);
    if (isLocationExists.length > 0) {
      this.errorMessage = 'Selected location (' + this.locationModel.location + ')' + Messages.ALREADY_IN_LIST;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving Location...');
    if (this.locationEntryType == 'iati' && projectLocationModel.locationId <= 0) {
      var locationModel = {
        location: searchLocation,
        latitude: 0.00,
        longitude: 0.00
      };

      this.locationService.addLocation(locationModel).subscribe(
        data => {
          if (data) {
            this.locationModel.locationId = data;
            this.selectedLocationId = data;
            projectLocationModel.locationId = data;
            this.addProjectLocation(projectLocationModel);
          } else {
            this.blockUI.stop();
          }
        }
      )
    } else {
      projectLocationModel.locationId = this.locationModel.locationId;
      this.addProjectLocation(projectLocationModel);
    }
  }

  addProjectLocation(model: any) {
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.locationModel.projectId = projectId;
    }

    this.projectService.addProjectLocation(model).subscribe(
      data => {
        if (data) {
          var locationObj = {
            id: this.locationModel.locationId,
            projectId: projectId,
            locationId: model.locationId,
            location: this.locationModel.location,
            latitude: this.locationModel.latitude,
            longitude: this.locationModel.longitude,
            fundsPercentage: this.locationModel.fundsPercentage,
          };
          this.currentProjectLocationsList.push(locationObj);
          this.locationTotalPercentage = this.calculateLocationPercentage();
          this.resetLocationEntry();
          this.resetDataEntryValidation();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }

  deleteProjectLocation(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var locationId = arr[2];

    this.blockUI.start('Removing Location...');
    this.projectService.deleteProjectLocation(projectId, locationId).subscribe(
      data => {
        if (data) {
          this.currentProjectLocationsList = this.currentProjectLocationsList.filter(l => l.id != locationId);
          this.locationTotalPercentage = this.calculateLocationPercentage();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project locations */


  /**Managing Documents */
  saveProjectDocument(frm: any) {
    this.currentEntryForm = frm;
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.documentModel.projectId = projectId;
    } else {
      this.errorMessage = Messages.PROJECT_DEPENDENCY;
      this.errorModal.openModal();
      return false;
    }

    if (this.documentModel.documentTitle == null || this.documentModel.documentTitle == ''
      || this.documentModel.documentUrl == null || this.documentModel.documentUrl == '') {

      return false;
    }

    var model = {
      id: 0,
      projectId: this.documentModel.projectId,
      documentTitle: this.documentModel.documentTitle,
      documentUrl: this.documentModel.documentUrl
    }
    this.blockUI.start('Saving Document...');
    this.projectService.addProjectDocument(model).subscribe(
      data => {
        if (data) {
          model.id = data;
          this.currentProjectDocumentsList.push(model);
          this.resetDocumentEntry();
          this.resetDataEntryValidation();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }


  deleteProjectDocument(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var documentId = arr[2];

    this.blockUI.start('Removing Document...');
    this.projectService.deleteProjectDocument(documentId).subscribe(
      data => {
        if (data) {
          this.currentProjectDocumentsList = this.currentProjectDocumentsList.filter(d => d.id != documentId);
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project documents */

  /**Managing Funders */
  saveProjectFunder(frm: any) {
    var isNewFunder = false;
    this.currentEntryForm = frm;
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.funderModel.projectId = projectId;
    } else {
      this.errorMessage = Messages.PROJECT_DEPENDENCY;
      this.errorModal.openModal();
      return false;
    }

    if (this.selectedFunderId != 0) {
      this.funderModel.funderId = this.selectedFunderId;
      var funderExists = this.currentProjectFundersList.filter(f => f.funderId == this.selectedFunderId
        && f.fundingTypeId == this.funderModel.fundingTypeId);
      if (funderExists.length > 0) {
        var funderName = (this.funderInput.value && this.funderInput.value.organizationName) ? this.funderInput.value.organizationName : this.funderInput.value;
        if (funderName && funderName.toLowerCase().trim() != funderExists[0].funder.toLowerCase().trim() && 
        this.funderModel.fundingTypeId != funderExists[0].fundingTypeId) {
          this.funderModel.funderId = 0;
          this.funderModel.funder = funderName;
          isNewFunder = true;
        } else {
          this.errorMessage = 'Selected funder ' + Messages.ALREADY_IN_LIST;
          this.errorModal.openModal();
          return false;
        }
      }
    } else if (this.funderEntryType == 'aims' && this.selectedFunderId == 0) {
      isNewFunder = true;
      this.funderModel.funderId = 0;
    }

    if (this.funderEntryType == 'aims' && this.selectedFunderId == 0) {
      this.funderModel.funder = this.funderInput.value;
      if (!this.funderModel.funder) {
        this.errorMessage = 'Either select from list or enter valid name for funder';
        this.errorModal.openModal();
        return false;
      }

      if (this.funderModel.funder.length < 3) {
        this.errorMessage = 'Funder name must be at least 3 characters long';
        this.errorModal.openModal();
        return false;
      }

    }

    if (this.funderModel.amount <= 0) {
      this.errorMessage = "Funder amount " + Messages.CANNOT_BE_ZERO;
      this.errorModal.openModal();
      return false;
    }

    if (this.funderModel.exchangeRate <= 0) {
      this.errorMessage = "Exchange rate for USD " + Messages.CANNOT_BE_ZERO;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving Funder...');
    var fModel = this.funderModel;
    var model = {
      funder: this.funderModel.funder,
      projectId: this.funderModel.projectId,
      funderId: this.funderModel.funderId,
      fundingTypeId: this.funderModel.fundingTypeId,
      amount: this.funderModel.amount,
      currency: this.funderModel.currency,
      exchangeRate: this.funderModel.exchangeRate,
      dated: fModel.dated.year + '-' + fModel.dated.month + '-' + fModel.dated.day,
    }

    if (this.funderEntryType == 'iati' || isNewFunder) {
      if (!isNewFunder && (this.funderModel.funder == null || this.funderModel.funder.length == 0)) {
        this.errorMessage = Messages.PROJECT_DEPENDENCY;
        this.errorModal.openModal();
        return false;
      } else {
        var funderModel = {
          Name: this.funderModel.funder
        }
        this.organizationService.addOrganization(funderModel).subscribe(
          data => {
            if (data) {
              model.funderId = data;
              this.addProjectFunder(model);
            } else {
              this.blockUI.stop();
            }
          },
          error => {
            console.log(error);
          }
        )
      }
    } else {
      var selectedFunder = this.organizationsList.filter(f => f.id == this.funderModel.funderId);
      if (selectedFunder && selectedFunder.length > 0) {
        this.funderModel.funder = selectedFunder[0].organizationName;
      }
      this.addProjectFunder(model);
    }
  }

  addProjectFunder(model: any) {
    this.projectService.addProjectFunder(model).subscribe(
      data => {
        if (data) {
          model.funder = this.funderModel.funder;
          var gTypeArr = this.fundingTypesList.filter(g => g.id == model.fundingTypeId);
          if (gTypeArr.length > 0) {
            model.fundingTypeId = gTypeArr[0].id;
            model.fundingType = gTypeArr[0].fundingType;
          }
          this.currentProjectFundersList.push(model);
          this.resetFunderEntry();
          this.resetDataEntryValidation();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.resetFunderEntry();
      }
    )
  }

  deleteProjectFunder(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var funderId = arr[2];

    this.blockUI.start('Removing Funder...');
    this.projectService.deleteProjectFunder(projectId, funderId).subscribe(
      data => {
        if (data) {
          this.currentProjectFundersList = this.currentProjectFundersList.filter(f => f.funderId != funderId);
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project funders */

  /**Managing Implementers */
  saveProjectImplementer(frm: any) {
    this.currentEntryForm = frm;
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.implementerModel.projectId = projectId;
    } else {
      this.errorMessage = Messages.PROJECT_DEPENDENCY;
      this.errorModal.openModal();
      return false;
    }

    var implementerName = (this.implementerInput.value && this.implementerInput.value.organizationName) ? this.implementerInput.value.organizationName : this.implementerInput.value;
    implementerName = implementerName.toLowerCase().trim();
    if (this.selectedImplementerId == 0) {
      var isImplementerExists = this.organizationsList.filter(o => o.organizationName.toLowerCase().trim() == implementerName);
      if (isImplementerExists.length == 0) {
        this.errorMessage = Messages.SELECT_IMPLEMENTER_FROM_LIST;
        this.errorModal.openModal();
        return false;
      }
    }

    var isNewImplementer = false;
    if (this.selectedImplementerId != 0) {
      this.implementerModel.implementerId = this.selectedImplementerId;
      var implementerExists = this.currentProjectImplementersList.filter(i => i.implementerId == this.selectedImplementerId);
      if (implementerExists.length > 0) {
        if (implementerName && implementerName == implementerExists[0].implementer.toLowerCase().trim()) {
          this.errorMessage = 'Selected implementer ' + Messages.ALREADY_IN_LIST;
          this.errorModal.openModal();
          return false;
        } else {
          this.errorMessage = Messages.SELECT_IMPLEMENTER_FROM_LIST;
          this.errorModal.openModal();
          return false;
        }
      }
    } else if (this.implementerEntryType == 'aims' && this.selectedImplementerId == 0) {
      this.implementerModel.implementerId = 0;
      this.errorMessage = 'Select an implementer';
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving Implementer...');
    var model = {
      implementer: this.implementerModel.implementer,
      projectId: this.implementerModel.projectId,
      implementerId: this.implementerModel.implementerId,
    }

    if (this.implementerEntryType == 'iati') {
      if (this.implementerModel.implementer == null || this.implementerModel.implementer.length == 0) {
        this.errorMessage = 'Provide a valid name for Implementer';
        this.errorModal.openModal();
        return false;
      } else {
        var orgModel = {
          Name: this.implementerModel.implementer
        }
        this.organizationService.addOrganization(orgModel).subscribe(
          data => {
            if (data) {
              model.implementerId = data;
              this.addProjectImplementer(model);
            } else {
              this.blockUI.stop();
            }
          },
          error => {
            this.blockUI.stop();
          }
        )
      }
    } else {
      var selectImplementer = this.organizationsList.filter(i => i.id == this.implementerModel.implementerId);
      if (selectImplementer && selectImplementer.length > 0) {
        model.implementer = selectImplementer[0].organizationName;
      }
      this.addProjectImplementer(model);
    }
  }

  addProjectImplementer(model: any) {
    this.projectService.addProjectImplementer(model).subscribe(
      data => {
        if (data) {
          this.currentProjectImplementersList.push(model);
          this.resetImplementerEntry();
          this.resetDataEntryValidation();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }

  deleteProjectImplementer(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var implementerId = arr[2];

    this.blockUI.start('Removing Implementer...');
    this.projectService.deleteProjectImplementer(projectId, implementerId).subscribe(
      data => {
        if (data) {
          this.currentProjectImplementersList = this.currentProjectImplementersList.filter(i => i.implementerId != implementerId);
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project implementer */


  /**Managing Disbursements */
  saveProjectDisbursement(frm: any) {
    if (!this.disbursementModel.dated) {
      return false;
    }

    this.currentEntryForm = frm;
    var activeProject = localStorage.getItem('active-project');
    var projectId = 0;

    if (activeProject && activeProject != '0') {
      projectId = parseInt(activeProject);
      this.disbursementModel.projectId = projectId;
    } else {
      this.errorMessage = Messages.PROJECT_DEPENDENCY;
      this.errorModal.openModal();
      return false;
    }

    if (this.disbursementModel.amount < 1) {
      this.errorMessage = 'Disbursement amount ' + Messages.CANNOT_BE_ZERO;
      this.errorModal.openModal();
      return false;
    }

    if (this.disbursementModel.dated == null) {
      this.errorMessage = Messages.INVALID_DATE;
      this.errorModal.openModal();
      return false;
    }

    var dModel = this.disbursementModel;
    var model = {
      dated: dModel.dated.year + '-' + dModel.dated.month + '-' + dModel.dated.day,
      projectId: this.disbursementModel.projectId,
      amount: this.disbursementModel.amount,
      currency: this.disbursementModel.currency,
      exchangeRate: this.disbursementModel.exchangeRate
    };

    var totalFund = this.calculateProjectFunding();
    var totalDisbursement = this.calculateProjectDisbursement();

    if (this.disbursementModel.exchangeRate != 1) {
      totalDisbursement += (this.disbursementModel.amount * (1 / this.disbursementModel.exchangeRate));
    } else {
      totalDisbursement += parseFloat(this.disbursementModel.amount.toString());
    }
    

    if (totalDisbursement > totalFund) {
      this.errorMessage = Messages.INVALID_DISBURSEMENT;
      this.errorModal.openModal();
      return false;
    }
    this.blockUI.start('Saving Disbursement...');
    this.addProjectDisbursement(model);
  }

  addProjectDisbursement(model: any) {
    this.projectService.addProjectDisbursement(model).subscribe(
      data => {
        if (data) {
          this.currentProjectDisbursementsList.push(model);
          this.totalDisbursements = this.calculateProjectDisbursement();
          this.resetDisbursementEntry();
          this.resetDataEntryValidation();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }

  deleteProjectDisbursement(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var id = arr[2];

    this.blockUI.start('Removing Disbursement...');
    this.projectService.deleteProjectDisbursement(id).subscribe(
      data => {
        if (data) {
          this.currentProjectDisbursementsList = this.currentProjectDisbursementsList.filter(d => (d.id != id));
          this.totalDisbursements = this.calculateProjectDisbursement();
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }
  /**End of managing project documents */

  /*Managing project custom fields*/
  selectFieldValue(fieldType: any, id: number, fieldId: number, el: any, isTypeText = false) {
    if (id == -1) {
      id = el.target.value;
    }

    if (!id) {
      return false;
    }

    var result = [];
    if (isTypeText) {
      result = this.customFieldsList.filter(f => f.fieldType == fieldType && f.id == fieldId);
      if (result.length > 0) {
        var isExists = this.currentSelectedFieldValues.filter(f => f.fieldId == fieldId);
        if (isExists.length > 0) {
          isExists[0].values[0].value = this.fieldModel.newText;
        } else {
          var newTextField = {
            fieldId: fieldId,
            fieldType: fieldType,
            values: [
              { id: 1, value: this.fieldModel.newText }
            ]
          };
          this.currentSelectedFieldValues.push(newTextField);
        }
      }
    }  else {
      result = this.customFieldsList.filter(f => f.fieldType == fieldType && f.id == fieldId).map(f => f.values)[0].filter(v => parseInt(v.id) == id);
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

  saveProjectFields(id: number) {
    var selectedField = this.currentSelectedFieldValues.filter(f => f.fieldId == id);
    if (selectedField.length > 0) {
      if (selectedField[0].values.length == 0) {
        this.errorMessage = Messages.INVALID_OPTION_VALUE;
        this.errorModal.openModal();
        return false;
      }

      var stringifiedJson = JSON.stringify(selectedField[0].values);
      var saveFieldModel = {
        projectId: this.activeProjectId,
        customFieldId: id,
        fieldType: selectedField[0].fieldType,
        values: stringifiedJson
      }

      this.blockUI.start('Saving...');
      this.projectService.saveProjectCustomField(saveFieldModel).subscribe(
        data => {
          if (data) {
            var isFieldExists = this.currentProjectFieldsList.filter(f => f.customFieldId == id);
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
              var customField = this.customFieldsList.filter(c => c.id == id);
              var fieldTitle = '';
              if (customField.length > 0) {
                fieldTitle = customField[0].fieldTitle;
              }

              var values = [];
              selectedField[0].values.forEach(function (v) {
                values.push({
                  id: v.id,
                  value: v.value
                });
              });

              this.currentProjectFieldsList.push({
                customFieldId: id,
                fieldTitle: fieldTitle,
                fieldType: selectedField[0].fieldType,
                values: values,
                projectId: this.activeProjectId
              });
            }
          }
          this.blockUI.stop();
        }
      );
    }
  }

  deleteProjectField(e) {
    var arr = e.target.id.split('-');
    var projectId = arr[1];
    var fieldId = arr[2];

    this.blockUI.start('Removing Field...');
    this.projectService.deleteProjectCustomField(projectId, fieldId).subscribe(
      data => {
        if (data) {
          this.currentProjectFieldsList = this.currentProjectFieldsList.filter(c => c.customFieldId != fieldId);
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }

  /** General functions */
  calculateSectorPercentage() {
    var percentageList = this.currentProjectSectorsList.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  calculateLocationPercentage() {
    var percentageList = this.currentProjectLocationsList.map(s => parseInt(s.fundsPercentage));
    return percentageList.reduce(this.storeService.sumValues, 0);
  }

  getExRateSettings() {
    this.currencyService.getExRateSettings().subscribe(
      data => {
        this.isExRateAutoConvert = data.isAutomatic;
        if (!this.isExRateAutoConvert) {
          this.exchangeRatesList = data.manualCurrencyRates;
        }
      }
    )
  }

  getExchangeRatesList() {
    if (this.isExRateAutoConvert) {
      if (this.model.startDate && this.model.startDate.year) {
        var startDate = this.model.startDate.year + '-' + this.model.startDate.month + '-' +
          this.model.startDate.day;

        this.currencyService.getExchangeRatesForDate(startDate).subscribe(
          data => {
            if (data) {
              this.exchangeRatesList = data.rates;
            }
          }
        )
      } else {
        this.currencyService.getExchangeRatesList().subscribe(
          data => {
            if (data) {
              this.exchangeRatesList = data.rates;
            }
          }
        );
      }
    }
  }

  selectExRateSource(eFor: string) {
    if (eFor == this.exRateFor.FUNDING) {
      if (!this.funderModel.exRateSource || this.funderModel.exRateSource == 'null' ){
        this.isFundingExRateReadonly = true;
        return false;
      }
      this.isFundingExRateReadonly = true;

      if (this.funderModel.exRateSource == this.exRateSourceCodes.AFRICAN_BANK) {
        this.filteredCurrencyList = this.currencyList.filter(c => c.currency == this.defaultCurrency || 
          c.currency == this.nationalCurrency);
      } else if(this.funderModel.exRateSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
        this.filteredCurrencyList = this.currencyList;
      } else if (this.funderModel.exRateSource == this.exRateSourceCodes.MANUAL) {
        this.filteredCurrencyList = this.currencyList;
        this.isFundingExRateReadonly = false;
        this.funderModel.exchangeRate = null;
      }
      this.getExchangeRates('1');
    } else if (eFor == this.exRateFor.DISBURSEMENT) {
      if (!this.disbursementModel.exRateSource || this.disbursementModel.exRateSource == 'null' ){
        this.isDisbursementExRateReadonly = true;
        return false;
      }
      this.isDisbursementExRateReadonly = true;

      if (this.disbursementModel.exRateSource == this.exRateSourceCodes.AFRICAN_BANK) {
        this.filteredCurrencyList = this.currencyList.filter(c => c.currency == this.defaultCurrency || 
          c.currency == this.nationalCurrency);
      } else if(this.disbursementModel.exRateSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
        this.filteredCurrencyList = this.currencyList;
      } else if (this.disbursementModel.exRateSource == this.exRateSourceCodes.MANUAL) {
        this.filteredCurrencyList = this.currencyList;
        this.isDisbursementExRateReadonly = false;
        this.disbursementModel.exchangeRate = null;
      }
      this.getExchangeRates('2');
    }
  }

  getExchangeRates(eFor: string) {
    if (eFor == this.exRateFor.FUNDING) {
      if (!this.funderModel.dated || !this.funderModel.currency || !this.funderModel.exRateSource) {
        return false;
      }
    }

    if (eFor == this.exRateFor.DISBURSEMENT) {
      if (!this.disbursementModel.dated || !this.disbursementModel.currency || !this.disbursementModel.exRateSource) {
        return false;
      }
    }

    this.blockUI.start('Searching exchange rate...');
    var dated = null;
    var exRateSource = null;
    if (eFor == this.exRateFor.FUNDING) {
      var fundingDate = this.funderModel.dated;
      dated = fundingDate.year + '-' + fundingDate.month + '-' + fundingDate.day;
      exRateSource = this.funderModel.exRateSource;
    } else if (eFor == this.exRateFor.DISBURSEMENT) {
      var disbursementDate = this.disbursementModel.dated;
      dated = disbursementDate.year + '-' + disbursementDate.month + '-' + disbursementDate.day;
      exRateSource = this.disbursementModel.exRateSource;
    }

    if (exRateSource == this.exRateSourceCodes.MANUAL) {
      this.blockUI.stop();
      return false;
    }
    
    if (exRateSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
      this.currencyService.getExchangeRatesForDate(dated).subscribe(
        data => {
          if (data) {
            var rates = data.rates;

            if (rates) {
              if (eFor == this.exRateFor.FUNDING) {
                var rate = rates.filter(r => r.currency == this.funderModel.currency);
                if (rate.length > 0) {
                  this.funderModel.exchangeRate = rate[0].rate;
                }
              } else if (eFor == this.exRateFor.DISBURSEMENT) {
                var rate = rates.filter(r => r.currency == this.disbursementModel.currency);
                if (rate.length > 0) {
                  this.disbursementModel.exchangeRate = rate[0].rate;
                }
              }
            }
          } else {
            this.errorMessage = Messages.EX_RATE_NOT_FOUND;
            this.errorModal.openModal();
          }
          this.blockUI.stop();
        }
      )
    } else if (exRateSource == this.exRateSourceCodes.AFRICAN_BANK) {
      if (this.funderModel.currency == this.defaultCurrency) {
        this.funderModel.exchangeRate = 1;
        this.blockUI.stop();
      } else if(this.disbursementModel.currency == this.defaultCurrency) {
        this.disbursementModel.exchangeRate = 1;
        this.blockUI.stop();
      } else {
        this.currencyService.getManualExRatesByDate(dated).subscribe(
          data => {
            if (data) {
              if (data.exchangeRate) {
                if (eFor == this.exRateFor.FUNDING) {
                  this.funderModel.exchangeRate = data.exchangeRate;
                } else if (eFor == this.exRateFor.DISBURSEMENT) {
                  this.disbursementModel.exchangeRate = data.exchangeRate;
                }
              }
            } else {
              this.errorMessage = Messages.EX_RATE_NOT_FOUND;
              this.errorModal.openModal();
            }
            this.blockUI.stop();
          }
        );
      }
    }
  }

  getCurrencyExchangeRate(currency: string) {
    var exRate = null;
    if (this.exchangeRatesList.length > 0) {
      this.exRatePlaceHolder = 'Fetching latest rate...';
      
      var foundRate = this.exchangeRatesList.filter(e => e.currency == currency);
      var defaultCurrencyRate = this.exchangeRatesList.filter(e => e.currency == this.defaultCurrency);
      var proposedRate = 0;
      if (foundRate.length > 0) {
        proposedRate = parseFloat(foundRate[0].rate);
      } 
      if (defaultCurrencyRate.length > 0) {
        var defaultRate = parseFloat(defaultCurrencyRate[0].rate);
        if (defaultRate == 1) {
          if (proposedRate < 1) {
            exRate = (1 / proposedRate).toFixed(2);
          } else {
            exRate = proposedRate;
          }
        } else {
          if (proposedRate < 1) {
            if (defaultRate < proposedRate) {
              exRate = (proposedRate / defaultRate).toFixed(2);
            } else if (defaultRate > proposedRate) {
              exRate = (defaultRate / proposedRate).toFixed(2);
            }
          } else if (proposedRate > 1) {
            if (defaultRate < proposedRate) {
              exRate = (defaultRate / proposedRate).toFixed(2);
            } else if (defaultRate > proposedRate) {
              if (defaultRate > proposedRate) {
                exRate = (proposedRate / defaultRate).toFixed(2);
              }
            }
          } else if (proposedRate == 1) {
            if (defaultRate < 1) {
              exRate = (proposedRate / defaultRate).toFixed(2);
            } else {
              exRate = (defaultRate / proposedRate).toFixed(2);
            }
          }
        }
      }
    }
    return exRate;
  }

  getCurrencyManualExchangeRate() {
    if (this.funderModel.dated) {
      var dated  = new Date(this.funderModel.dated.year + '-' + this.funderModel.dated.month + '-'
      + this.funderModel.dated.date);
      this.currencyService.getManualExRatesByDate(dated.toString()).subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  getExchangeRateForFunding() {
    if (this.funderModel.exRateSource == this.exRateSourceCodes.OPEN_EXCHANGE) {
      this.funderModel.exchangeRate = this.getCurrencyExchangeRate(this.funderModel.currency);
    } else if (this.funderModel.exRateSource == this.exRateSourceCodes.AFRICAN_BANK) {
    }
  }

  getExchangeRateForDisbursement() {
    this.disbursementModel.exchangeRate = this.getCurrencyExchangeRate(this.disbursementModel.currency);
  }

  calculateProjectFunding() {
    var amountsList = this.currentProjectFundersList.map(f => (f.exchangeRate > 1 || f.exchangeRate < 1) ? parseFloat((f.amount * (1 / f.exchangeRate)).toFixed(2)) : parseFloat((f.amount * f.exchangeRate).toFixed(2)));
    return amountsList.reduce(this.storeService.sumValues, 0);
  }

  calculateProjectDisbursement() {
    var amountsList = this.currentProjectDisbursementsList.map(d => (d.exchangeRate > 1 || d.exchangeRate < 1) ? parseFloat((d.amount * (1 / d.exchangeRate)).toFixed(2)) : parseFloat((d.amount * d.exchangeRate).toFixed(2)));
    return parseFloat(amountsList.reduce(this.storeService.sumValues, 0));
  }

  checkFieldType(typeId: number) {
    var result = this.fieldTypes.filter(f => f.typeId == typeId).map(f => f.field);
    return result;
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  checkIfSelected() {
    /*this.currentProjectFieldsList.forEach(function (field) {
      var id = field.id;

      var values = this.storeService.parseJson(this.customFieldsList.filter(f => f.id == id).map(v => v.values));
    if (values.length > 0) {
      var optionValue = values[0].filter(v => v.id == valId);
      optionValue.length > 0 ? optionValue[0].isSelected = true : null;
    }
    });*/
  }

  isShowCustomFields() {
    var isLoanExists = this.currentProjectFundersList.filter(f => f.fundingType == this.conditionsForCustomFields.GRANT_LAON);
    if (isLoanExists.length > 0) {
      return true;
    }

    var isHealthExists = this.currentProjectSectorsList.filter(s => s.sector.toLowerCase().indexOf(this.conditionsForCustomFields.HEALTH_SECTOR));
    if (isHealthExists.length > 0) {
      return true;
    }
    return false;
  }

  getFieldType(id: number) {
    return this.fieldType[id];
  }

  /*Reset form states*/
  resetProjectEntry() {
    if (this.activeProjectId != null && this.activeProjectId != 0) {
      this.btnProjectText = 'Edit Project';
    } else {
      this.btnProjectText = 'Save Project';
    }
    this.isProjectBtnDisabled = false;
  }

  resetSectorEntry() {
    this.sectorEntryType = 'aims';
    this.isSectorVisible = false;
    this.sectorPlaceHolder = 'Enter/Select Sector';
    this.sectorModel.fundsPercentage = 0.00;
    this.sectorModel.parentId = 0;
    this.sectorModel.projectId = 0;
    this.sectorModel.sectorId = null;
    this.sectorModel.sectorName = null;
    this.showMappingAuto = false;
    this.showMappingManual = false;
  }

  resetLocationEntry() {
    this.locationEntryType = 'aims';
    this.locationModel.fundsPercentage = 0.00;
    this.locationModel.projectId = 0;
    this.locationModel.locationId = null;
    this.locationModel.location = '';
  }

  resetFunderEntry() {
    this.funderEntryType = 'aims';
    this.funderModel.funder = '';
    this.funderModel.funderId = null;
    this.funderModel.currency = null;
    this.funderModel.amount = 0.00;
    this.funderModel.exchangeRate = 0.00;
    this.selectedFunderId = 0;
    this.funderInput.setValue(null);
  }

  resetImplementerEntry() {
    this.implementerEntryType = 'aims';
    this.implementerModel.implementer = null;
    this.implementerModel.implementerId = null;
    this.selectedImplementerId = 0;
    this.implementerInput.setValue(null);
  }

  resetDisbursementEntry() {
    this.disbursementEntryType = 'aims';
    this.disbursementModel.dated = null;
    this.disbursementModel.amount = 0.00;
  }

  resetDocumentEntry() {
    this.documentModel.documentTitle = null;
    this.documentModel.documentUrl = null;
  }

  resetDataEntryValidation() {
    this.currentEntryForm.resetForm();
  }

  resetCustomFields() {
    this.fieldModel.dropdownId = null;
    this.fieldModel.newText = null;
    this.customFieldsList.forEach(c => c.values.forEach(v => v.isSelected = false));
  }

  finishProject() {
    this.router.navigateByUrl('new-project');
  }

  goToHome() {
    localStorage.setItem('selected-projects', null);
    localStorage.setItem('active-project', '0');
    this.router.navigateByUrl('home');
  }

  displayNull(val: string) {
    return val ? val : 'N/a';
  }

}
