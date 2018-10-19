import { Component, OnInit, Input } from '@angular/core';
import { OrganizationService } from '../services/organization-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.css']
})
export class ManageOrganizationComponent implements OnInit {
  @Input()
  isForEdit: boolean = false;
  orgId: number = 0;
  btnText: string = 'Add Organization';
  organizationTypes: any = null;
  model = { id: 0, organizationName: '', organizationTypeId: 0};

  constructor(private organizationService: OrganizationService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.params);
    this.fillOrganizationTypes();
    if (this.route.snapshot.data && this.route.snapshot.data.isForEdit) {
      var id = this.route.snapshot.params["{id}"];
      if (id) {
        this.btnText = 'Edit Organization';
        this.organizationService.getOrganization(id).subscribe(
          data => {
            this.model.id = data.id;
            this.model.organizationName = data.organizationName;
            this.model.organizationTypeId = data.organizationTypeId;
          },
          error => {
            console.log("Request Failed: ", error);
          }
        );
      }
    }
  }

  fillOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        this.organizationTypes = data;
      },
      error => {
        console.log("Request Failed: ", error);
      }
    );
  }

}
