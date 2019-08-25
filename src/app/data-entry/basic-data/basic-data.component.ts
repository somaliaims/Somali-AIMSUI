import { Component, OnInit, Input } from '@angular/core';
import { Settings } from 'src/app/config/settings';

@Component({
  selector: 'basic-data',
  templateUrl: './basic-data.component.html',
  styleUrls: ['./basic-data.component.css']
})
export class BasicDataComponent implements OnInit {

  @Input()
  projectData: any = {};
  @Input()
  projectDocuments: any = [];
  @Input()
  projectFunders: any = [];
  @Input()
  projectImplementers: any = [];
  @Input()
  financialYears: any = [];

  descriptionLimit: number = Settings.descriptionLongLimit;
  descriptionLimitLeft: number = Settings.descriptionLongLimit;

  constructor() { }

  ngOnInit() {
  }

  getDescriptionLimitInfo() {
    this.descriptionLimitLeft = (this.descriptionLimit - this.projectData.description.length);
    if (this.descriptionLimitLeft < 0) {
      this.projectData.description = this.projectData.description.substring(0, (this.descriptionLimit - 1));
    }
  }

}
