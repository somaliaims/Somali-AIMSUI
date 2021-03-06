import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { IATIService } from '../services/iati.service';
import { ProjectInfoModalComponent } from '../project-info-modal/project-info-modal.component';
import { ProjectiInfoModalComponent } from '../projecti-info-modal/projecti-info-modal.component';
import { Messages } from '../config/messages';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { Router } from '@angular/router';
//import { forEach } from '@angular/router/src/utils/collection';
import { SecurityHelperService } from '../services/security-helper.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ModalService } from '../services/modal.service';
import { FinancialYearService } from '../services/financial-year.service';
import { CurrencyService } from '../services/currency.service';
import { Settings } from '../config/settings';
import { FundingTypeService } from '../services/funding-type.service';

@Component({
  selector: 'app-merge-projects',
  templateUrl: './merge-projects.component.html',
  styleUrls: ['./merge-projects.component.css']
})


export class MergeProjectsComponent implements OnInit {

  isProjectBtnDisabled: boolean = true;
  errorMessage: string = '';
  infoMessage: string = '';
  permissions: any = [];
  iatiProjects: any = [];
  financialYears: any = [];
  fundingTypes: any = [];
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  projectIds: any = [];
  selectedProjects: any = [];
  sourceProjects: any = [];
  aimsProjects: any = [];
  currencies: any = [];
  exchangeRates: any = [];

  viewProject: any = {};
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewProjectDisbursements: any = [];
  projectDisbursements: any = [];

  calendarMaxDate: any = {};
  isIatiLoading: boolean = true;
  isAimsLoading: boolean = true;
  financialsOk: boolean = true;
  sectorPercentageOk: boolean = true;
  locationPercentageOk: boolean = true;
  locationPercentage: number = 0;
  sectorPercentage: number = 0;
  descriptionLimit: number = Settings.descriptionLongLimit;
  requestNo: number = 0;
  currentYear: number = 0;
  model: any = { id: 0, title: null, startDate: null, endDate: null, startingFinancialYear: null, endingFinancialYear: null, 
  projectValue: null, projectCurrency: null, description: null, fundingTypeId: null };

  disbursementTypeConstants: any = {
    1: 'Actual',
    2: 'Planned'
  }

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private iatiService: IATIService,
    private projectInfoModal: ProjectInfoModalComponent, private storeService: StoreService,
    private projectIATIInfoModal: ProjectiInfoModalComponent,
    private errorModal: ErrorModalComponent, private router: Router,
    private modalService: ModalService,
    private securityService: SecurityHelperService,
    private yearService: FinancialYearService,
    private fundingTypeService: FundingTypeService,
    private currencyService: CurrencyService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.entry);
    this.blockUI.start('Loading projects data...');
    this.currentYear = this.storeService.getCurrentYear();
    this.getExchangeRates();
    this.getFinancialYears();
    this.getCurrenciesList();
    this.getFundingTypes();
    //this.calendarMaxDate = this.storeService.getCalendarUpperLimit();
    var projects = localStorage.getItem('merge-projects');
    if (projects) {
      this.requestNo = this.storeService.getNewRequestNumber();
      this.storeService.currentRequestTrack.subscribe(model => {
        if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
          this.errorMessage = model.errorMessage;
          this.errorModal.openModal();
        }
      });

      var parsedProjects = JSON.parse(projects);
      //Load iati projects
      var filteredIATI = parsedProjects.filter(function (project) {
        return project.type == 'IATI';
      });

      var iatiIdsArr = [];
      filteredIATI.forEach(function (project) {
        var obj = { identifier: project.identifier };
        iatiIdsArr.push(obj);
      }.bind(this));
      //this.loadIATIProjectsForIds(iatiIdsArr);
      //Load aims projects
      var filteredAIMS = parsedProjects.filter(function (project) {
        return project.type == 'AIMS';
      });
      var aimsIdsArr = [];
      filteredAIMS.forEach(function (project) {
        var id = project.identifier;
        aimsIdsArr.push(id);
      });
      this.projectIds = aimsIdsArr;

      //this.loadIATIProjectsForIds(iatiIdsArr);
      this.loadAIMSProjectsForIds(aimsIdsArr);
    } else {
      this.router.navigateByUrl('new-entry');
    }
  }

  loadIATIProjectsForIds(modelArr: any) {
    this.isIatiLoading = true;
    this.iatiService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.sourceProjects = data;
        this.isIatiLoading = false;
        this.isProjectBtnDisabled = false;
      },
      error => {
        this.isIatiLoading = false;
        this.isProjectBtnDisabled = false;
      }
    );
  }

  getFinancialYears() {
    this.yearService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }
      }
    );
  }

  getCurrenciesList() {
    this.currencyService.getCurrenciesForUser().subscribe(
      data => {
        if (data) {
          this.currencies = data;
        }
      }
    );
  }

  getFundingTypes() {
    this.fundingTypeService.getFundingTypesList().subscribe(
      data => {
        if (data) {
          this.fundingTypes = data;
        }
      }
    );
  }

  selectForMerge(e) {
    var id = e.target.id.split('-')[1];
    var project = this.aimsProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.selectedProjects.push(project[0]);
    }
    this.aimsProjects = this.aimsProjects.filter(p => p.id != id);
  }

  deSelectForMerge(e) {
    if (this.selectedProjects.length < 3) {
      this.errorMessage = Messages.ATLEAST_PROJECT_MERGE;
      this.errorModal.openModal();
      return false;
    }

    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.aimsProjects.push(project[0]);
    }
    this.selectedProjects = this.selectedProjects.filter(p => p.id != id);
  }

  enterTitle(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.title = project[0].title.trim();
    }
  }

  enterDescription(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.description = project[0].description.trim();
    }
  }

  enterStartingYear(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.startingFinancialYear = project[0].startingFinancialYear;
      this.setDisbursementsData();
    }
    this.calculateDisbursementsTotal();
  }

  enterEndingYear(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.endingFinancialYear = project[0].endingFinancialYear;
      this.setDisbursementsData();
    }
    this.calculateDisbursementsTotal();
  }

  enterStartDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.selectedProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.startDate = this.formatDateToYMD(selectedProject[0].startDate);
      this.setDisbursementsData();
    }
  }

  enterEndDate(e) {
    var id = e.target.id.split('-')[1];
    var selectedProject = this.selectedProjects.filter(p => p.id == id);
    if (selectedProject && selectedProject.length > 0) {
      this.model.endDate = this.formatDateToYMD(selectedProject[0].endDate);
      this.setDisbursementsData();
    }
  }

  enterProjectValue (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.projectValue = project[0].projectValue;
    }
    this.calculateDisbursementsTotal();
  }

  enterDisbursement(projectId, year, disbursementType) {
    var project = this.selectedProjects.filter(p => p.id == projectId);
    if (project.length > 0) {
      var disbursement = project[0].disbursements.filter(d => d.year == year && d.disbursementType == disbursementType);
      if (disbursement.length > 0) {
        var disbursementToUpdate = this.projectDisbursements.filter(d => d.year == year && d.disbursementType == disbursementType);
        if (disbursementToUpdate.length > 0) {
          disbursementToUpdate[0].amount = disbursement[0].amount;
        }
        this.calculateDisbursementsTotal();
      }
    }
  }

  enterProjectCurrency (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.projectCurrency = project[0].projectCurrency;
      this.getExchangeRateForCurrency();
    }
    this.calculateDisbursementsTotal();
  }

  enterProjectDescription (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.description = project[0].description;
    }
  }

  setDisbursementsData() {
    if (this.model.startDate != null && this.model.endDate != null) {
      this.model.startingFinancialYear = new Date(this.model.startDate).getFullYear();
      this.model.endingFinancialYear = new Date(this.model.endDate).getFullYear();
      for (var yr = this.model.startingFinancialYear; yr <= this.model.endingFinancialYear; yr++) {
        var data = this.projectDisbursements.filter(d => d.year == yr);
        if (data.length == 0) {
  
          if (yr <= this.currentYear) {
            var newDisbursement = {
              year: yr,
              currency: this.model.projectCurrency,
              exchangeRate: 1,
              disbursementType: 1,
              amount: 0
            };
            this.projectDisbursements.push(newDisbursement);
          }
  
          if (yr >= this.currentYear) {
            var newDisbursement = {
              year: yr,
              currency: this.model.projectCurrency,
              exchangeRate: 1,
              disbursementType: 2,
              amount: 0
            };
            this.projectDisbursements.push(newDisbursement);
          }
        }
      }
  
      if (this.projectDisbursements.length > 0) {
        this.projectDisbursements.sort((a, b) => parseFloat(a.year) - parseFloat(b.year));
        this.calculateDisbursementsTotal();
      }
    }
  }

  calculateDisbursementsTotal() {
    var projectValue = !this.model.projectValue ? parseFloat('0') : parseFloat(this.model.projectValue);
    var totalDisbursements = 0;
    if (this.projectDisbursements.length > 0) {
      this.projectDisbursements.forEach((d) => {
        totalDisbursements += parseFloat(d.amount);
      });
    }
    this.financialsOk = (projectValue == totalDisbursements) ? true : false;
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.isAimsLoading = true;
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.selectedProjects = data;
        if (this.model.projectCurrency) {
        }

        this.calculateDisbursementsTotal();
        this.calculateSectorPercentage();
        this.calculateLocationPercentage();
        this.isAimsLoading = false;
        this.blockUI.stop();
      }
    )
  }

  viewAIMSProject(e) {
    var projectId = e.target.id.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.selectedProjects.filter(p => p.id == projectId);
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
      var selectProject = this.sourceProjects.filter(p => p.id == projectId);
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

  mergeAndSaveProject() {
    if (this.selectedProjects.length <= 1) {
      this.errorMessage = Messages.INVALID_PROJECT_MERGE;
      this.errorModal.openModal();
      return false;
    }

    if (!this.model.startingFinancialYear || this.model.startingFinancialYear == 'null') {
      this.errorMessage = Messages.INVALID_YEAR;
      this.errorModal.openModal();
      return false;
    }

    if (!this.model.endingFinancialYear || this.model.endingFinancialYear == 'null') {
      this.errorMessage = Messages.INVALID_YEAR;
      this.errorModal.openModal();
      return false;
    }

    if (this.model.startingFinancialYear > this.model.endingFinancialYear) {
      this.errorMessage = Messages.INVALID_START_END_YEAR;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Merging projects...');
    var funderIds: any = [];
    var implementerIds: any = [];
    var sectors: any = [];
    var locations: any = [];
    var documents: any = [];
    var markers: any = [];
    var disbursements: any = [];
    
    this.selectedProjects.forEach((p) => {
      if (p.funders.length > 0) {
        var ids = p.funders.map(f => parseInt(f.funderId));
        funderIds = funderIds.concat(ids);
      }

      if (p.implementers.length > 0) {
        var ids = p.implementers.map(i => parseInt(i.implementerId));
        implementerIds = implementerIds.concat(ids);
      }

      if (p.sectors.length > 0) {
        p.sectors.forEach((s) => {
          s.fundsPercentage = parseFloat(s.fundsPercentage);
          sectors.push(s);
        });
      }

      if (p.locations.length > 0) {
        p.locations.forEach((l) => {
          l.fundsPercentage = parseFloat(l.fundsPercentage);
          locations.push(l);
        });
      }

      if (p.documents.length > 0) {
        p.documents.forEach((d) => {
          documents.push(d);
        });
      }

      if (p.markers.length > 0) {
        p.markers.forEach(m => {
          markers.push(m);
        });
      }
    });


    if (this.projectDisbursements.length > 0) {
      disbursements = this.projectDisbursements;
      disbursements.forEach((d) => {
        d.amount = parseFloat(d.amount);
        d.exchangeRate = parseFloat(d.exchangeRate);
      });
    }
    //this.selectedProjects.map(p => p.id);
    
    var model = {
      title: this.model.title,
      projectValue: parseFloat(this.model.projectValue),
      projectCurrency: this.model.projectCurrency,
      exchangeRate: parseFloat(this.model.exchangeRate),
      startDate: this.model.startDate,
      endDate: this.model.endDate,
      startingFinancialYear: parseInt(this.model.startingFinancialYear),
      endingFinancialYear: parseInt(this.model.endingFinancialYear),
      description: this.model.description,
      fundingTypeId: parseInt(this.model.fundingTypeId),
      projectIds: this.projectIds,
      funderIds: funderIds,
      implementerIds: implementerIds,
      sectors: sectors,
      locations: locations,
      disbursements: disbursements,
      documents: documents,
      markers: markers
    };

    this.projectService.mergeProjects(model).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('new-project');
        }
        this.blockUI.stop();
      }
    );
  }

  getExchangeRates() {
    this.currencyService.getExchangeRatesList().subscribe(
      data => {
        if (data && data.rates) {
          this.exchangeRates = data.rates;
        }
      }
    );
  }

  getExchangeRateForCurrency() {
    if (this.model.projectCurrency) {
      var exRate = this.exchangeRates.filter(e => e.currency == this.model.projectCurrency);
      if (exRate.length > 0) {
        this.model.exchangeRate = exRate[0].rate;
      }
    } else {
      this.model.exchangeRate = 1;
    }
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  removeSector(projectId: number, sectorId: number) {
    var project = this.selectedProjects.filter(p => p.id == projectId);
    if (project.length > 0) {
      var sectors = project[0].sectors;
      if (sectors.length > 0) {
        project[0].sectors = sectors.filter(s => s.sectorId != sectorId);
      }
    }
    this.calculateSectorPercentage();
  }

  removeLocation(projectId: number, locationId: number) {
    var project = this.selectedProjects.filter(p => p.id == projectId);
    if (project.length > 0) {
      var locations = project[0].locations;
      if (locations.length > 0) {
        project[0].locations = locations.filter(l => l.locationId != locationId);
      }
    }
    this.calculateLocationPercentage();
  }

  removeDocument(projectId: number, documentId: number) {
    var project = this.selectedProjects.filter(p => p.id == projectId);
    if (project.length > 0) {
      var documents = project[0].documents;
      if (documents.length > 0) {
        project[0].documents = documents.filter(d => d.id != documentId);
      }
    }
  }

  removeMarker(projectId: number, markerId: number) {
    var project = this.selectedProjects.filter(p => p.id == projectId);
    if (project.length > 0) {
      var markers = project[0].markers;
      if (markers.length > 0) {
        project[0].markers = markers.filter(m => m.markerId != markerId);
      }
    }
  }

  calculateDisbursements() {
  }

  calculateSectorPercentage() {
    var sectorPercentage = 0;
    if (this.selectedProjects.length > 0) {
      var sectorsExist = false;
      this.selectedProjects.forEach(p => {
        if (p.sectors.length > 0) {
          sectorsExist = true;
          p.sectors.forEach(s => {
            sectorPercentage += s.fundsPercentage;
          });
        }
      });

      if (!sectorsExist) {
        sectorPercentage = 100;
      }
    }
    this.sectorPercentageOk = (sectorPercentage == 100) ? true : false; 
  }

  calculateLocationPercentage() {
    var locationPercentage = 0;
    if (this.selectedProjects.length > 0) {
      var locationsExist = false;
      this.selectedProjects.forEach(p => {
        if (p.locations.length > 0) {
          locationsExist = true;
          p.locations.forEach(l => {
            locationPercentage += l.fundsPercentage;
          });
        }
      });

      if (!locationsExist) {
        locationPercentage = 100;
      }
    }
    this.locationPercentageOk = (locationPercentage == 100) ? true : false;
  }

  formatToLongDate(dated: string) {
    return this.storeService.getLongDateString(dated);
  }

  formatDateToYMD(dated: string) {
    return this.storeService.convertToDateInputFormat(dated);
  }

  proceedToDataEntry() {
    this.modalService.close('confirmation-modal');
    this.router.navigateByUrl('project-entry');
  }

  closeConfirmationModal() {
    this.modalService.close('confirmation-modal');
    this.router.navigateByUrl('home');
  }

}
