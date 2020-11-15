import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '../config/settings';
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

  constructor(private documentService: DocumentLinkService,
    private securityService: SecurityHelperService,
    private router: Router,
    private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditOrganization) {
      this.router.navigateByUrl('home');
    }
    this.storeService.newReportItem(Settings.dropDownMenus.management);
    this.getDocuments();
  }

  getDocuments() {
    this.documentService.getDocumentLinks().subscribe(
      data => {
        if (data) {
          this.links = data;
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

  formatDateUKStyle(dated: any) {
    var validDate = Date.parse(dated);
    if (isNaN(validDate)) {
      return 'Invalid date';
    }
    var datesArr = dated.split('/');
    return this.storeService.formatDateInUkStyle(parseInt(datesArr[2]), parseInt(datesArr[0]), parseInt(datesArr[1]));
  }


}
