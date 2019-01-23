import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

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
  participatingOrganizations: any = [];
  @Input()
  documents: any = [];
  
  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('projecti-info-modal');
  }

  closeModal() {
    this.modalService.close('projecti-info-modal');
  }

}
