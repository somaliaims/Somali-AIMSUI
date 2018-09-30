import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { RegistrationModel } from '../models/registration';

@Component({
  selector: 'app-user-org-registration',
  templateUrl: './user-org-registration.component.html',
  styleUrls: ['./user-org-registration.component.css']
})
export class UserOrgRegistrationComponent implements OnInit {

  filteredOrganizations: any = [];
  usersForm: FormGroup;
  isLoading = false;
  model: RegistrationModel = null;

  constructor(private fb: FormBuilder, private organizationService: OrganizationService, private storeService: StoreService) {
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
  }

  displayFn(org: any) {
    if (org) { return org.organizationName; }
  }

}
