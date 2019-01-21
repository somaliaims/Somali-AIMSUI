import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'project-info-modal',
  templateUrl: './project-info-modal.component.html',
  styleUrls: ['./project-info-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class ProjectInfoModalComponent implements OnInit {

  @Input()
  project: any = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    sectors: [],
    locations: [],
    documents: [],
    funders: [],
    implementors: []
  };
  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('project-info-modal');
  }

  closeModal() {
    this.modalService.close('project-info-modal');
  }

}
