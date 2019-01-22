import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization-model';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { startWith, map } from 'rxjs/operators';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-project-implementer',
  templateUrl: './project-implementer.component.html',
  styleUrls: ['./project-implementer.component.css']
})
export class ProjectImplementerComponent implements OnInit {

  @Input()
  isBtnDisabled: boolean = false;
  btnText: string = 'Add Project Implementor';
  errorMessage: string = '';
  organizations: any = [];
  requestNo: number = 0;
  selectedOrganizationId: number = 0;
  isError: boolean = false;
  isLoading: boolean = false;
  model = { projectId: 0, organizationId: null };
  implementerSelectionForm: FormGroup;
  userInput = new FormControl();
  filteredOrganizations: Observable<Organization[]>;

  constructor(private fb: FormBuilder,private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private organizationService: OrganizationService,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Add Implementor';
        this.model.projectId = id;
        this.loadOrganizations();
      } else {
        this.router.navigateByUrl('/');
      }
    }
    
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });

    this.implementerSelectionForm = this.fb.group({
      userInput: null,
    });
  }

  private filterOrganizations(value: string): Organization[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.organizations.filter(organization => organization.organizationName.toLowerCase().indexOf(filterValue) !== -1);
    }
  }

  loadOrganizations() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizations = data;
        this.filteredOrganizations = this.userInput.valueChanges
      .pipe(
        startWith(''),
        map(organization => organization ? this.filterOrganizations(organization) : this.organizations.slice())
      );
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  displayFn(organization?: Organization): string | undefined {
    if (organization) {
      this.selectedOrganizationId = organization.id;
    }
    return organization ? organization.organizationName : undefined;
  }

  saveProjectImplementor() {
    if (this.selectedOrganizationId == 0) {
      return false;
    }

    this.model.organizationId = this.selectedOrganizationId;
    var model = {
      ProjectId: this.model.projectId,
      ImplementorId: this.model.organizationId,
    };

    this.isBtnDisabled = true;
      this.btnText = 'Saving...';
      this.projectService.addProjectImplementer(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project implementer ' + Messages.NEW_RECORD;
            this.storeService.newInfoMessage(message);
            this.router.navigateByUrl('view-project/' + this.model.projectId);
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

  resetFormState() {
    this.isBtnDisabled = false;
    this.btnText = 'Add Implementor';
  }

}
