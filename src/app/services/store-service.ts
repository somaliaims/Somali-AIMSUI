import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RegistrationModel } from '../models/registration';
import { RequestModel } from '../models/request-model';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  private requestNumber: number = 0;
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

  getCurrencyList() {
    return Settings.currencies;
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
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
    mywindow.document.write("<div class=\"col-md-6\"><img src='" + canvas.toDataURL() + "'/></div>");
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus()
    //mywindow.print();
    //mywindow.close();
    return true;
  }

  sumValues(prev, next){
    return parseInt(prev) + parseInt(next);
  }

}