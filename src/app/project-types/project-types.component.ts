import { Component, OnInit } from '@angular/core';
import { ProjectTypeService } from '../services/project-types.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

@Component({
  selector: 'app-project-types',
  templateUrl: './project-types.component.html',
  styleUrls: ['./project-types.component.css']
})
export class ProjectTypesComponent implements OnInit {

  projectTypesList: any = null;
  criteria: string = null;
  isLoading: boolean = true;
  infoMessage: string = null;
  showMessage: boolean = false;

  constructor(private projectTypeService: ProjectTypeService, private router: Router,
    private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.currentInfoMessage.subscribe(message => this.infoMessage = message);
    if (this.infoMessage !== null && this.infoMessage !== '') {
      this.showMessage = true;
    }
    setTimeout(() => {
      this.storeService.newInfoMessage('');
      this.showMessage = false;
    }, Settings.displayMessageTime);

    this.getProjectTypesList();
  }

  getProjectTypesList() {
    this.projectTypeService.getProjectTypesList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.projectTypesList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchProjectTypes() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.projectTypeService.filterProjectTypes(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.projectTypesList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.projectTypesList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-projecttype/' + id);
  }


}
