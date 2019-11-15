import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { DatabackupService } from '../services/databackup.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';

@Component({
  selector: 'app-data-backup',
  templateUrl: './data-backup.component.html',
  styleUrls: ['./data-backup.component.css']
})
export class DataBackupComponent implements OnInit {
  currentTab: string = null;
  infoMessage: string = null;
  errorMessage: string = null;
  currentDate: string = null;
  backupFiles: any = [];

  displayTabs: any = [
    { visible: true, identity: 'backup' },
    { visible: false, identity: 'restore' },
  ];

  tabConstants: any = {
    BACKUP: 'backup',
    RESTORE: 'restore',
  };

  @BlockUI() blockUI: NgBlockUI;
  constructor(private storeService: StoreService, private backupService: DatabackupService,
    private infoModal: InfoModalComponent, private errorModal: ErrorModalComponent) {

    this.currentTab = this.tabConstants.BACKUP;
    this.setCurrentDate();
  }

  ngOnInit() {
  }

  showBackupTab() {
    this.manageTabsDisplay(this.tabConstants.BACKUP)
  }

  showRestoreTab() {
    this.manageTabsDisplay(this.tabConstants.RESTORE);
  }

  manageTabsDisplay(tabIdentity) {
    for (var i = 0; i < this.displayTabs.length; i++) {
      var tab = this.displayTabs[i];
      if (tab.identity == tabIdentity) {
        tab.visible = true;
        this.currentTab = tabIdentity;
      } else {
        tab.visible = false;
      }
    }
  }

  takeDataBackup() {
    this.blockUI.start('Wait taking backup...');
    this.backupService.performBackup().subscribe(
      data => {
        if (data) {
          this.infoMessage = Messages.DATA_BACKUP_MESSAGE;
          this.infoModal.openModal();
        }
        this.blockUI.stop();
      }
    );
  }

  getBackupFilesList() {
    this.backupService.getBackupFiles().subscribe(
      data => {
        this.backupFiles = data;
      }
    );
  }

  setCurrentDate() {
    this.currentDate = this.storeService.getLongDateString(new Date());
  }

}
