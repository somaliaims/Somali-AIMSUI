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
import { NotificationComponent } from './notification/notification.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { LocationsComponent } from './locations/locations.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { SectorTypesComponent } from './sector-types/sector-types.component';
import { ManageSectortypeComponent } from './manage-sectortype/manage-sectortype.component';
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
import { SectorReportComponent } from './report-components/sector-report/sector-report.component';
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
import { CurrenciesComponent } from './currencies/currencies.component';
import { ManageCurrencyComponent } from './manage-currency/manage-currency.component';
import { FinancialYearsComponent } from './financial-years/financial-years.component';
import { ManageYearComponent } from './manage-year/manage-year.component';
import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
import { MergeProjectsComponent } from './merge-projects/merge-projects.component';
import { MergeOrganizationComponent } from './merge-organization/merge-organization.component';
import { DeleteOrganizationComponent } from './delete-organization/delete-organization.component';
import { DeleteLocationComponent } from './delete-location/delete-location.component';
import { DeleteSectorComponent } from './delete-sector/delete-sector.component';
import { SectorMappingsComponent } from './sector-mappings/sector-mappings.component';
import { ExrateSettingsComponent } from './exrate-settings/exrate-settings.component';
import { EnvelopeComponent } from './envelope/envelope.component';
import { ManageCustomFieldsComponent } from './manage-custom-fields/manage-custom-fields.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { DeleteFieldComponent } from './delete-field/delete-field.component';
import { FundingTypesComponent } from './funding-types/funding-types.component';
import { ManageFundingTypeComponent } from './manage-funding-type/manage-funding-type.component';
import { EmailMessagesComponent } from './email-messages/email-messages.component';
import { ManageEmailMessageComponent } from './manage-email-message/manage-email-message.component';
import { DeleteSectortypeComponent } from './delete-sectortype/delete-sectortype.component';
import { LocationReportComponent } from './report-components/location-report/location-report.component';
import { ProjectReportComponent } from './report-components/project-report/project-report.component';
import { BudgetReportComponent } from './report-components/budget-report/budget-report.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ProjectMembershipComponent } from './project-membership/project-membership.component';
import { MembershipRequestsComponent } from './membership-requests/membership-requests.component';
import { YearlyProjectsReportComponent } from './report-components/yearly-projects-report/yearly-projects-report.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
    NotificationComponent,
    OrganizationsComponent,
    ManageOrganizationComponent,
    LocationsComponent,
    ManageLocationComponent,
    SectorTypesComponent,
    ManageSectortypeComponent,
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
    SectorReportComponent,
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
    CurrenciesComponent,
    ManageCurrencyComponent,
    FinancialYearsComponent,
    ManageYearComponent,
    UserSubscriptionComponent,
    MergeProjectsComponent,
    MergeOrganizationComponent,
    DeleteOrganizationComponent,
    DeleteLocationComponent,
    DeleteSectorComponent,
    SectorMappingsComponent,
    SectorTypesComponent,
    ExrateSettingsComponent,
    EnvelopeComponent,
    ManageCustomFieldsComponent,
    CustomFieldsComponent,
    DeleteFieldComponent,
    FundingTypesComponent,
    ManageFundingTypeComponent,
    EmailMessagesComponent,
    ManageEmailMessageComponent,
    DeleteSectortypeComponent,
    LocationReportComponent,
    ProjectReportComponent,
    BudgetReportComponent,
    ContactFormComponent,
    ProjectMembershipComponent,
    MembershipRequestsComponent,
    YearlyProjectsReportComponent,
    NotFoundComponent,
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
    /*{ 
      provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true,
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
