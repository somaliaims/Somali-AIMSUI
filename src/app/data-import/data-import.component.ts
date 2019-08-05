import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../services/fileupload.service';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.css']
})
export class DataImportComponent implements OnInit {
  progressOld: number = 0;
  messageOld: string = null;
  progressNew: number = 0;
  messageNew: string = null;
  isError: boolean = false;
  isInfo: boolean = false;
  @Output() public onUploadFinished = new EventEmitter();
 
  constructor(private httpClient: HttpClient, private fileUploadService: FileUploadService) { }
 
  ngOnInit() {
  }
 
  uploadFileOld(files){
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.fileUploadService.uploadOldExcelFile(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progressOld = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.messageOld = 'File uploaded successfully';
        this.onUploadFinished.emit(event.body);
      }
    });
  }

  uploadFileNew(files){
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.fileUploadService.uploadNewExcelFile(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progressNew = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response) {
        this.messageNew = 'File uploaded successfully';
        this.onUploadFinished.emit(event.body);
      }
    });
  }

}
