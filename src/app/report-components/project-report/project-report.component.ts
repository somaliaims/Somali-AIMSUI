import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from 'src/app/services/store-service';
import { SectorService } from 'src/app/services/sector.service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { OrganizationService } from 'src/app/services/organization-service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  sectorsSettings: any = [];
  selectedSectors: any = []; 
  selectedOrganizations: any = [];
  selectedLocations: any = [];
  organizationsSettings: any = [];
  locationsSettings: any = [];
  yearsList: any = [];
  sectorsList: any = [];
  organizationsList: any = [];
  locationsList: any = [];

  reportDataList: any = [];
  dropdownSettings: any = {};
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  barChartLabels:string[] = [];
  barChartType:string = 'bar';
  barChartLegend:boolean = true;
  barChartData:any[] = [
  ];
  model: any = { title: '', organizationIds: [], startingYear: 0, endingYear: 0, 
  sectorIds: [], locationIds: [], selectedSectors: [], selectedOrganizations: [],
  selectedLocations: [], sectorsList: [], locationsList: [], organizationsList: [] };
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private reportService: ReportService, private storeService: StoreService,
    private sectorService: SectorService, private fyService: FinancialYearService,
    private organizationService: OrganizationService, private locationService: LocationService,
    ) { }

  ngOnInit() {
    
    this.getSectorsList();
    this.getLocationsList();
    this.getOrganizationsList();
    this.loadFinancialYears();

    this.sectorsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'sectorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.organizationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'organizationName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.locationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  /*getSectorProjectsReport() {
    this.barChartLabels = [];
    this.barChartData = [];
    this.blockUI.start('Wait loading...');
    this.reportService.getSectorProjectsReport(this.selectedSectors, this.reportModel.year).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = {data: sectorProjects, label: 'Sector Projects'};
          this.barChartData.push(chartData);
          this.barChartLabels = sectorNames;
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    );
  }*/

  searchProjectsByCriteriaReport() {
    this.barChartLabels = [];
    this.barChartData = [];
    var searchModel = {
      title: this.model.title,
      startingYear: this.model.startingYear,
      endingYear: this.model.endingYear,
      organizationIds: this.selectedOrganizations,
      sectorIds: this.selectedSectors,
      locationIds: this.selectedLocations
    };    

    this.blockUI.start('Searching Projects...');
    this.reportService.searchProjectsByCriteriaReport(searchModel).subscribe(
      data => {
        this.reportDataList = data;
        if (this.reportDataList && this.reportDataList.sectorProjectsList) {
          var sectorNames = this.reportDataList.sectorProjectsList.map(p => p.sectorName);
          var sectorProjects = this.reportDataList.sectorProjectsList.map(p => p.projects.length);
          var chartData = {data: sectorProjects, label: 'Sector Projects'};
          this.barChartData.push(chartData);
          this.barChartLabels = sectorNames;
        }
        this.blockUI.stop();
      },
      error => {
        console.log(error);
        this.blockUI.stop();
      }
    )
  }

  formatFunders(funders: any = null) {
    var fundersStr = '';
    if (funders && funders.length > 0) {
      var funderNames = funders.map(f => f.funder);
      fundersStr = funderNames.join(', ');
    }
    return fundersStr;
  }

  formatImplementers(implementers: any = null) {
    var implementersStr = '';
    if (implementers && implementers.length > 0) {
      var implementerNames = implementers.map(i => i.implementer);
      implementersStr = implementerNames.join(', ');
    }
    return implementersStr;
  }

  /*loadSectors() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.model.sectorsList = data;
        console.log(this.sectorsList);
      },
      error => {
        console.log(error);
      }
    )
  }*/

  loadFinancialYears() {
    this.fyService.getYearsList().subscribe(
      data => {
        this.yearsList = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  printReport() {
    this.storeService.printReport('rpt-sector-project', 'SectorWise Projects List');
  }

  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }

  getSectorsList() {
    this.sectorService.getSectorsList().subscribe(
      data => {
        this.sectorsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getLocationsList() {
    this.locationService.getLocationsList().subscribe(
      data => {
        this.locationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.organizationsList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  onSectorSelect(item: any) {
    var id = item.id;
    if (this.selectedSectors.indexOf(id) == -1) {
      this.selectedSectors.push(id);
    }
  }

  onSectorDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedSectors.indexOf(id);
    this.selectedSectors.splice(index, 1);
  }

  onSectorSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedSectors.indexOf(id) == -1) {
        this.selectedSectors.push(id);
      }
    }.bind(this))
  }

  onOrganizationSelect(item: any) {
    var id = item.id;
    if (this.selectedOrganizations.indexOf(id) == -1) {
      this.selectedOrganizations.push(id);
    }
  }

  onOrganizationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedOrganizations.indexOf(id);
    this.selectedOrganizations.splice(index, 1);
  }

  onOrganizationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedOrganizations.indexOf(id) == -1) {
        this.selectedOrganizations.push(id);
      }
    }.bind(this));
  }

  onLocationSelect(item: any) {
    var id = item.id;
    if (this.selectedLocations.indexOf(id) == -1) {
      this.selectedLocations.push(id);
    }
  }

  onLocationDeSelect(item: any) {
    var id = item.id;
    var index = this.selectedLocations.indexOf(id);
    this.selectedLocations.splice(index, 1);
  }

  onLocationSelectAll(items: any) {
    items.forEach(function (item) {
      var id = item.id;
      if (this.selectedLocations.indexOf(id) == -1) {
        this.selectedLocations.push(id);
      }
    }.bind(this));
  }

}
 