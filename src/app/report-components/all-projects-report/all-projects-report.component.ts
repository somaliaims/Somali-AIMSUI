import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { StoreService } from 'src/app/services/store-service';
import { Settings } from 'src/app/config/settings';
import { FinancialYearService } from 'src/app/services/financial-year.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorModalComponent } from 'src/app/error-modal/error-modal.component';
import { UrlHelperService } from 'src/app/services/url-helper-service';

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
  isAnyFilterSet: boolean = false;
  errorMessage: string = null;
  btnReportText: string = 'Generate export';
  model: any = { startingYear: 0, endingYear: 0 };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private reportService: ReportService, private storeService: StoreService,
    private yearsService: FinancialYearService, private errorModal: ErrorModalComponent,
    private urlService: UrlHelperService) { }

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
    this.excelFile = null;
    this.reportService.getAllProjectsReport(this.model).subscribe(
      data => {
        if (data) {
          if (data.message) {
            this.excelFile = data.message;
            this.setExcelFile();
          }
        }
        this.blockUI.stop();
      }
    );
  }

  setExcelFile() {
    if (this.excelFile) {
      this.excelFile = this.urlService.getExcelFilesUrl() + this.excelFile;
    }
  }

  onChangeStartYear() {
    this.manageResetDisplay();
  }

  onChangeEndYear() {
    this.manageResetDisplay();
  }

  manageResetDisplay() {
    if (this.model.startingYear == 0 && this.model.endingYear == 0) {
        this.isAnyFilterSet = false;
      } else {
        this.isAnyFilterSet = true;
      }
  }

  setFilter() {
    this.isAnyFilterSet = true;
  }

  resetFilters() {
    this.model.startingYear = 0;
    this.model.endingYear = 0;
  }

}
