import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';
import { RequestModel } from '../models/request-model';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  private monthNames: any = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  private requestNumber: number = 0;
  private yearGap: number = 50;
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
        errorMessage = error.message || error.statusText;
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
    mywindow.document.write(content);
    mywindow.document.write("<img src='" + canvas.toDataURL() + "'/>");
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
        day : 'numeric',
        month : 'short',
        year : 'numeric'
      });
    }
    return 'Invalid date';
  }

  getCurrentDateSQLFormat() {
    var dated = new Date();
    return (dated.getFullYear() + '-' + (dated.getMonth() + 1) + '-' + dated.getDate());
  }
  
}