import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UrlHelperService } from './url-helper-service';
import { catchError } from 'rxjs/operators';
import { StoreService } from './store-service';
import { httpOptions } from '../config/httpoptions';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  pageHeight: number = Settings.pdfPrintPageHeight;
  pageHeightLandscape: number = Settings.pdfPrintPageHeightLandscape;
  pageHeightLarge: number = Settings.pdfPrintPageHeightLarge;
  screenConstants: any = {
    TWENTY_FIVE_SIXTY: 2560,
    TWENTY_FOURTY_EIGHT: 2048,
    NINETEEN_TWENTY: 1920,
    SIXTEEN_EIGHTY: 1680,
    SIXTEEN_HUNDRED: 1600,
    FOURTEEN_FOURTY: 1440,
    THIRTEEN_SIXTY_SIX: 1366,
    TWELVE_EIGHTY: 1280,
    TEN_TWENTY_FOUR: 1024,
    EIGHT_HUNDRED: 800
  };
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

    getAllProjectsReport(model: any) {
      var url = this.urlHelper.getAllProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('All Projects Report')));
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

    getNoSectorProjectsReport(model: any) {
      var url = this.urlHelper.getNoSectorProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report for No Sectors')));
    }

    getNoLocationProjectsReport(model: any) {
      var url = this.urlHelper.getNoLocationProjectsReportUrl();
      return this.httpClient.post(url,
        JSON.stringify(model), httpOptions).pipe(
            catchError(this.storeService.handleError<any>('Projects Report for No Sectors')));
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

    /*generatePDF(reportElement) {
      var quotes = document.getElementById(reportElement);
      var result  = html2canvas(quotes)
        .then((canvas) => {
          var container = document.querySelector(".row");
          //var docWidth = container.getBoundingClientRect().width;
          var docWidth = container.clientWidth;
          var pageHeight = this.pageHeight;
          //! MAKE YOUR PDF
          var pdf = null;
          if (docWidth > 1920) {
            pdf = new jsPDF('l', 'pt', 'letter');
          } else {
            pdf = new jsPDF('p', 'pt', 'letter');
          }
          for (var i = 0; i <= quotes.clientHeight / pageHeight; i++) {
            //! This is all just html2canvas stuff
            var srcImg = canvas;
            var sX = 0;
            var sY = pageHeight * i; // start this.pageHeight pixels down for every new page
            var sWidth = docWidth;
            var sHeight = pageHeight;
            var dX = 0;
            var dY = 0;
            var dWidth = docWidth;
            var dHeight = pageHeight;
              
            var onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', docWidth.toString());
            onePageCanvas.setAttribute('height', this.pageHeight.toString());
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            //ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
  
            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
            var width = onePageCanvas.width;
            var height = onePageCanvas.height;
            //var height = onePageCanvas.clientHeight;
            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
              //var widthInPoints = parseInt((dWidth * .72).toString());
              //var heightInPoints = parseInt((dHeight * .72).toString());
              //pdf.addPage([widthInPoints, heightInPoints]);
              if (width > this.screenConstants.NINETEEN_TWENTY) {
                pdf.addPage([792, 612]);
              } else {
                pdf.addPage([612, 792]); //8.5" x 11" in pts (in*72)
              }
            }
            //! now we declare that we're working on that page
            pdf.setPage(i + 1);

            if (width > this.screenConstants.NINETEEN_TWENTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .30), (height * .35));
            } else if (width <= this.screenConstants.SIXTEEN_EIGHTY && width > this.screenConstants.SIXTEEN_HUNDRED) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .36), (height * .45));
            } else if (width <= this.screenConstants.SIXTEEN_HUNDRED && width > this.screenConstants.FOURTEEN_FOURTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .38), (height * .45));
            } else if (width <= this.screenConstants.FOURTEEN_FOURTY && width > this.screenConstants.THIRTEEN_SIXTY_SIX) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .42), (height * .45));
            } else if(width <= this.screenConstants.THIRTEEN_SIXTY_SIX && width > this.screenConstants.TWELVE_EIGHTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .44), (height * .45));
            } else if (width <= this.screenConstants.TWELVE_EIGHTY && width > this.screenConstants.TEN_TWENTY_FOUR) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .52), (height * .45));
            } else if (width <= this.screenConstants.TEN_TWENTY_FOUR && width > this.screenConstants.EIGHT_HUNDRED) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .60), (height * .45));
            } else {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .70), (height * .45));
            }
          }
          pdf.save('Report.pdf');
        });
        return result;
    }*/

    generatePDF(reportElement, yAxis: number = 0) {
      var quotes = document.getElementById(reportElement);
      var result  = html2canvas(quotes)
        .then((canvas) => {
          var container = document.querySelector(".row");
          var aspectRatio = window.devicePixelRatio;
          //var docWidth = container.getBoundingClientRect().width;
          var docWidth = (container.clientWidth * aspectRatio);
          var pageHeight = this.pageHeight;
          if (docWidth > this.screenConstants.NINETEEN_TWENTY) {
            pageHeight = this.pageHeightLandscape;
          }
          //! MAKE YOUR PDF
          var pdf = null;
          if (docWidth > this.screenConstants.NINETEEN_TWENTY) {
            pdf = new jsPDF('l', 'pt', 'a4');
          } else {
            pdf = new jsPDF('p', 'pt', 'a4');
          }

          var reportHeight = ((quotes.clientHeight * aspectRatio) / pageHeight);
          for (var i = 0; i <= reportHeight; i++) {
            //! This is all just html2canvas stuff
            var srcImg = canvas;
            var sX = 0;
            var sY = pageHeight * i; // start this.pageHeight pixels down for every new page
            var sWidth = docWidth;
            var sHeight = pageHeight;
            var dX = 0;
            var dY = 0;
            var dWidth = docWidth;
            var dHeight = pageHeight;

            if (yAxis > 0) {
              dY += yAxis;
            }
              
            var onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', docWidth.toString());
            onePageCanvas.setAttribute('height', this.pageHeight.toString());
            var ctx = onePageCanvas.getContext('2d');
            ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
  
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
            var width = onePageCanvas.width;
            var height = onePageCanvas.height;
            if (i > 0) {
              if (width > this.screenConstants.NINETEEN_TWENTY) {
                pdf.addPage([ 841.89, 595.28]);
              } else {
                pdf.addPage([ 595.28,  841.89]); 
              }
            }
            pdf.setPage(i + 1);
            if (width > this.screenConstants.TWENTY_FOURTY_EIGHT) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .33), (height * .36), undefined, 'FAST');
            } else if (width <= this.screenConstants.TWENTY_FOURTY_EIGHT && width > this.screenConstants.NINETEEN_TWENTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .40), (height * .35), undefined, 'FAST');
            } else if (width <= this.screenConstants.NINETEEN_TWENTY && width > this.screenConstants.SIXTEEN_EIGHTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .30), (height * .45), undefined, 'FAST');
            } else if (width <= this.screenConstants.SIXTEEN_EIGHTY && width > this.screenConstants.SIXTEEN_HUNDRED) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .35), (height * .45), undefined, 'FAST');
            } else if (width <= this.screenConstants.SIXTEEN_HUNDRED && width > this.screenConstants.FOURTEEN_FOURTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .36), (height * .45), undefined, 'FAST');
            } else if (width <= this.screenConstants.FOURTEEN_FOURTY && width > this.screenConstants.THIRTEEN_SIXTY_SIX) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .41), (height * .45), undefined, 'FAST');
            } else if(width <= this.screenConstants.THIRTEEN_SIXTY_SIX && width > this.screenConstants.TWELVE_EIGHTY) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .43), (height * .45), undefined, 'FAST');
            } else if (width <= this.screenConstants.TWELVE_EIGHTY && width > this.screenConstants.TEN_TWENTY_FOUR) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .47), (height * .45), undefined, 'FAST');
            } else if (width <= this.screenConstants.TEN_TWENTY_FOUR && width > this.screenConstants.EIGHT_HUNDRED) {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .59), (height * .45), undefined, 'FAST');
            } else {
              pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .70), (height * .45), undefined, 'FAST');
            }
          }
          pdf.save('Report.pdf');
        });
        return result;
    }

}