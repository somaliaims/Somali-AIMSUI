import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { StoreService } from 'src/app/services/store-service';
import { Settings } from 'src/app/config/settings';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';

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
  requestNo: number = 0;
  errorMessage: string = null;
  btnReportText: string = 'Request report';
  model: any = { startingYear: null, endingYear: null };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private yearsService: FinancialYearService, private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.storeService.newReportItem(Settings.dropDownMenus.reports);
    this.getFinancialYears();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
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
