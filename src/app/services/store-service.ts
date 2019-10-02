import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';
import { RequestModel } from '../models/request-model';
import { Settings } from '../config/settings';
import * as urlsList from "../config/urls";

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  private monthNames: any = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  private requestNumber: number = 0;
  private yearGap: number = 100;
  private messageSource = new BehaviorSubject<RegistrationModel>(null);
  currentRegistration = this.messageSource.asObservable();

  private infoMessage = new BehaviorSubject<string>('');
  currentInfoMessage = this.infoMessage.asObservable();

  private requestTrack = new BehaviorSubject<RequestModel>(null);
  currentRequestTrack = this.requestTrack.asObservable();

  private dataProjects = new BehaviorSubject<any>(null);
  currentDataProjects = this.dataProjects.asObservable();

  constructor() { }

  newRequestTrack(track: RequestModel) {
    this.requestTrack.next(track);
  }

  newRegistration(model: RegistrationModel) {
    this.messageSource.next(model);
  }

  newInfoMessage(message: string) {
    this.infoMessage.next(message);
  }

  newRequestNumber(requestNo: number) {
    this.requestNumber = requestNo;
  }

  newDataProjects(dataProjects: any) {
    this.dataProjects.next(dataProjects);
  }

  getNewRequestNumber() {
    return (++this.requestNumber);
  }

  getCurrentRequestId() {
    return this.requestNumber;
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      var currentRequestNo = this.getCurrentRequestId();
      var model = new RequestModel(currentRequestNo, error.status, '');

      var errorMessage = '';
      if (error.error) {
        errorMessage = error.error;
      } else {
        if (error.message || error.statusText) {
          errorMessage = error.message || error.statusText;
        } else {
          errorMessage = 'Something went wrong';
        }
      }
      model.errorMessage = errorMessage;
      model.errorStatus = error.status;
      this.newRequestTrack(model);
      return of(result as T);
    };
  }

  printReport(divId, title) {
    var content = document.getElementById(divId).innerHTML;
    let canvas = document.getElementById('chart') as HTMLCanvasElement;
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" type=\"text/css\" />");
    mywindow.document.write('<style>@page { size: auto;  margin: 10mm; }</style></head><body onload="window.print();window.close()">');
    mywindow.document.write("<img style='display: block;margin-left: auto;margin-right: auto;' src='" + canvas.toDataURL() + "'/>");
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus()
    return true;
  }

  printSimpleReport(divId, title) {
    var content = document.getElementById(divId).innerHTML;
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" type=\"text/css\" />");
    mywindow.document.write('<style>@page { size: auto;  margin: 10mm; }</style></head><body onload="window.print();window.close()">');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    return true;
  }

  sumValues(prev, next){
    return parseInt(prev) + parseInt(next);
  }

  getCalendarUpperLimit() {
    var dated = new Date();
    var proposedYear = dated.getFullYear() + this.yearGap;
    var calendarMaxLimit = { year: proposedYear, month: 12, day: 31};
    return calendarMaxLimit;
  }

  getCalendarLowerLimit() {
  }

  storeExchangeRates(rates) {
    localStorage.setItem('ratesList', rates);
  }

  getCachedRatesList() {
    return localStorage.getItem('ratesList');
  }

  clearExchangeRates() {
    localStorage.removeItem('ratesList');
  }

  parseJson(jsonStr: any) {
    if (jsonStr && jsonStr.length > 0) {
      var parsedJson = null
      try {
        parsedJson = (JSON.parse(jsonStr));
      } catch (e) {
        parsedJson = jsonStr;
      }
    }
    return parsedJson;
  }

  parseAndDisplayJsonAsString(json: any) {
    if (json && json.length > 0) {
      var parsedJson = null
      var valuesString = '';

      try {
        parsedJson = (JSON.parse(json));
      } catch (e) {
        parsedJson = json;
      }

      if (parsedJson && parsedJson.length > 0) {
        parsedJson.forEach(function (f) {
          if (valuesString) {
            valuesString += ', ' + f.value;
          } else {
            valuesString += f.value;
          }
        });
      }
      return valuesString;
    }
    return json;
  }

  getLongDateString(dated: any) {
    var validDate = Date.parse(dated);
    if (!isNaN(validDate)) {
      return new Date(dated).toLocaleDateString('en-GB', {  
        day : '2-digit',
        month : 'short',
        year : 'numeric'
      });
    }
    return 'N/a';
  }

  formatDateInUkStyle(year: number, month: number, day: number) {
    month = (month - 1);
    var date = new Date(year, month, day);
    return date.toLocaleDateString("en-GB", { 
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  dateOrdinal(d) {
    return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th")
  };

  getCurrentDateSQLFormat() {
    var dated = new Date();
    return (dated.getFullYear() + '-' + (dated.getMonth() + 1) + '-' + dated.getDate());
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  getTodaysDateForDtPicker() {
    var dated = new Date();
    return { year: dated.getFullYear(), month: (dated.getMonth() + 1), day: dated.getDate() };
  }

  getExcelFilesUrl() {
    return (urlsList.urls.excelFilesUrl);
  }

  isDateValid(dated: any) {
    var formattedDate = null;
    if (dated.year && dated.month && dated.day) {
      formattedDate = dated.year + '-' + dated.month + '-' + dated.day;
    } else {
      formattedDate = dated;
    }
    var timestamp = Date.parse(formattedDate);
    return (isNaN(timestamp) == false); 
  }

  getNumberWithCommas(value: number) {
    return value.toLocaleString();
  }
  
}