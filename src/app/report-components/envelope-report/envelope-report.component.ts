import { Component, OnInit } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization-service';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { EnvelopeTypeService } from 'src/app/services/envelope-type.service';
import { ReportService } from 'src/app/services/report.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { StoreService } from 'src/app/services/store-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-envelope-report',
  templateUrl: './envelope-report.component.html',
  styleUrls: ['./envelope-report.component.css']
})
export class EnvelopeReportComponent implements OnInit {

  organizationTypes: any = [];
  exchangeRates: any = [];
  organizations: any = [];
  filteredOrganizations: any = [];
  financialYears: any = [];
  envelopeTypes: any = [];
  envelopeList: any = [];
  envelopeYearsList: any = [];
  currenciesList: any = [];
  reportSettings: any = {};
  defaultCurrency: string = null;
  nationalCurrency: string = null;
  nationalCurrencyName: string = null;
  selectedCurrencyName: string = null;
  chartType: string = null;
  oldCurrency: any = null;
  manualExRate: number = 0;
  oldCurrencyRate: number = 0;
  cellPercent: number = 0;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        beginAtZero: true,
        ticks: {
          autoSkip: false
        }
      }],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'top',
    },
  }

  radarChartOptions: any = {
    responsive: true
  }
  chartColors: any = [
    {
      backgroundColor: [
        "#FF7360", "#6FC8CE", "#4cc6bb", "#fdd100", "#123ea9"
      ]
    }
  ];
  chartLables: any = [];
  doughnutChartLabels: any = [];
  barChartType: string = 'bar';
  chartLegend: boolean = true;
  chartData: any = [];
  doughnutChartData: any = [];

  model: any = { funderTypeId: 0, funderId: 0, startingYear: 0, endingYear: 0, envelopeTypeId: 0};

  chartOptions: any = [
    { id: 1, type: 'bar', title: 'Bar chart' },
    { id: 2, type: 'pie', title: 'Pie chart' },
    { id: 3, type: 'doughnut', title: 'Doughnut chart' },
    { id: 4, type: 'line', title: 'Line chart' },
    { id: 5, type: 'radar', title: 'Radar' },
    { id: 6, type: 'polarArea', title: 'Polar area' }
  ];

  chartTypes: any = {
    BAR: 'bar',
    PIE: 'pie',
    DOUGHNUT: 'doughnut',
    LINE: 'line',
    RADAR: 'radar',
    POLAR: 'polarArea'
  };
  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private organizationService: OrganizationService, 
    private financialYearService: FinancialYearService,
    private envelopeTypeService: EnvelopeTypeService, 
    private reportService: ReportService,
    private currencyService: CurrencyService,
    private storeService: StoreService) { }

  ngOnInit() {

    this.getDefaultCurrency();
    this.getNationalCurrency();
    this.getEnvelopeTypes();
    this.getOrganizationTypes();
    this.getOrganizations();
    this.getFinancialYears();
  }

  getEnvelopeReport() {
    this.blockUI.start('Loading report...');
    this.reportService.getEnvelopeReport(this.model).subscribe(
      data => {
        if (data) {
          this.reportSettings = data.reportSettings;
          this.envelopeList = data.envelope;
          this.envelopeYearsList = data.envelopeYears;
          this.cellPercent = (80 / this.envelopeYearsList.length);
        }
        this.blockUI.stop();
      }
    );
  }

  getOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
      }
    );
  }

  getOrganizations() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data) {
          this.organizations = data;
        }
      }
    );
  }

  getOrganizationsForType() {
    if (this.model.funderTypeId) {
      this.filteredOrganizations = this.organizations.filter(o => o.organizationTypeId == this.model.funderTypeId);
    } else {
      this.filteredOrganizations = [];
    }
  }

  getFinancialYears() {
    this.financialYearService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }
      }
    );
  }

  getEnvelopeTypes() {
    this.envelopeTypeService.getAllEnvelopeTypes().subscribe(
      data => {
        if (data) {
          this.envelopeTypes = data;
        }
      }
    );
  }

  getManualExchangeRateForToday() {
    var dated = this.storeService.getCurrentDateSQLFormat();
    var model = {
      dated: dated
    };
    this.currencyService.getAverageCurrencyForDate(model).subscribe(
      data => {
        if (data) {
          this.exchangeRates = data;
          var nationalCurrencyRate = this.exchangeRates.filter(c => c.currency == this.nationalCurrencyName);
          if (nationalCurrencyRate.length > 0) {
            this.manualExRate = nationalCurrencyRate[0].rate;
            this.oldCurrencyRate = 1;
          }
        }
      });
  }

  getDefaultCurrency() {
    this.currencyService.getDefaultCurrency().subscribe(
      data => {
        if (data) {
          this.defaultCurrency = data.currency;
          this.model.selectedCurrency = data.currency;
          this.oldCurrency = this.model.selectedCurrency;
          this.selectedCurrencyName = data.currencyName;
          this.currenciesList.push(data);
        }
      }
    );
  }

  getNationalCurrency() {
    this.currencyService.getNationalCurrency().subscribe(
      data => {
        if (data) {
          this.nationalCurrency = data;
          this.nationalCurrencyName = data.currency;
          this.currenciesList.push(data);
          this.getManualExchangeRateForToday();
        }
      }
    );
  }

  manageDataToDisplay() {

  }

}
