import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  requestNo: number = 0;
  errorMessage: string = '';
  isError: boolean = false;
  isLoading: boolean = true;
  isLocationLoading: boolean = true;
  isSectorLoading: boolean = true;
  isFunderLoading: boolean = true;
  isImplementorLoading: boolean = true;
  isDisbursementLoading: boolean = true;
  projectId: number = 0;
  delayTime: number = 2000;
  monthStrings: any = { 
    "1": "January", "2": "February", "3": "March", "4": "April", "5": "May", "6": "June",
    "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December" 
  }

  //project data variables
  projectData: any = [];
  projectLocations: any = [];
  projectSectors: any = [];
  projectFunders: any = [];
  projectImplementors: any = [];
  projectDisbursements: any = [];

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      this.projectId = id;
      if (id) {
        this.loadProjectData(id);   

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
          this.loadProjectImplementors(id);
        }, (this.delayTime + 3));

        setTimeout(() => {
          this.loadProjectDisbursements(id);
        }, (this.delayTime + 4));

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

  addProjectImplementor() {
    this.router.navigateByUrl('project-implementor/' + this.projectId);
  }

  addProjectDisbursement() {
    this.router.navigateByUrl('project-disbursement/' + this.projectId);
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

  loadProjectImplementors(id) {
    this.projectService.getProjectImplementors(id).subscribe(
      data => {
        this.hideImplementorLoader();
        this.projectImplementors = data;
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

  deleteProjectLocation(projectId, locationId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectLocation(projectId, locationId).subscribe(
      data => {
        this.projectLocations = this.projectLocations.filter(l => l.id != locationId);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectSector(projectId, sectorId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectSector(projectId, sectorId).subscribe(
      data => {
        this.projectSectors = this.projectSectors.filter(s => s.sectorId != sectorId);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
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

  deleteProjectImplementor(projectId, implementorId) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectImplementor(projectId, implementorId).subscribe(
      data => {
        this.projectImplementors = this.projectImplementors.filter(i => i.implementorId != implementorId);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  deleteProjectDisbursement(projectId, startingYear) {
    this.blockUI.start('Working...');
    this.projectService.deleteProjectDisbursement(projectId, startingYear).subscribe(
      data => {
        this.projectDisbursements = this.projectDisbursements.filter(d => d.projectId != projectId 
          && d.startingYear != startingYear);
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
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

  hideImplementorLoader() {
    this.isImplementorLoading = false;
  }

  hideDisbursementLoader() {
    this.isDisbursementLoading = false;
  }

}
