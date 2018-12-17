import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-project-sector',
  templateUrl: './project-sector.component.html',
  styleUrls: ['./project-sector.component.css']
})
export class ProjectSectorComponent implements OnInit {

  @Input()
  isBtnDisabled: boolean = false;
  btnText: string = 'Add Project';
  errorMessage: string = '';
  sectors: any = [];
  filteredSectors: any = [];
  requestNo: number = 0;
  isError: boolean = false;
  isLoading: boolean = false;
  model = { projectId: 0, sectorId: null };
  sectorForm: FormGroup;

  constructor(private fb: FormBuilder,private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private sectorService: SectorService,
    private storeService: StoreService, private modalService: NgxSmartModalService) {
  }

  ngOnInit() {
    if (this.route.snapshot.data) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Add Sector for Project';
        this.model.projectId = id;
        this.loadSectors();
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

    this.sectorForm = this.fb.group({
      userInput: null,
    });

    this.sectorForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.sectorService.searchSectors({ name: value }, 1)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(sectors => {
        this.filteredSectors = sectors;
      });
  }

  loadSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectors = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  saveProjectSector() {
    var sectorValue = this.sectorForm.get('userInput').value;
    if (!sectorValue) {
      this.modalService.getModal('info-modal').open();
      return false;
    }

    var model = {
      ProjectId: this.model.projectId,
      SectorId: this.model.sectorId,
    };

    this.isBtnDisabled = true;
      this.btnText = 'Saving...';
      this.projectService.addProjectSector(model).subscribe(
        data => {
          if (!this.isError) {
            var message = 'New project location ' + Messages.NEW_RECORD;
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
    this.btnText = 'Add Project Sector';
  }

}
