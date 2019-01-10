import { Component, OnInit } from '@angular/core';
import { SectorService } from 'src/app/services/sector.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  sectors: any = [];
  locations: any = [];

  constructor(private sectorService: SectorService, private locationService: LocationService) { }

  ngOnInit() {
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectors = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locations = data;
      },
      error => {
        console.log(error);
      }
    )
  }

}
