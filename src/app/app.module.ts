import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatProgressSpinnerModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';

import { Routing } from './app.router';
import { AppComponent } from './main/app.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserOrgRegistrationComponent } from './user-org-registration/user-org-registration.component';
import { FocusDirectiveDirective } from './directives/focus-directive.directive';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { HomeComponent } from './home/home.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ProjectsComponent } from './projects/projects.component';
import { ReportsComponent } from './reports/reports.component';
import { ManagementComponent } from './management/management.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { NotificationComponent } from './notification/notification.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { LocationsComponent } from './locations/locations.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { SectorTypesComponent } from './sector-types/sector-types.component';
import { ManageSectortypeComponent } from './manage-sectortype/manage-sectortype.component';
import { SectorCategoriesComponent } from './sector-categories/sector-categories.component';
import { ManageSectorCategoryComponent } from './manage-sector-category/manage-sectorcategory.component';
import { SectorSubCategoriesComponent } from './sector-subcategories/sector-subcategories.component';
import { ManageSectorSubCategoryComponent } from './manage-sector-subcategory/manage-sector-subcategory.component';
import { SectorsComponent } from './sectors/sectors.component';
import { ManageSectorComponent } from './manage-sector/manage-sector.component';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';
import { UserPasswordForgotComponent } from './user-password-forgot/user-password-forgot.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { ProjectLocationComponent } from './project-location/project-location.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegistrationComponent,
    UserOrgRegistrationComponent,
    FocusDirectiveDirective,
    InfoModalComponent,
    HomeComponent,
    ProjectsComponent,
    ReportsComponent,
    ManagementComponent,
    DataEntryComponent,
    NotificationComponent,
    OrganizationsComponent,
    ManageOrganizationComponent,
    ErrorModalComponent,
    LocationsComponent,
    ManageLocationComponent,
    SectorTypesComponent,
    ManageSectortypeComponent,
    SectorCategoriesComponent,
    ManageSectorCategoryComponent,
    SectorSubCategoriesComponent,
    ManageSectorSubCategoryComponent,
    SectorsComponent,
    ManageSectorComponent,
    ManageProjectComponent,
    UserPasswordChangeComponent,
    UserPasswordForgotComponent,
    ViewProjectComponent,
    ProjectLocationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    Routing,
    HttpClientModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxSmartModalModule.forRoot(),
    AngularFontAwesomeModule,
    NgxPaginationModule,
    NgbDatepickerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
