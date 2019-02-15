import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatProgressSpinnerModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';
import { ChartsModule } from 'ng2-charts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { Routing } from './app.router';
import { AppComponent } from './main/app.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserOrgRegistrationComponent } from './user-org-registration/user-org-registration.component';
import { FocusDirectiveDirective } from './directives/focus-directive.directive';
import { HomeComponent } from './home/home.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ProjectsComponent } from './projects/projects.component';
import { ReportsPanelComponent } from './reports-panel/reports-panel.component';
import { ManagementComponent } from './management/management.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { NotificationComponent } from './notification/notification.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
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
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { ProjectLocationComponent } from './project-location/project-location.component';
import { ProjectSectorComponent } from './project-sector/project-sector.component';
import { ProjectFunderComponent } from './project-funder/project-funder.component';
import { ProjectImplementerComponent } from './project-implementer/project-implementer.component';
import { ProjectDisbursementComponent } from './project-disbursement/project-disbursement.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { ModalComponent } from './modal/modal.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectReportComponent } from './report-components/project-report/project-report.component';
import { ProjectEntryComponent } from './project-entry/project-entry.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ProjectInfoModalComponent } from './project-info-modal/project-info-modal.component';
import { ProjectiInfoModalComponent } from './projecti-info-modal/projecti-info-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { IatiSettingsComponent } from './iati-settings/iati-settings.component';
import { SmtpSettingsComponent } from './smtp-settings/smtp-settings.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegistrationComponent,
    UserOrgRegistrationComponent,
    FocusDirectiveDirective,
    HomeComponent,
    ProjectsComponent,
    ReportsPanelComponent,
    ManagementComponent,
    DataEntryComponent,
    NotificationComponent,
    OrganizationsComponent,
    ManageOrganizationComponent,
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
    PasswordChangeComponent,
    ForgotPasswordComponent,
    ViewProjectComponent,
    ProjectLocationComponent,
    ProjectSectorComponent,
    ProjectFunderComponent,
    ProjectImplementerComponent,
    ProjectDisbursementComponent,
    ProjectDocumentComponent,
    ModalComponent,
    NewProjectComponent,
    ProjectReportComponent,
    ProjectEntryComponent,
    InfoModalComponent,
    TruncatePipe,
    ProjectInfoModalComponent,
    ProjectiInfoModalComponent,
    ErrorModalComponent,
    IatiSettingsComponent,
    SmtpSettingsComponent,
    ManageAccountComponent,
    ResetPasswordComponent,
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
    AngularFontAwesomeModule,
    NgxPaginationModule,
    NgbDatepickerModule,
    BlockUIModule.forRoot(),
    ChartsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
