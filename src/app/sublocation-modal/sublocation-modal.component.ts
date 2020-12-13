import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { Settings } from '../config/settings';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'sublocation-modal',
  templateUrl: './sublocation-modal.component.html',
  styleUrls: ['./sublocation-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class SublocationModalComponent implements OnInit {

  @Input()
  locationId: number = 0;

  @Input()
  subLocations: any = [];

  @Input()
  selectedSubLocations: any = [];

  @Input()
  locationName: string = null;
  
  @Output()
  updatedSubLocations = new EventEmitter<any>();

  subLocationsSettings = {};
  itemsToShowInDropdowns = 5;
  isBtnDisabled: boolean = false;
  isError: boolean = false;
  errorMessage: string = null;
  isLoading: boolean = true;
  btnText = 'Set & Close';

  constructor(private modalService: ModalService) { 
  }

  ngOnInit(): void {
    console.log(this.selectedSubLocations);
    setTimeout(() => {
      this.isLoading = false;
      this.subLocationsSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'subLocation',
        selectAllText: 'Select all',
        unSelectAllText: 'Unselect all',
        itemsShowLimit: this.itemsToShowInDropdowns,
        allowSearchFilter: true
      };
    }, 500);
  }

  openModal() {
    setTimeout(() => {
      this.modalService.open('sublocation-modal');
    }, 500);
  }

  setSubLocations() {
    var model = {
      locationId: this.locationId,
      subLocations: this.selectedSubLocations
    }
    this.closeModal();
    setTimeout(() => {
      this.updatedSubLocations.emit(model);
    }, 500);
    
  }

  closeModal() {
    this.modalService.close('sublocation-modal');
  }

}
