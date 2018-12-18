import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { Messages } from '../config/messages';

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
  delaySeconds: number = 2000;
  //isOrgTypeVisible: boolean = true;
  validationMessage: string = '';
  requestNo: number = 0;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private organizationService: OrganizationService,
    private storeService: StoreService, private userService: UserService,
    private router: Router,
    private zone: NgZone) {

  }

  ngOnInit() {
    this.storeService.currentRegistration.subscribe(model => {
      if (model) {
        if (model.Email === '' || model.Email == null) {
          this.router.navigateByUrl('user-registration');
        } else {
          this.model = model;
        }
      } else {
        this.router.navigateByUrl('user-registration');
      }
    });

    this.storeService.currentRequestTrack.subscribe(model => {
      if (model && this.requestNo == model.requestNo && model.errorStatus != 200) {
        this.errorMessage = model.errorMessage;
        this.isError = true;
      }
    });


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
        switchMap(value => this.organizationService.searchOrganizations({ name: value }, 1)
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(organizations => {
        this.filteredOrganizations = organizations;
      });
    this.fillOrganizationTypes();
  }

  displayFn(org: any) {
    if (org) {
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
    if (!orgValue.id) {
      this.model.OrganizationName = orgValue;
      if (this.model.OrganizationName.length == 0) {
        //Need to show a dialog message here
        console.log('error');
        return false;
      } else if (this.model.IsNewOrganization && this.model.OrganizationTypeId == null) {
        return false;
      }
      this.model.IsNewOrganization = true;
      this.model.OrganizationId = '0';
    } else if (orgValue.id && orgValue.id != 0) {
      this.model.OrganizationId = orgValue.id;
      //this.model.OrganizationTypeId = '0';
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.isProcessing = true;
    this.btnRegisterText = 'Wait processing...';
    this.userService.registerUser(this.model).subscribe(
      data => {
        if (!this.isError) {
          this.resetModel();
          this.storeService
            .newInfoMessage(Messages.USER_REGISTRATION_MESSAGE);
          this.btnRegisterText = 'Redirecting...';
          setTimeout(() => {
            this.router.navigateByUrl('');
          }, this.delaySeconds);
        } else {
          this.resetProcessingStatus();
        }
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
    this.model = new RegistrationModel('', '', '', '', '', '', '', false);
  }

}
