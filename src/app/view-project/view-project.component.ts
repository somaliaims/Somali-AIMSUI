import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SecurityHelperService } from '../services/security-helper.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Messages } from '../config/messages';
import { Settings } from '../config/settings';
import { ReportService } from '../services/report.service';
import { JoinProjectModalComponent } from '../join-project-modal/join-project-modal.component';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  requestNo: number = 0;
  errorMessage: string = null;
  successMessage: string = null;
  isError: boolean = false;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  isLocationLoading: boolean = true;
  isSectorLoading: boolean = true;
  isFunderLoading: boolean = true;
  isImplementerLoading: boolean = true;
  isDisbursementLoading: boolean = true;
  isDocumentLoading: boolean = true;
  isExcelGenerating: boolean = true;
  excelFile: string = null;
  projectProfileLink: string = null;
  dated: string = null;
  projectId: number = 0;
  delayTime: number = 2000;
  userProjectIds: any = [];
  deleteProjectIds: any = [];
  permissions: any = {};
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

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService, private securityService: SecurityHelperService,
    private infoModal: InfoModalComponent,
    private reportService: ReportService,
    private joinProjectModal: JoinProjectModalComponent) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.projects);
    this.isLoggedIn = this.securityService.checkIsLoggedIn();
    this.permissions = this.securityService.getUserPermissions();
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      this.projectId = id;
      if (id) {
        if (this.isLoggedIn) {
          this.getDeleteProjectIds();
          this.loadUserProjects();
        } else {
          this.loadProjectData(id);   
        }
        this.getProjectExcelReport();

        setTimeout(() => {
          this.loadProjectLocations(id);
        }, this.delayTime); 

        setTimeout(() => {
          this.loadProjectSectors(id);
        }, (this.delayTime + 1));
        
        setTimeout(() => {
          this.loadProjectFunders(id);
        }, (this.delayTime + 2));

        setTimeout(() => {
          this.loadProjectImplementers(id);
        }, (this.delayTime + 3));

        setTimeout(() => {
          this.loadProjectDisbursements(id);
        }, (this.delayTime + 4));

        setTimeout(() => {
          this.loadProjectDocuments(id);
        }, (this.delayTime + 5));

      } else {

      }
    }
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  addProjectLocation() {
    this.router.navigateByUrl('project-location/' + this.projectId);
  }

  addProjectSector() {
    this.router.navigateByUrl('project-sector/' + this.projectId);
  }

  addProjectFunder() {
    this.router.navigateByUrl('project-funder/' + this.projectId);
  }

  addProjectImplementer() {
    this.router.navigateByUrl('project-implementer/' + this.projectId);
  }

  addProjectDisbursement() {
    this.router.navigateByUrl('project-disbursement/' + this.projectId);
  }

  addProjectDocument() {
    this.router.navigateByUrl('project-document/' + this.projectId);
  }

  loadProjectData(id) {
    this.projectService.getProject(id).subscribe(
      data => {
        this.hideLoader();
        this.projectData = data;
      },
      error => {
        this.hideLoader();
        console.log(error);
      }
    )
  }

  loadProjectLocations(id) {
    this.projectService.getProjectLocations(id).subscribe(
      data => {
        this.hideLocationLoader();
        this.projectLocations = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectSectors(id) {
    this.projectService.getProjectSectors(id).subscribe(
      data => {
        this.hideSectorLoader();
        this.projectSectors = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectFunders(id) {
    this.projectService.getProjectFunders(id).subscribe(
      data => {
        this.hideFunderLoader();
        this.projectFunders = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectImplementers(id) {
    this.projectService.getProjectImplementers(id).subscribe(
      data => {
        this.hideImplementerLoader();
        this.projectImplementers = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectDisbursements(id) {
    this.projectService.getProjectDisbursements(id).subscribe(
      data => {
        this.hideDisbursementLoader();
        this.projectDisbursements = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  loadProjectDocuments(id) {
    this.projectService.getProjectDocuments(id).subscribe(
      data => {
        this.hideDocumentLoader();
        this.projectDocuments = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  loadUserProjects() {
    this.projectService.getUserProjects().subscribe(
      data => {
        if (data) {
          this.userProjectIds = data;
        }
        this.loadProjectData(this.projectId);
      }
    );
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

  printProfile() {
    this.storeService.printSimpleReport('rpt-project', 'Project profile report');
  }

  generatePDF() {
    this.blockUI.start('Generating PDF...');
    setTimeout(() => {
      var result = Promise.resolve(this.reportService.generatePDF('rpt-project'));
      result.then(() => {
        this.blockUI.stop();
      });
    },500);
  }

  deleteProjectLocation(projectId, locationId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectLocation(projectId, locationId).subscribe(
      data => {
        this.projectLocations = this.projectLocations.filter(l => l.id != locationId);
        this.blockUI.stop();
      }
    );
  }

  deleteProjectSector(projectId, sectorId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectSector(projectId, sectorId).subscribe(
      data => {
        this.projectSectors = this.projectSectors.filter(s => s.sectorId != sectorId);
        this.blockUI.stop();
      }
    );
  }

  deleteProjectFunder(projectId, funderId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectFunder(projectId, funderId).subscribe(
      data => {
        this.projectFunders = this.projectFunders.filter(f => f.funderId != funderId);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectImplementer(projectId, implementerId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectImplementer(projectId, implementerId).subscribe(
      data => {
        this.projectImplementers = this.projectImplementers.filter(i => i.implementerId != implementerId);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectDisbursement(id) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectDisbursement(id).subscribe(
      data => {
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectDocument(id) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectDocument(id).subscribe(
      data => {
        this.projectDocuments = this.projectDocuments.filter(d => d.id != id);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  convertDateToLongString(dated: string) {
    return (this.storeService.getLongDateString(dated));
  }

  isShowContactToUser(id: number) {
    return (this.userProjectIds.filter(ids => ids.id == id).length > 0) ? false : true;
  }

  contactProject(id) {
    this.router.navigateByUrl('contact-project/' + id);
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
            this.infoModal.openModal();
          }
          this.blockUI.stop();
        }
      );
    }
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

  hideLoader() {
    this.isLoading = false;
  }

  hideLocationLoader() {
    this.isLocationLoading = false;
  }

  hideSectorLoader() {
    this.isSectorLoading = false;
  }

  hideFunderLoader() {
    this.isFunderLoading = false;
  }

  hideImplementerLoader() {
    this.isImplementerLoading = false;
  }

  hideDisbursementLoader() {
    this.isDisbursementLoading = false;
  }

  hideDocumentLoader() {
    this.isDocumentLoading = false;
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


}
