import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { ProjectTypeService } from '../services/project-types.service';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  projectId: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  projectTypes: any = [];
  categories: any = [];
  filteredCategories: any = [];
  subCategories: any = [];
  filteredSubCategories: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  startDateModel: NgbDateStruct;
  model = { id: 0, title: '', projectTypeId: null, startDate: null, endDate: null, objective: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private calendar: NgbCalendar,
    private storeService: StoreService, private projectTypeService: ProjectTypeService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Project';
        this.isForEdit = true;
        this.projectId = id;
      }
    }

    this.getProjectTypes();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  getProjectTypes() {
    this.projectTypeService.getProjectTypesList().subscribe(
      data => {
        this.projectTypes = data;
        this.loadProjectData();
      },
      error => {

      }
    );
  }

  loadProjectData() {
    this.projectService.getProject(this.projectId.toString()).subscribe(
      data => {
        var sDateArr = data.startDate.split('/');
        var eDateArr = data.endDate.split('/');
        var startDateModel = {year: sDateArr[2], month: sDateArr[0], day: sDateArr[1]};
        var endDateModel = {year: eDateArr[2], month: eDateArr[0], day: eDateArr[1]};
        this.model.id = data.id;
        this.model.projectTypeId = data.projectTypeId;
        this.model.title = data.title;
        this.model.objective = data.objective;
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
      ProjectTypeId: this.model.projectTypeId,
      Title: this.model.title,
      StartDate: startDate,
      EndDate: endDate,
      Objective: this.model.objective
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

  resetFormState() {
    this.isBtnDisabled = false;
    if (this.isForEdit) {
      this.btnText = 'Edit Project';
    } else {
      this.btnText = 'Add Project';
    }
  }

}
