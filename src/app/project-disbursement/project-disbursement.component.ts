import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-project-disbursement',
  templateUrl: './project-disbursement.component.html',
  styleUrls: ['./project-disbursement.component.css']
})
export class ProjectDisbursementComponent implements OnInit {

  @Input()
  isBtnDisabled: boolean = false;
  btnText: string = 'Add Project Disbursement';
  errorMessage: string = '';
  disbursements: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  yearsList: any = [];
  endingYearsList: any = [];

  monthsList: any = [
    {key: 'January', value: 1},
    {key: 'February', value: 2},
    {key: 'March', value: 3},
    {key: 'April', value: 4},
    {key: 'May', value: 5},
    {key: 'June', value: 6},
    {key: 'July', value: 7},
    {key: 'August', value: 8},
    {key: 'September', value: 9},
    {key: 'October', value: 10},
    {key: 'November', value: 11},
    {key: 'December', value: 12}
  ];
    
  model = { projectId: 0, disbursementId: null, startingYear: null, startingMonth: null,
    endingYear: null, endingMonth: null,  percentage: null };

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Add Project Disbursement';
        this.model.projectId = id;
        this.loadDisbursements(id);
      } else {
        this.router.navigateByUrl('/');
      }
    }

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var lowerLimit = currentYear - 20;
    var upperLimit = currentYear + 10;

    for(var y=currentYear; y >= lowerLimit; y--) {
      this.yearsList.push(y);
    }

    lowerLimit = currentYear - 5;
    for(var y=lowerLimit; y <= upperLimit; y++) {
      this.endingYearsList.push(y);
    }
    
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
  }

  loadDisbursements(id: string) {
    this.projectService.getProjectDisbursements(id).subscribe(
      data => {
        this.disbursements = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveProjectDisbursement() {
    var model = {
      ProjectId: this.model.projectId,
      DisbursementId: this.model.disbursementId,
      Percentage: this.model.percentage,
      StartingYear: this.model.startingYear,
      StartingMonth: this.model.startingMonth,
      EndingYear: this.model.endingYear,
      EndingMonth: this.model.endingMonth
    };

    this.isBtnDisabled = true;
      this.btnText = 'Saving...';
      this.projectService.addProjectDisbursement(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project disbursement ' + Messages.NEW_RECORD;
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
    this.btnText = 'Add Project Disbursement';
  }

}
