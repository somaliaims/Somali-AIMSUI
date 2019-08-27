import { Component, OnInit } from '@angular/core';
import { MarkerService } from '../services/marker.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { SecurityHelperService } from '../services/security-helper.service';
import { Settings } from '../config/settings';
import { StoreService } from '../services/store-service';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css']
})
export class MarkersComponent implements OnInit {
  fieldType: any = {
    1: 'Dropdown',
    2: 'Checkbox',
    3: 'Text',
    4: 'Radio'
  };

  markers: any = [];
  filteredMarkers: any = [];
  isLoading: boolean = true;
  permissions: any = {};
  criteria: string = null;
  inputTextHolder: string = 'Enter field name to search';
  infoMessage: string = null;
  pagingSize: number = Settings.rowsPerPage;

  @BlockUI() blockUI: NgBlockUI;
  constructor(private markerService: MarkerService, private router: Router,
    private securityService: SecurityHelperService, private storeService: StoreService,
    private infoModal: InfoModalComponent) { }

  ngOnInit() {
    this.permissions = this.securityService.getUserPermissions();
    if (!this.permissions.canEditCustomFields) {
      this.router.navigateByUrl('home');
    }

    this.getMarkers();
  }

  getMarkers() {
    this.markerService.getMarkers().subscribe(
      data => {
        if (data) {
          this.markers = data;
          this.filteredMarkers = data;
        }
        this.isLoading = false;
      }
    )
  }

  searchFields() {
    if (!this.criteria) {
      this.filteredMarkers = this.markers;
    } else {
      this.filteredMarkers = this.markers.filter(c => c.fieldTitle.trim().toLowerCase().indexOf(this.criteria.toLowerCase()) != -1);
    }
  }

  addMarker() {
    this.router.navigateByUrl('manage-markers');
  }

  editMarker(id: string) {
    this.router.navigateByUrl('manage-markers/' + id);
  }

  deleteMarker(id: string) {
    this.router.navigateByUrl('delete-marker/' + id);
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  getFieldType(id: number) {
    return this.fieldType[id];
  }

  viewHelpText(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      var marker = this.markers.filter(f => f.id == id);
      if (marker.length > 0) {
        this.infoMessage = marker[0].help;
        this.infoModal.openModal();
      }
    }
    return false;
  }

}
