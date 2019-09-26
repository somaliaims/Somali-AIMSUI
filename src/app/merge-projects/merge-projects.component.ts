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
import { forEach } from '@angular/router/src/utils/collection';
import { SecurityHelperService } from '../services/security-helper.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ModalService } from '../services/modal.service';
import { FinancialYearService } from '../services/financial-year.service';
import { CurrencyService } from '../services/currency.service';

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
  filteredIatiProjects: any = [];
  filteredAIMSProjects: any = [];
  selectedProjects: any = [];
  sourceProjects: any = [];
  aimsProjects: any = [];
  currencies: any = [];

  viewProject: any = {};
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewProjectDisbursements: any = [];

  calendarMaxDate: any = {};
  isIatiLoading: boolean = true;
  isAimsLoading: boolean = true;
  requestNo: number = 0;
  model: any = { id: 0, title: '', startingFinancialYear: 0, endingFinancialYear: 0, 
  projectValue: null, projectCurrency: null, description: null };

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private iatiService: IATIService,
    private projectInfoModal: ProjectInfoModalComponent, private storeService: StoreService,
    private projectIATIInfoModal: ProjectiInfoModalComponent,
    private errorModal: ErrorModalComponent, private router: Router,
    private modalService: ModalService,
    private securityService: SecurityHelperService,
    private yearService: FinancialYearService,
    private currencyService: CurrencyService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditProject) {
      this.router.navigateByUrl('projects');
    }

    this.getFinancialYears();
    this.getCurrenciesList();
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
      this.loadIATIProjectsForIds(iatiIdsArr);

      //Load aims projects
      var filteredAIMS = parsedProjects.filter(function (project) {
        return project.type == 'AIMS';
      });
      var aimsIdsArr = [];
      filteredAIMS.forEach(function (project) {
        var id = project.identifier;
        aimsIdsArr.push(id);
      });

      this.loadIATIProjectsForIds(iatiIdsArr);
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
    )
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
    this.currencyService.getCurrenciesList().subscribe(
      data => {
        if (data) {
          this.currencies = data;
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
    }
  }

  enterEndingYear(e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.endingFinancialYear = project[0].endingFinancialYear;
    }
  }

  enterProjectValue (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.projectValue = project[0].projectValue;
    }
  }

  enterProjectCurrency (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.projectCurrency = project[0].projectCurrency;
    }
  }

  enterProjectDescription (e) {
    var id = e.target.id.split('-')[1];
    var project = this.selectedProjects.filter(p => p.id == id);
    if (project.length > 0) {
      this.model.description = project[0].description;
    }
  }

  loadAIMSProjectsForIds(modelArr: any) {
    this.isAimsLoading = true;
    this.projectService.extractProjectsByIds(modelArr).subscribe(
      data => {
        this.selectedProjects = data;
        this.isAimsLoading = false;
      },
      error => {
        this.isAimsLoading = false;
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

    var startDate = this.model.startDate.year + '-' + this.model.startDate.month + '-' +
      this.model.startDate.day;
    var endDate = this.model.endDate.year + '-' + this.model.endDate.month + '-' +
      this.model.endDate.day;

    if (startDate > endDate) {
      this.errorMessage = Messages.INVALID_STARTEND_DATE;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Merging projects...');
    var Ids = this.selectedProjects.map(p => p.id);
    var model = {
      title: this.model.title,
      description: this.model.description,
      startDate: startDate,
      endDate: endDate,
      projectsIds: Ids
    };

    this.projectService.mergeProjects(model).subscribe(
      data => {
        if (data) {
          var projectsList: any = [];
          this.sourceProjects.forEach(function(p) {
            var project = { identifier: p.identifier, type: 'IATI' };
            projectsList.push(project);
          });

          this.aimsProjects.forEach(function (p) {
            projectsList.push({
              identifier: p.identifier,
              type: 'AIMS'
            })
          });

          var projects = JSON.stringify(projectsList);
          localStorage.setItem('active-project', data);
          localStorage.setItem('selected-projects', projects);
          this.blockUI.stop();
          this.modalService.open('confirmation-modal');
        }
      }
    )
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
