import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Settings } from '../config/settings';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { DocumentLinkService } from '../services/document-link.service';
import { SecurityHelperService } from '../services/security-helper.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'app-document-link',
  templateUrl: './document-link.component.html',
  styleUrls: ['./document-link.component.css']
})
export class DocumentLinkComponent implements OnInit {
  links: any = [];
  filteredLinks: any = [];
  isLoading: boolean = true;
  permissions: any = {};
  criteria: string = null;
  isError: boolean = false;
  errorMessage: string = null;
  requestNo: number = 0;
  pagingSize: number = Settings.rowsPerPage;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private documentService: DocumentLinkService,
    private securityService: SecurityHelperService,
    private router: Router,
    private storeService: StoreService,
    private errorModal: ErrorModalComponent) {
  }

  ngOnInit(): void {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getLinks();

    this.requestNo = this.storeService.getNewRequestNumber();
    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.errorModal.openModal();
      }
    });
  }

  getLinks() {
    this.documentService.getDocumentLinks().subscribe(
      data => {
        if (data) {
          this.links = data;
          this.filteredLinks = data;
        }
        this.isLoading = false;
      }
    );
  }

  searchLinks() {
    if (!this.criteria) {
      this.filteredLinks = this.links;
    }
    else {
        var criteria = this.criteria.toLowerCase();
        this.filteredLinks = this.links.filter(d => (d.title.toLowerCase().indexOf(criteria) != -1));
    }
  }

  deleteLink(id: number) {
    if (id) {
      this.blockUI.start('Deleting link...');
      this.documentService.deleteDocumentLink(id.toString()).subscribe(
        data => {
          if (data) {
            this.links = this.links.filter(l => l.id != id);
            this.filteredLinks = this.filteredLinks.filter(l => l.id != id);
          }
          this.blockUI.stop();
        }
      );
    }
  }

  formatDateUKStyle(dated: any) {
    var validDate = Date.parse(dated);
    if (isNaN(validDate)) {
      return 'Invalid date';
    }
    var datesArr = dated.split('/');
    return this.storeService.formatDateInUkStyle(parseInt(datesArr[2]), parseInt(datesArr[0]), parseInt(datesArr[1]));
  }


}
