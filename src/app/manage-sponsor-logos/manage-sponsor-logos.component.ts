import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SponsorLogoService } from '../services/sponsor-logo.service';

@Component({
  selector: 'app-manage-sponsor-logos',
  templateUrl: './manage-sponsor-logos.component.html',
  styleUrls: ['./manage-sponsor-logos.component.css']
})
export class ManageSponsorLogosComponent implements OnInit {

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;

  constructor(private sponsorService: SponsorLogoService) { }

  ngOnInit(): void {
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  saveSponsor() {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.sponsorService.uploadAndSaveLogo(this.currentFile, null).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });

    this.selectedFiles = undefined;
  }

}
