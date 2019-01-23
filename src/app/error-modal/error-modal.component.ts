import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class ErrorModalComponent implements OnInit {

  @Input()
  message: string = '';

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.open('error-modal');
  }

  closeModal() {
    this.modalService.close('error-modal');
  }

}
