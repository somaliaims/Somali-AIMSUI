import { Component, OnInit } from '@angular/core';
import { IATIService } from '../services/iati.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { StoreService } from '../services/store-service';
import { Settings } from '../config/settings';

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
  countriesList: any = [];
  iatiSettingsOld: any = { baseUrl: null, helpText: null, isActive: false, sourceType: 1 };
  iatiSettingsNew: any = { baseUrl: null, helpText: null, isActive: false, sourceType: 2 };
  permissions: any = {};
  isLoading: boolean = true;
  iatiSettingsType: any = {
    OLD: 1,
    NEW: 2
  };
  iatiSettingsTypesList: any = [
    {
      id: 1,
      text: 'Old'
    },
    {
      id: 2,
      text: 'New'
    }
  ];

  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  constructor(private iatiService: IATIService, private infoModal: InfoModalComponent,
    private errorModal: ErrorModalComponent,
    private securityService: SecurityHelperService,
    private router: Router, private storeService: StoreService) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canDoSMTPSettings) {
      this.router.navigateByUrl('home');
    }

    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getIATISettings();
  }

  getIATISettings() {
    this.iatiService.getIATISettingsList().subscribe(
      data => {
        if (data) {
          var settings = data.filter(s => s.sourceType == this.iatiSettingsType.OLD);
          if (settings.length > 0) {
            this.iatiSettingsOld = settings[0];
          }

          var settingsNew = data.filter(s => s.sourceType == this.iatiSettingsType.NEW);
          if (settingsNew.length > 0) {
            this.iatiSettingsNew = settingsNew[0];
          }
        }
      }
    );
  }

  saveIATISettings(sourceType) {
    var model = {};
    if (sourceType == this.iatiSettingsType.OLD) {
      model = this.iatiSettingsOld;
    } else if (sourceType == this.iatiSettingsType.NEW) {
      model = this.iatiSettingsNew;
    }

    this.blockUI.start('Saving IATI Settings');
    this.iatiService.setIATISettings(model).subscribe(
      data => {
        if (data) {
          if (data.success) {
            if (data.returnedId == 1) {
              this.infoMessage = 'IATI Settings' + Messages.SAVED_SUCCESSFULLY;
              this.infoModal.openModal();
            } else {
              
            }
            
          } else {
            this.errorMessage = 'An error occurred: ' + data.message;
            this.errorModal.openModal();
          }
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.errorMessage = 'An error occurred: ' + error;
        this.errorModal.openModal();
      }
    )
  }

  toggleActive(sourceType) {
    if (sourceType == this.iatiSettingsType.OLD) {
      this.iatiSettingsOld.isActive = !this.iatiSettingsOld.isActive;
      this.iatiSettingsNew.isActive = !this.iatiSettingsOld.isActive;
    } else if (sourceType == this.iatiSettingsType.NEW) {
      this.iatiSettingsNew.isActive = !this.iatiSettingsNew.isActive;
      this.iatiSettingsOld.isActive = !this.iatiSettingsNew.isActive;
    }
  }

}
