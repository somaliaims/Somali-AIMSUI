import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizationsList: any = null;
  constructor(private organizationService: OrganizationService) { }

  ngOnInit() {
    this.getOrganizationsList();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        if (data && data.length) {
          this.organizationsList = data;
        }
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

}
