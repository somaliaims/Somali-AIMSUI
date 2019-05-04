import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class InfoModalComponent implements OnInit {
  @Input()
  message: string = '';
  @Input()
  title: string = 'Information message';

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('info-modal');
  }

  closeModal() {
    this.modalService.close('info-modal');
  }

}
