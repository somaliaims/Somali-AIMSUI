import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectInfoModalComponent } from 'src/app/project-info-modal/project-info-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'project-finish',
  templateUrl: './project-finish.component.html',
  styleUrls: ['./project-finish.component.css']
})
export class ProjectFinishComponent implements OnInit {

  @Input()
  projectId: number = 0;
  @Input()
  viewProject = {};
  @Input()
  viewProjectFunders: any = [];
  @Input()
  viewProjectLocations: any = [];
  @Input()
  viewProjectSectors: any = [];
  @Input()
  viewProjectImplementers: any = [];
  @Input()
  viewProjectDocuments: any = [];
  @Input()
  viewProjectDisbursements: any = [];
  @Input()
  viewProjectMarkers: any = [];

  @BlockUI() blockUI: NgBlockUI;
  constructor(private projectInfoModal: ProjectInfoModalComponent, private projectService: ProjectService,
    private router: Router) { }

  ngOnInit() {
  }

  getProjectView() {
    if (this.projectId != 0) {
      this.projectInfoModal.openModal();
    }
  }

  finishProject() {
    this.router.navigateByUrl('new-project');
  }

  makeDeleteRequest(id: number) {
    if (id) {
      var model = { projectId: id, userId: 0 };
      this.blockUI.start('Making project delete request...');
      this.projectService.makeProjectDeletionRequest(model).subscribe(
        data => {
          if (data) {
            this.router.navigateByUrl('projects');
          }
          this.blockUI.stop();
        }
      );
    }
  }

  goToHome() {
    localStorage.setItem('selected-projects', null);
    localStorage.setItem('active-project', '0');
    this.router.navigateByUrl('home');
  }



}
