import { Component, OnInit } from '@angular/core';
import { IATIService } from '../services/iati.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-iati-settings',
  templateUrl: './iati-settings.component.html',
  styleUrls: ['./iati-settings.component.css']
})
export class IatiSettingsComponent implements OnInit {

  btnText: string = 'Save IATI Settings';
  errorMessage: string = null;
  requestNo: number = 0;
  isError: boolean = false;
  infoMessage: string = null;
  model = { baseUrl: null };
  
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private iatiService: IATIService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent) { }

  ngOnInit() {
    this.getIATISettings();
  }

  getIATISettings() {
    this.iatiService.getIATISettings().subscribe(
      data => {
        this.model.baseUrl = data.baseUrl;
      }
    )
  }

  saveIATISettings() {
    if (this.model.baseUrl == null) {
      this.errorMessage = Messages.INVALID_INPUT;
      this.errorModal.openModal();
      return false;
    }

    this.blockUI.start('Saving IATI Settings');
    this.iatiService.setIATISettings(this.model).subscribe(
      data => {
        this.infoMessage = 'IATI Settings' + Messages.SAVED_SUCCESSFULLY;
        this.blockUI.stop();
        this.infoModal.openModal();
      },
      error => {
        this.blockUI.stop();
        this.errorMessage = 'An error occurred: ' + error;
        this.errorModal.openModal();
      }
    )
  }

}
