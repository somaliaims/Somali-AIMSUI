import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sublocation-modal',
  templateUrl: './sublocation-modal.component.html',
  styleUrls: ['./sublocation-modal.component.css']
})
export class SublocationModalComponent implements OnInit {

  @Input()
  locationId: number = 0;

  @Input()
  sublocations: any = [];

  @Input()
  selectedSublocations: any = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
