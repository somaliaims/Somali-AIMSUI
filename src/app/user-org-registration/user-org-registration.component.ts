import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize, startWith, map } from 'rxjs/operators';
import { OrganizationService } from '../services/organization-service';
import { StoreService } from '../services/store-service';
import { RegistrationModel } from '../models/registration';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { Messages } from '../config/messages';
import { Organization } from '../models/organization-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-org-registration',
  templateUrl: './user-org-registration.component.html',
  styleUrls: ['./user-org-registration.component.css']
})
export class UserOrgRegistrationComponent implements OnInit {

  organizations: any = [];
  userInput = new FormControl();
  filteredOrganizations: any = [] ;
  organizationTypes: any = [];
  organizationType: string = null;
  isLoading = true;
  organizationId: number = 0;
  organizationTypeId: string = null;
  isProcessing: boolean = false;
  btnRegisterText: string = 'Register';
  isShowType: boolean = false;
  delaySeconds: number = 2000;
  selectedOrganizationId: number = 0;
  validationMessage: string = '';
  requestNo: number = 0;
  isError: boolean = false;
  errorMessage: string = '';
  model: any = { email: null, password: null, organizationTypeId: null, organizationId: null, IsNewOrganization: false, organizationName: null };

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
    this.loadOrganizationTypes();
    this.loadOrganizations();
  }
  
  displayFn(organization?: Organization): string | undefined {
    if (organization) {
      this.selectedOrganizationId = organization.id;
    } else {
      this.selectedOrganizationId = 0;
    }
    return organization ? organization.organizationName : undefined;
  }

  selectOrganization(e) {
    var id = e.currentTarget.id.split('-')[1];
    if (id) {
      var organization = this.organizations.filter(o => o.id == id);
      if (organization.length > 0) {
        this.model.organizationTypeId = null;
        if (organization[0].organizationTypeId != 0) {
          this.model.organizationTypeId = organization[0].organizationTypeId;        
        }
        this.selectedOrganizationId = organization[0].id;
        this.model.organizationName = organization[0].organizationName;
      }
    }
  }

  filterOrganizations() {
    var org = this.model.organizationName;
    var organizations = [];
    if (this.model.organizationTypeId && this.model.organizationTypeId != 0) {
      organizations = this.organizations.filter(o => o.organizationTypeId == this.model.organizationTypeId);
    } else {
      organizations = this.organizations;
    }

    if (!org) {
      this.filteredOrganizations = organizations;
    } else {
      org = org.toLowerCase();
      this.filteredOrganizations = organizations.filter(o => o.organizationName.toLowerCase().indexOf(org) != -1);
    }
  }

  loadOrganizationTypes() {
    this.organizationService.getOrganizationTypes().subscribe(
      data => {
        if (data) {
          this.organizationTypes = data;
        }
      }
    );
  }

  loadOrganizations() {
    this.organizationService.getOrganizationsWithType().subscribe(
      data => {
        if (data) {
          this.organizations = data;
          this.filteredOrganizations = data;
        }
        this.isLoading = false;
      }
    );
  }

  filterOrganizationsList() {
    var id = this.model.organizationTypeId;
    if (id) {
      this.model.organizationName = null;
      this.model.organizationId = null;
      this.selectedOrganizationId = 0;
      this.filteredOrganizations = this.organizations.filter(o => o.organizationTypeId == id);
    }
  }

  registerUser() {
    if (this.selectedOrganizationId == 0) {
      this.model.OrganizationName = this.model.organizationName;
      if (this.model.OrganizationName.length == 0) {
        return false;
      } else if (this.model.IsNewOrganization) {
        return false;
      }
      this.model.IsNewOrganization = true;
      this.model.OrganizationId = '0';
    } else if (this.selectedOrganizationId != 0) {
      this.model.OrganizationId = this.selectedOrganizationId.toString();
    }

    this.requestNo = this.storeService.getNewRequestNumber();
    this.isProcessing = true;
    this.btnRegisterText = 'Wait processing...';
    this.userService.registerUser(this.model).subscribe(
      data => {
        if (!this.isError) {
          this.storeService
            .newInfoMessage(Messages.USER_REGISTRATION_MESSAGE);
          this.btnRegisterText = 'Redirecting...';
          setTimeout(() => {
            this.resetModel();
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
    this.model = new RegistrationModel('', '', '', '', '', '', false);
  }

  clear() {
    this.model.organizationName = null;
    this.selectedOrganizationId = 0;
  }

}
