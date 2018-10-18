import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {
  organizationsList: any = null;
  criteria: string = null;
  isLoading: boolean = true;

  constructor(private organizationService: OrganizationService, private router: Router) { }

  ngOnInit() {
    this.getOrganizationsList();
  }

  getOrganizationsList() {
    this.organizationService.getOrganizationsList().subscribe(
      data => {
        this.isLoading = false;
        if (data && data.length) {
          this.organizationsList = data;
        }
      },
      error => {
        this.isLoading = false;
        console.log("Request Failed: ", error);
      }
    );
  }

  searchOrganizations() {
    if (this.criteria != null) {
      this.isLoading = true;
      
      this.organizationService.filterOrganizations(this.criteria).subscribe(
        data => {
          this.isLoading = false;
          if (data && data.length) {
            this.organizationsList = data
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    } else {
      this.organizationsList();
    }
  }

  edit(id: string) {
    this.router.navigateByUrl('/manage-organization/' + id);
  }

}
