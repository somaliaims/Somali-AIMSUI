import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.css']
})
export class ProjectEntryComponent implements OnInit {
  requestNo: number = 0;
  isError: boolean = false;
  errorMessage: string = '';
  selectedProjects: any = [];
  constructor(private storeService: StoreService) { }

  ngOnInit() {
    var projects = localStorage.getItem('selected-projects');
    if (projects)
    {
      var parsedProjects = JSON.parse(projects);
      this.selectedProjects = parsedProjects;
    }

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });
    
    /*this.storeService.currentDataProjects.subscribe(data => {
      this.selectedProjects = data;
    });*/
  }

}
