import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { StoreService } from '../services/store-service';
import { Router } from '@angular/router';

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
  project: any = {};
  @Input()
  projectId: number = 0;
  @Input()
  sectors: any = [];
  @Input()
  locations: any = [];
  @Input()
  funders: any = [];
  @Input()
  disbursements: any = [];
  @Input()
  implementers: any = [];
  @Input()
  documents: any = [];
  @Input()
  markers: any = [];
  @Input()
  isShowContact: boolean = false;

  disbursementTypeConstants: any = {

  };

  constructor(private modalService: ModalService, private storeService: StoreService,
    private router: Router) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('project-info-modal');
  }

  closeModal() {
    this.modalService.close('project-info-modal');
  }

  displayFieldValues(json: any) {
    return this.storeService.parseAndDisplayJsonAsString(json);
  }

  getLongDateString(dated) {
    return this.storeService.getLongDateString(dated);
  }

  contactProject() {
    if (this.projectId != 0) {
      this.router.navigateByUrl('contact-project/' + this.projectId);
    }
  }

}
