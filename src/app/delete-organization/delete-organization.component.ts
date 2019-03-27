import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store-service';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectInfoModalComponent } from '../project-info-modal/project-info-modal.component';

@Component({
  selector: 'app-delete-organization',
  templateUrl: './delete-organization.component.html',
  styleUrls: ['./delete-organization.component.css']
})
export class DeleteOrganizationComponent implements OnInit {

  organizationsList: any = [];
  projectsList: any = [];
  requestNo: number = 0;
  id: string = null;
  errorMessage: string = null;
  isLoading: boolean = true;

  viewProject: any = [];
  viewProjectLocations: any = [];
  viewProjectSectors: any = [];
  viewProjectDocuments: any = [];
  viewProjectFunders: any = [];
  viewProjectImplementers: any = [];
  viewParticipatingOrganizations: any = [];
  viewProjectDisbursements: any = [];

  model: any = { organizationId: 0 };
  
  @BlockUI() blockUI: NgBlockUI;
  constructor(private organizationService: OrganizationService, private router: Router,
    private storeService: StoreService, private errorModal: ErrorModalComponent,
    private route: ActivatedRoute, private projectInfoModal: ProjectInfoModalComponent) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      this.id = this.route.snapshot.params["{id}"];
    }
    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
    this.getOrganizationsList();
    this.getOrganizationProjects();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data) {
          this.organizationsList = data;
          this.organizationsList = this.organizationsList.filter(o => o.id != this.id);
        }
      }
    )
  }

  getOrganizationProjects() {
    this.organizationService.getOrganizationProjects(this.id).subscribe(
      data => {
        if (data) {
          this.projectsList = data;
        }
        this.isLoading = false;
      }
    )
  }

  deleteAndMergeOrganization() {
    this.blockUI.start('Deleting organization...');
    this.organizationService.deleteOrganization(this.id, this.model.organizationId).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('organizations');
        }
        this.blockUI.stop();
      }
    )
  }

  viewProjectDetail(e) {
    var projectId = e.target.value.split('-')[1];
    if (projectId && projectId != 0) {
      var selectProject = this.projectsList.filter(p => p.id == projectId);
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

}
