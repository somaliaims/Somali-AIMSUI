import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';
import { RequestModel } from '../models/request-model';
import * as urlsList from "../config/urls";
import { ActiveMenuModel } from '../models/active-menu-model';

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

  private reportMenu = new BehaviorSubject<number>(0);
  currentReportItem = this.reportMenu.asObservable();

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

  newReportItem(menuCode: number) {
    this.reportMenu.next(menuCode);
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
      if (error.status == 401) {
        errorMessage = 'You are unauthorized to perform this action. In case if your are a valid registered user, please logout and login again';
      } else {
        if (error && error.statusText) {
          if (error.statusText.toLowerCase() == 'bad request') {
            if(error.error && error.error.errors) {
              var errorObject = error.error.errors;
              var key = (Object.keys(error.error.errors)[0]);
              errorMessage = errorObject[key];
            } else {
              errorMessage = error.error;
            }
          } else if (error.statusText == 'Unknown Error') {
            errorMessage = 'Unkown Error: Something went wrong. Make sure your Internet connection ' + 
            'is working. In any other case contact AIMS Administrator.';
          } else {
            errorMessage = error.statusText;
          }
        } else {
          if (error.message || error.statusText) {
            errorMessage = error.message || error.statusText;
          } else {
            errorMessage = 'Something went wrong';
          }
        }
      }
      
      model.errorMessage = errorMessage;
      model.errorStatus = error.status;
      this.newRequestTrack(model);
      return of(result as T);
    };
  }

  printReport(divId, title, currency) {
    var content = document.getElementById(divId).innerHTML;
    let canvas = document.getElementById('chart') as HTMLCanvasElement;
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" type=\"text/css\" />");
    mywindow.document.write('<style>@page { size: auto;  margin: 10mm; }</style></head><body onload="window.print();window.close()">');
    mywindow.document.write('<div class="col-md-12 text-center" style="margin-top: 10px"><h5>' + title + '<small>' + currency + '</small></h5></div>');
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
    mywindow.document.write('<html><head><title>' + title + '</title>');
    mywindow.document.write("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\" type=\"text/css\" />");
    mywindow.document.write('<style>@page { size: auto;  margin: 10mm; }</style></head><body onload="window.print();window.close()">');
    mywindow.document.write(content);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    return true;
  }

  sumValues(prev, next){
    return (parseFloat(prev) + parseFloat(next)).toFixed(2);
  }

  sortArrayByProperty(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
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
      var valuesString = '';
      var parsedJson = null;
      try {
        parsedJson = eval(json);
      } catch (e) {
        return json;
      }

      if(parsedJson[0].id) {
        parsedJson.forEach(function (f) {
          if (valuesString) {
            valuesString += ', ' + f.value;
          } else {
            valuesString += f.value;
          }
        });
        return valuesString;
      }
      return json;
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

  getLongDateAndTime() {
    return new Date().toLocaleString();
  }

  dateOrdinal(d) {
    return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th")
  };

  getCurrentDateSQLFormat() {
    var dated = new Date();
    var monthVal = dated.getMonth() + 1;
    var dateVal = dated.getDate();
    var month = (monthVal < 10) ? ('0' + monthVal) : monthVal;
    var day = (dateVal < 10) ? ('0' + dateVal) : dateVal; 
    return (dated.getFullYear() + '-' + month + '-' + day);
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

  getBackupFileUrl() {
    return (urlsList.urls.dataBackupFilesUrl);
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
    if (!value) {
      return value;
    }
    if (!isNaN(value) && value > 0) {
      value = Math.round(value);
    } else {
      return value;
    }
    return value.toLocaleString();
  }

  convertDateToYMDBySlash(date: string) {
    if (date) {
      //return new Date(date).toISOString().split('T')[0];
      var timestamp = Date.parse(date);
      if (isNaN(timestamp) == false) {
        var dateParts = date.split('/');
        if (parseInt(dateParts[0]) < 10) {
          dateParts[0] =  '0' + dateParts[0];
        }

        if (parseInt(dateParts[1]) < 10) {
          dateParts[1] =  '0' + dateParts[1];
        }
        return (dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1]);
      }
    }
    return date;
  }

  convertToDateInputFormat(date: string) {
    if (date) {
      //return new Date(date).toISOString().split('T')[0];
      var timestamp = Date.parse(date);
      if (isNaN(timestamp) == false) {
        var dateParts = date.split('/');

        if (parseInt(dateParts[0]) < 10) {
          dateParts[0] =  '0' + dateParts[0];
        }

        if (parseInt(dateParts[1]) < 10) {
          dateParts[1] =  '0' + dateParts[1];
        }
        return (dateParts[2] + '-' + dateParts[0] + '-' + dateParts[1]);
      }
    }
    return date;
  }

  convertDateToMDYWithSlash(date: string) {
    if (date) {
      //return new Date(date).toISOString().split('T')[0];
      var timestamp = Date.parse(date);
      if (isNaN(timestamp) == false) {
        var dateParts = date.split('/');
        return (dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
      }
    }
    return date;
  }

  isLeapYear(year: number) {
    return !((year % 4) && (year % 100) || !(year % 400));
  }

  isCurrentlyLeapYear() {
    var dated = new Date();
    var year = dated.getFullYear();
    return !((year % 4) && (year % 100) || !(year % 400));
  }

  
}