import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { StoreService } from 'src/app/services/store-service';
import { Settings } from 'src/app/config/settings';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-all-projects-report',
  templateUrl: './all-projects-report.component.html',
  styleUrls: ['./all-projects-report.component.css']
})
export class AllProjectsReportComponent implements OnInit {
  isProcessing: boolean = false;
  isLoading: boolean = true;
  excelFile: string = null;
  financialYears: any = [];
  btnReportText: string = 'Request report';
  model: any = { startingYear: null, endingYear: null };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private yearsService: FinancialYearService) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.getFinancialYears();
  }

  getFinancialYears() {
    this.yearsService.getYearsList().subscribe(
      data => {
        if (data) {
          this.financialYears = data;
        }
        this.isLoading = false;
      }
    );
  }

  getAllProjectsReport() {
    this.model.startingYear = (this.model.startingYear == null) ? 0 : this.model.startingYear;
    this.model.endingYear = (this.model.endingYear == null) ? 0 : this.model.endingYear;
    this.blockUI.start('Loading report...');
    this.reportService.getAllProjectsReport(this.model).subscribe(
      data => {
        if (data) {
          if (data.message) {
            this.excelFile = data.message;
            this.setExcelFile();
          }
        }
        this.btnReportText = 'Update report';
        this.blockUI.stop();
      }
    );
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.storeService.getExcelFilesUrl() + this.excelFile;
    }
  }

}
