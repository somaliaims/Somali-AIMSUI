import { Component, OnInit, Input, Injectable, NgZone, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { SecurityHelperService } from '../services/security-helper.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ReportService } from '../services/report.service';
import { Settings } from '../config/settings';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalService } from '../services/modal.service';
import { Messages } from '../config/messages';
import { JoinProjectModalComponent } from '../join-project-modal/join-project-modal.component';

@Component({
  selector: 'project-report-modal',
  templateUrl: './project-report-modal.component.html',
  styleUrls: ['./project-report-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class ProjectReportModalComponent implements OnInit {

  @Input()
  projectId: number = 0;

  @Output()
  reportRendered = new EventEmitter<boolean>();
  
  isLoggedIn: boolean = false;
  deletionSuccess: boolean = false;
  permissions: any = {};
  requestNo: number = 0;
  errorMessage: string = null;
  successMessage: string = null;
  isError: boolean = false;
  isExcelGenerating: boolean = true;
  isLoading: boolean = true;
  excelFile: string = null;
  projectProfileLink: string = null;
  dated: string = null;
  userProjectIds: any = [];
  deleteProjectIds: any = [];

  monthStrings: any = { 
    "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June",
    "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December" 
  }

  disbursementTypeConstants: any = {
    1: 'Actual',
    2: 'Planned'
  }

  //project data variables
  projectData: any = [];
  projectLocations: any = [];
  projectSectors: any = [];
  projectFunders: any = [];
  projectImplementers: any = [];
  projectDisbursements: any = [];
  projectDocuments: any = [];
  projectMarkers: any = [];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private infoModal: InfoModalComponent,
    private modalService: ModalService,
    private reportService: ReportService,
    private joinProjectModal: JoinProjectModalComponent,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.projects);
    this.isLoggedIn = this.securityService.checkIsLoggedIn();
    if (this.isLoggedIn) {
      this.getDeleteProjectIds();
      this.loadUserProjects();
    }
    this.getProjectReport();
    this.getProjectExcelReport();
    this.permissions = this.securityService.getUserPermissions();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    this.openModal();
  }

  getProjectReport() {
    this.projectService.getProjectReport(this.projectId.toString()).subscribe(
      data => {
        if (data && data.projectProfile) {
          var project = data.projectProfile.projects.length > 0 ? data.projectProfile.projects[0] : null;
          if (project) {
            this.ngZone.run(() => {
              this.projectData.title = project.title;
              this.projectData.startDate = project.startDate;
              this.projectData.endDate = project.endDate;
              this.projectData.startingFinancialYear = project.startingFinancialYear;
              this.projectData.endingFinancialYear = project.endingFinancialYear;
              this.projectData.dateUpdated = project.dateUpdated;
              this.projectData.projectCurrency = project.projectCurrency;
              this.projectData.projectValue = project.projectValue;
              this.projectData.exchangeRate = project.exchangeRate;
              this.projectData.description = project.description;
              this.projectFunders = project.funders;
              this.projectImplementers = project.implementers;
              this.projectSectors = project.sectors;
              this.projectLocations = project.locations;
              this.projectDisbursements = project.disbursements;
              this.projectDocuments = project.documents;
              this.projectMarkers = project.markers;
              this.isLoading = false;
            });
          }
        }
      }
    );
  }

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      data => {
        if (data) {
          this.userProjectIds = data;
        }
        this.getProjectReport();
      }
    );
  }

  getDeleteProjectIds() {
    this.projectService.getDeleteProjectIds().subscribe(
      data => {
        if (data) {
          this.deleteProjectIds = data;
        }
      }
    );
  }

  canJoinProject() {
    var projectIds = this.userProjectIds.map(p => p.id);
    return (projectIds.includes(this.projectId)) ? false : true;
  }

  applyForProjectMembership() {
    if (this.projectId) {
      this.joinProjectModal.openModal();
    }
  }

  getProjectExcelReport() {
    this.projectService.getProjectReport(this.projectId.toString()).subscribe(
      data => {
        if (data) {
          if (data.reportSettings) {
            this.excelFile = data.reportSettings.excelReportName;
            this.projectProfileLink = data.reportSettings.reportUrl;
            var currentDate = this.storeService.getLongDateString(new Date());
            this.dated = currentDate;
            this.setExcelFile();
            var projects = data.projectProfile.projects;
            if (projects.length > 0) {
              var project = projects[0];
              this.projectMarkers = project.markers.filter(m => m.values != '');
            }
          }
          this.isExcelGenerating = false;
        }
      }
    );
  }

  formatDateUKStyle(dated: any) {
    var validDate = Date.parse(dated);
    if (isNaN(validDate)) {
      return 'Invalid date';
    }
    var datesArr = dated.split('/');
    return this.storeService.formatDateInUkStyle(parseInt(datesArr[2]), parseInt(datesArr[0]), parseInt(datesArr[1]));
  }
  
  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

  formatNumber(value: number) {
    if (!value) {
      return value;
    }
    if (!isNaN(value) && value > 0) {
      return this.storeService.getNumberWithCommas(value);
    }
    return value;
  }

  printProfile() {
    this.storeService.printSimpleReport('rpt-project', 'Project profile report');
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-project', 100));
      result.then(() => {
        this.blockUI.stop();
      });
    },500);
  }

  isShowContactToUser(id: number) {
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? false : true;
  }

  contactProject() {
    this.modalService.close('project-report-modal');
    setTimeout(() => {
      this.router.navigateByUrl('contact-project/' + this.projectId);
    }, 500);
    
  }

  isShowDeleteProject(id: number) {
    if (this.deleteProjectIds.includes(id)) {
      return false;
    }
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? true : false;
  }

  makeDeleteRequest(id: number) {
    if (id) {
      var model = { projectId: id, userId: 0 };
      this.blockUI.start('Making project delete request...');
      this.projectService.makeProjectDeletionRequest(model).subscribe(
        data => {
          if (data) {
            this.deleteProjectIds.push(id);
            this.successMessage = Messages.DELETION_REQUEST_INFO;
            this.deletionSuccess = true;
            setTimeout(() => {
              this.deletionSuccess = false;
            }, 5000);
          }
          this.blockUI.stop();
        }
      );
    }
  }

  openModal() {
    setTimeout(() => {
      this.modalService.open('project-report-modal');
    }, 500);
  }

  closeModal() {
    this.reportRendered.emit(false);
    this.modalService.close('project-report-modal');
  }

  ngOnDestroy() {
    this.reportRendered.emit(false);
  }

}
