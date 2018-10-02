import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';

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
  isProcessing: boolean = false;
  btnRegisterText: string = 'Register';
  isShowType: boolean = false;

  constructor(private fb: FormBuilder, private organizationService: OrganizationService, 
    private storeService: StoreService, private userService: UserService,
    private modalService: NgxSmartModalService, private router: Router) {
  }

  ngOnInit() {
    this.storeService.currentRegistration.subscribe(model => this.model = model);
    this.usersForm = this.fb.group({
      userInput: null,
      organizationType: null
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
      this.organizationId = org.id;
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
    var orgValue = this.usersForm.get('userInput').value;
    if (orgValue.id && orgValue.id == 0) {
      this.model.OrganizationName = orgValue.organizationName;
      this.model.OrganizationTypeId = this.usersForm.get('organizationType').value;

      if (this.model.OrganizationName.length == 0) {
        //Need to show a dialog message here
        return false;
      } else if (this.model.IsNewOrganization && this.model.OrganizationTypeId == null) {
        return false;
      }
      this.model.IsNewOrganization = true;
      this.model.OrganizationId = '0';
    } else {
        this.model.OrganizationId = orgValue.id;
        this.model.OrganizationTypeId = '0';
    }

    this.isProcessing = true;
    this.btnRegisterText = 'Wait processing...';
    this.userService.registerUser(this.model).subscribe(
      data => {
        //this.modalService.getModal('infoModal').open();
        this.resetModel();
        this.storeService
        .newInfoMessage('Your registration information is forwarded successfully. We will get back to you soon');
        
        setTimeout(function() {
          this.router.navigateByUrl('');  
        }.bind(this), 1000);
        
      },
      error => {
        console.log("Request Faild: ", error);
        this.resetProcessingStatus();
      }
    )
  }

  resetProcessingStatus() {
    this.btnRegisterText = 'Register';
    this.isProcessing = false;
  }

  resetModel() {
    this.model = new RegistrationModel('', '', '', '', '','', '', '', false);
  }

}
