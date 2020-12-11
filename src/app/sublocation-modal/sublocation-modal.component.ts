import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Settings } from '../config/settings';

@Component({
  selector: 'sublocation-modal',
  templateUrl: './sublocation-modal.component.html',
  styleUrls: ['./sublocation-modal.component.css']
})
export class SublocationModalComponent implements OnInit {

  @Input()
  locationId: number = 0;

  @Input()
  subLocations: any = [];

  @Input()
  selectedSublocations: any = [];

  @Input()
  locationName: string = null;
  
  @Output()
  updatedSubLocations = new EventEmitter<any>();

  subLocationsSettings = {};
  itemsToShowInDropdowns = 5;
  btnText = 'Set Sub-locations';

  constructor() { 
    this.subLocationsSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'subLocation',
      selectAllText: 'Select all',
      unSelectAllText: 'Unselect all',
      itemsShowLimit: this.itemsToShowInDropdowns,
      allowSearchFilter: true
    };
  }

  ngOnInit(): void {
  }

  setSubLocationsAndClose() {
    this.updatedSubLocations.emit(this.selectedSublocations);
  }

}
