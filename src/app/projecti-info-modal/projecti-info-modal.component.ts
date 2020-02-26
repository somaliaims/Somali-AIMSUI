import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { StoreService } from '../services/store-service';

@Component({
  selector: 'projecti-info-modal',
  templateUrl: './projecti-info-modal.component.html',
  styleUrls: ['./projecti-info-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class ProjectiInfoModalComponent implements OnInit {

  @Input()
  project: any = {
    title: '',
    description: '',
    defaultCurrency: '',
  };
  @Input()
  sectors: any = [];
  @Input()
  locations: any = [];
  @Input()
  funders: any = [];
  @Input()
  implementers: any = [];
  @Input()
  documents: any = [];
  @Input()
  budgets: any = [];
  @Input()
  transactions: any = [];
  
  constructor(private modalService: ModalService, private storeService: StoreService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('projecti-info-modal');
  }

  closeModal() {
    this.modalService.close('projecti-info-modal');
  }

  getLongDateString(dated) {
    if (dated) {
      return this.storeService.getLongDateString(dated);
    }
    return dated;
  }

  formatNumber(value: number) {
    if (!value) {
      return value;
    }
    if (!isNaN(value) && value > 0) {
      return this.storeService.getNumberWithCommas(Math.round(value));
    }
    return value;
  }

}
