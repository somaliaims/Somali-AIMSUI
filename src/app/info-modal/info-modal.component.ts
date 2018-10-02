import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {
  
  @Input() message : string;

  constructor() { }

  ngOnInit() {
  }

}
