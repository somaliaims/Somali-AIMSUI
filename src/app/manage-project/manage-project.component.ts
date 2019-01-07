import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { IATIService } from '../services/iati.service';
import { ModalService } from '../services/modal.service';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: []
})
export class ManageProjectComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isIATILoading: boolean = false;
  isBtnDisabled: boolean = false;
  projectId: number = 0;
  counter: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  projectTypes: any = [];
  categories: any = [];
  filteredCategories: any = [];
  subCategories: any = [];
  filteredSubCategories: any = [];
  iatiActivities: any = [];
  filteredIatiActivities: any = [];
  matchingProjects: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  isSearchingProjects: boolean = false;
  isSearchedResults: boolean = false;
  displayTime: number = 5000;
  startDateModel: NgbDateStruct;
  model = { id: 0, title: '',  startDate: null, endDate: null, description: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private calendar: NgbCalendar,
    private storeService: StoreService, private iatiService: IATIService,
    private modalService: ModalService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Project';
        this.isForEdit = true;
        this.projectId = id;
        this.loadProjectData();
      } 
    }
    
    //this.loadIATIActivities();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  loadIATIActivities() {
    this.iatiService.getIATIActivities().subscribe(
      data => {
        this.iatiActivities = data;
      },
      error => {
      }
    )
  }

  filterMatchingActivities(e) {
    this.isIATILoading = true;
    var str = e.target.value;
    this.iatiService.getFilteredIATIActivities(str).subscribe(
      data => {
        this.isIATILoading = false;
        this.filteredIatiActivities = data;
      },
      error => {
        this.isIATILoading = false;
        console.log(error);
      }
    )
  }

  selectIATIActivity(e) {
    var id = e.target.id;
    var selectActivity = this.filteredIatiActivities.filter(
      iati => iati.id == id
    );

    if (selectActivity.length && selectActivity.length > 0) {
      this.model.title = selectActivity[0].title;
      this.model.description = selectActivity[0].description;
    }
    
  }

  loadProjectData() {
    this.projectService.getProject(this.projectId.toString()).subscribe(
      data => {
        var sDateArr = data.startDate.split('/');
        var eDateArr = data.endDate.split('/');
        var startDateModel = {year: parseInt(sDateArr[2]), month: parseInt(sDateArr[0]), day: parseInt(sDateArr[1])};
        var endDateModel = {year: parseInt(eDateArr[2]), month: parseInt(eDateArr[0]), day: parseInt(eDateArr[1])};
        this.model.id = data.id;
        this.model.title = data.title;
        this.model.description = data.description;
        this.model.startDate = startDateModel;
        this.model.endDate = endDateModel;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveProject() {
    var startDate = this.model.startDate.year + '-' + this.model.startDate.month + '-' + 
          this.model.startDate.day;
    var endDate = this.model.endDate.year + '-' + this.model.endDate.month + '-' + 
          this.model.endDate.day;

    var model = {
      Title: this.model.title,
      StartDate: startDate,
      EndDate: endDate,
      Description: this.model.description
    };

    this.isBtnDisabled = true;
    if (this.isForEdit) {
      this.btnText = 'Updating...';
      this.projectService.updateProject(this.model.id, model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'Project' + Messages.RECORD_UPDATED;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('projects');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
          this.resetFormState();
        }
      );
    } else {
      this.btnText = 'Saving...';
      this.projectService.addProject(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('projects');
          } else {
            this.resetFormState();
          }
        },
        error => {
          this.errorMessage = error;
          this.isError = true;
          this.resetFormState();
        }
      );
    }
  }

  searchProjects() {
    if (this.model.title != null) {
      this.isSearchingProjects = true;
      
      this.projectService.filterProjects(this.model.title).subscribe(
        data => {
          this.isSearchingProjects = false;
          if (data && data.length) {
            this.matchingProjects = data
            this.isSearchedResults = true;
          } else {
            setTimeout(() => {
              this.isSearchedResults = true;
            }, this.displayTime);
          }
        },
        error => {
          this.isSearchingProjects = false;
        }
      );
    } 
  }

  showProjectProfile(e) {
    var id = e.target.id;
    if (id) {
      this.closeModal('matching-projects');
      this.router.navigateByUrl('view-project/' + id);
    }
  }

  resetFormState() {
    this.isBtnDisabled = false;
    if (this.isForEdit) {
      this.btnText = 'Edit Project';
    } else {
      this.btnText = 'Add Project';
    }
  }

  openMatchingProjects() {
    this.openModal('matching-projects');
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
