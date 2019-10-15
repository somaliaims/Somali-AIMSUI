import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  pageHeight: number = Settings.pdfPrintPageHeight;
  constructor(private httpClient: HttpClient, private urlHelper: UrlHelperService, 
    private storeService: StoreService) { }


    getSectorProjectsReport(sectorsIds: any = [], year: any = 0) {
      var model = {
        year: year,
        sectorIds: sectorsIds
      };
      var url = this.urlHelper.getSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects By Ids')));
    }

    getBudgetReport() {
      var url = this.urlHelper.getBudgetReportUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Budget Report')));
    }

    getBudgetSummaryReport() {
      var url = this.urlHelper.getBudgetSummaryReportUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Budget Report')));
    }

    getReportNames() {
      var url = this.urlHelper.getReportNamesUrl();
      return this.httpClient.get(url, httpOptions).pipe(
        catchError(this.storeService.handleError<any>('Report Names')));
    }

    getSectorWiseProjectsReport(model: any) {
      var url = this.urlHelper.getSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Sectors')));
    }

    getEnvelopeReport(model: any) {
      var url = this.urlHelper.getEnvelopeReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Envelope Report')));
    }

    getLocationWiseProjectsReport(model: any) {
      var url = this.urlHelper.getLocationProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Sectors')));
    }

    getYearlyProjectsReport(model: any) {
      var url = this.urlHelper.getYearlyProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report by Years')));
    }

    generatePDF(reportElement) {
      var quotes = document.getElementById(reportElement);
      var result  = html2canvas(quotes)
        .then((canvas) => {
          //! MAKE YOUR PDF
          var pdf = new jsPDF('p', 'pt', 'letter');
          var container = document.querySelector(".row");
          var docWidth = container.getBoundingClientRect().width;
          for (var i = 0; i <= quotes.clientHeight / this.pageHeight; i++) {
            //! This is all just html2canvas stuff
            var srcImg = canvas;
            var sX = 0;
            var sY = this.pageHeight * i; // start this.pageHeight pixels down for every new page
            var sWidth = docWidth;
            var sHeight = this.pageHeight;
            var dX = 0;
            var dY = 0;
            var dWidth = docWidth;
            var dHeight = this.pageHeight;
  
            var onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', docWidth.toString());
            onePageCanvas.setAttribute('height', this.pageHeight.toString());
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
  
            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
            var width = onePageCanvas.width;
            var height = onePageCanvas.clientHeight;
            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
              pdf.addPage([612, 791]); //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i + 1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .44), (height * .62));
          }
          //! after the for loop is finished running, we save the pdf.
          pdf.save('Report.pdf');
        });
        return result;
    }
}