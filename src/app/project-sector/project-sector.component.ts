import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { StoreService } from '../services/store-service';
import { Messages } from '../config/messages';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Sector } from '../models/sector-model';
import { Observable } from 'rxjs';

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
  requestNo: number = 0;
  selectedSectorId: number = 0;
  isError: boolean = false;
  isLoading: boolean = false;
  model = { projectId: 0, sectorId: null, fundsPercentage: null };
  sectorSelectionForm: FormGroup;
  userInput = new FormControl();
  filteredSectors: Observable<Sector[]>;

  constructor(private fb: FormBuilder,private projectService: ProjectService, private route: ActivatedRoute,
    private router: Router, private sectorService: SectorService,
    private storeService: StoreService) {
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

    this.sectorSelectionForm = this.fb.group({
      userInput: null,
    });
  }

  private filterSectors(value: string): Sector[] {
    if (typeof value != "string") {
    } else {
      const filterValue = value.toLowerCase();
      return this.sectors.filter(sector => sector.sectorName.toLowerCase().indexOf(filterValue) !== -1);
    }
  }

  loadSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectors = data;
        this.filteredSectors = this.userInput.valueChanges
      .pipe(
        startWith(''),
        map(sector => sector ? this.filterSectors(sector) : this.sectors.slice())
      );
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

  displayFn(sector?: Sector): string | undefined {
    if (sector) {
      this.selectedSectorId = sector.id;
      console.log(this.selectedSectorId);
    }
    return sector ? sector.sectorName : undefined;
  }

  saveProjectSector() {
    if (this.selectedSectorId == 0) {
      return false;
    }

    this.model.sectorId = this.selectedSectorId;
    var model = {
      ProjectId: this.model.projectId,
      SectorId: this.model.sectorId,
      FundsPercentage: this.model.fundsPercentage,
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
