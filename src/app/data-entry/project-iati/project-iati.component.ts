import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-iati',
  templateUrl: './project-iati.component.html',
  styleUrls: ['./project-iati.component.css']
})
export class ProjectIatiComponent implements OnInit {

  @Input()
  iatiProjects: any = [];
  @Input()
  aimsProjects: any = [];
  @Input()
  activeProjectData: any = [];

  constructor() { }

  ngOnInit() {
  }

}
