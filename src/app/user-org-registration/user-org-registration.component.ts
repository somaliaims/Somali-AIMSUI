import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-user-org-registration',
  templateUrl: './user-org-registration.component.html',
  styleUrls: ['./user-org-registration.component.css']
})
export class UserOrgRegistrationComponent implements OnInit {

  filteredOrganizations: any = [];
  organizationTypes: any = [];
  organizationType: string = null;
  usersForm: FormGroup;
  isLoading = false;
  model: RegistrationModel = null;
  organizationId: number = 0;
  organizationTypeId: string = null;

  constructor(private fb: FormBuilder, private organizationService: OrganizationService, 
    private storeService: StoreService, private userService: UserService) {
  }

  ngOnInit() {
    this.storeService.currentRegistration.subscribe(model => this.model = model);
    this.usersForm = this.fb.group({
      userInput: null
    });

    this.usersForm
      .get('userInput')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.organizationService.searchOrganizations({name: value}, 1)
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(organizations => this.filteredOrganizations = organizations);
      this.fillOrganizationTypes();
  }

  displayFn(org: any) {
    if (org) { 
      this.organizationId = org.organizationId;
      return org.organizationName; 
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

  registerUser() {
    if (this.organizationId == 0) {
      this.model.Organization = this.usersForm.get('userInput').value;
      this.model.OrganizationTypeId = this.usersForm.get('organizationType').value;

      if (this.model.Organization.length == 0) {
        //Need to show a dialog message here
        return false;
      } else if (this.model.IsNewOrganization && this.model.OrganizationTypeId == null) {
        return false;
      }
      this.model.IsNewOrganization = true;
      this.model.OrganizationId = '0';
    }

    this.userService.registerUser(this.model).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log("Request Faild: ", error);
      }
    )
  }

  resetModel() {
    this.model = new RegistrationModel('', '', '', '', '','', '', '', false);
  }

}
