import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Settings } from '../config/settings';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SecurityHelperService } from '../services/security-helper.service';
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
  message: string = null;
  errorMessage: string = null;
  fileInfos: Observable<any>;
  permissions: any = {};
  isBtnDisabled: boolean = false;
  btnText: string = 'Save sponsor';

  model: any = { sponsorName: null, logo: null };
  constructor(private sponsorService: SponsorLogoService,
    private errorModal: ErrorModalComponent,
    private securityService: SecurityHelperService,
    private router: Router) { }

  ngOnInit(): void {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditSponsors) {
      this.router.navigateByUrl('home');
    }
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  saveSponsor() {
    if (this.selectedFiles == undefined) {
      this.errorMessage = 'Select the logo to upload';
      this.errorModal.openModal();
      return false;
    }

    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.sponsorService.uploadAndSaveLogo(this.currentFile, this.model.sponsorName).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }

        this.router.navigateByUrl('sponsors');
      },
      err => {
        this.progress = 0;
        this.errorMessage = 'Could not upload the file!';
        //this.currentFile = undefined;
        this.errorModal.openModal();
      });

    //this.selectedFiles = undefined;
  }

}
