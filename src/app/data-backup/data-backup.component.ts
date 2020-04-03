import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StoreService } from '../services/store-service';
import { DatabackupService } from '../services/databackup.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { Messages } from '../config/messages';
import { SecurityHelperService } from '../services/security-helper.service';
import { Router } from '@angular/router';
import { Settings } from '../config/settings';
import { UrlHelperService } from '../services/url-helper-service';

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
  selectedBackupFileName: string = null;
  backupTakenOn: string = null;
  areFilesLoading: boolean = false;
  backupFiles: any = [];
  permissions: any = {};

  displayTabs: any = [
    { visible: true, identity: 'backup' },
    { visible: false, identity: 'restore' },
    { visible: false, identity: 'restore_confirmation' },
    { visible: false, identity: 'delete_confirmation' }
  ];

  tabConstants: any = {
    BACKUP: 'backup',
    RESTORE: 'restore',
    DELETE_CONFIRMATION: 'delete_confirmation',
    RESTORE_CONFIRMATION: 'restore_confirmation'
  };

  @BlockUI() blockUI: NgBlockUI;
  
  constructor(private storeService: StoreService, private backupService: DatabackupService,
    private infoModal: InfoModalComponent, private errorModal: ErrorModalComponent,
    private securityService: SecurityHelperService, private router: Router,
    private urlService: UrlHelperService) {

    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canTakeBackup) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
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
    this.getBackupFilesList();
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
    this.areFilesLoading = true;
    this.backupService.getBackupFiles().subscribe(
      data => {
        if (data) {
          this.backupFiles = data;
        }
        this.areFilesLoading = false;
      }
    );
  }

  formatDate(dated) {
    var date = new Date(dated);
    return date.toLocaleString('en-US');
  }

  setRestoreRequest(id: number) {
    if (id) {
      var backup = this.backupFiles.filter(b => b.id == id);
      if (backup.length > 0) {
        this.selectedBackupFileName = backup[0].backupFileName;
        this.backupTakenOn = backup[0].takenOn;
        this.manageTabsDisplay(this.tabConstants.RESTORE_CONFIRMATION);
      }
    }
  }

  performRestore() {
    if (this.selectedBackupFileName) {
      var model = {
        fileName: this.selectedBackupFileName
      };

      this.blockUI.start('Wait restoring database...');
      this.backupService.performRestore(model).subscribe(
        data => {
          if (data) {
            this.infoMessage = Messages.DATA_RESTORE_MESSAGE;
            this.infoModal.openModal();
            this.manageTabsDisplay(this.tabConstants.RESTORE);
            this.selectedBackupFileName = null;
          }
          this.blockUI.stop();
        }
      );
    }
  }

  setDeleteRequest(id: number) {
    if (id) {
      var backup = this.backupFiles.filter(b => b.id == id);
      if (backup.length > 0) {
        this.selectedBackupFileName = backup[0].backupFileName;
        this.backupTakenOn = backup[0].takenOn;
        this.manageTabsDisplay(this.tabConstants.DELETE_CONFIRMATION);
      }
    } else {
      this.selectedBackupFileName = null;
    }
  }

  deleteBackup() {
    if (this.selectedBackupFileName) {
      var model = {
        fileName: this.selectedBackupFileName
      };

      this.blockUI.start('Deleting backup...');
      this.backupService.deleteBackup(model).subscribe(
        data => {
          if (data) {
            this.backupFiles = this.backupFiles.filter(b => b.backupFileName != model.fileName);
            this.selectedBackupFileName = null;
            this.manageTabsDisplay(this.tabConstants.RESTORE);
          }
          this.blockUI.stop();
        }
      );
    }
  }

  cancelRequest() {
    this.selectedBackupFileName = null;
    this.manageTabsDisplay(this.tabConstants.RESTORE);
  }

  cancelDelete() {
    this.selectedBackupFileName = null;
    this.manageTabsDisplay(this.tabConstants.RESTORE);
  }

  setCurrentDate() {
    this.currentDate = this.storeService.getLongDateString(new Date());
  }

  setBackupFileUrl(fileName: string) {
    if (fileName) {
      return (this.urlService.getDataBackupFilesDownloadUrl() + fileName);
    }
    return fileName;
  }

  checkLink(e) {
    e.preventDefault();
    return false;
  }

}
