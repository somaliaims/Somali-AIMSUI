import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent implements OnInit {

  @Input()
  isForEdit: boolean = false;
  isBtnDisabled: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  projectTypes: any = [];
  categories: any = [];
  filteredCategories: any = [];
  subCategories: any = [];
  filteredSubCategories: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  model = { id: 0, projectName: '', projectTypeId: null, categoryId: null, subCategoryId: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Project';
        this.isForEdit = true;
        this.orgId = id;
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
    
  }
  

  loadProjectData() {
    this.projectService.getProject(this.orgId.toString()).subscribe(
      data => {
        this.model.id = data.id;
        this.model.projectTypeId = data.projectTypeId;
        this.model.projectName = data.projectName;

        //Filter categories for the selected project type
        this.filteredCategories = this.categories.filter(function (category) {
          return category.id == data.categoryId;
        });
        this.model.categoryId = data.categoryId;

        //Filter sub-categories for the selected category
        this.filteredSubCategories = this.subCategories.filter(function (subCategory) {
          return subCategory.id == data.subCategoryId;
        });
        
        this.model.subCategoryId = data.subCategoryId;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveProject() {
    var model = {
      ProjectTypeId: this.model.projectTypeId,
      CategoryId: this.model.categoryId,
      SubCategoryId: this.model.subCategoryId,
      ProjectName: this.model.projectName,
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
