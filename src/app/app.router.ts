import { ModuleWithProviders, Component, NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserOrgRegistrationComponent } from './user-org-registration/user-org-registration.component';
import { HomeComponent } from './home/home.component';
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
import { PasswordChangeComponent } from './password-change/password-change.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { ProjectLocationComponent } from './project-location/project-location.component';
import { ProjectSectorComponent } from './project-sector/project-sector.component';
import { ProjectFunderComponent } from './project-funder/project-funder.component';
import { ProjectImplementerComponent } from './project-implementer/project-implementer.component';
import { ProjectDisbursementComponent } from './project-disbursement/project-disbursement.component';
import { ProjectDocumentComponent } from './project-document/project-document.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { ProjectEntryComponent } from './project-entry/project-entry.component';
import { SectorReportComponent } from './report-components/sector-report/sector-report.component';
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
import { MarkersComponent } from './markers/markers.component';
import { ManageMarkersComponent } from './manage-markers/manage-markers.component';
import { DeleteMarkerComponent } from './delete-marker/delete-marker.component';
import { FundingTypesComponent } from './funding-types/funding-types.component';
import { ManageFundingTypeComponent } from './manage-funding-type/manage-funding-type.component';
import { EmailMessagesComponent } from './email-messages/email-messages.component';
import { ManageEmailMessageComponent } from './manage-email-message/manage-email-message.component';
import { DeleteSectortypeComponent } from './delete-sectortype/delete-sectortype.component';
import { LocationReportComponent } from './report-components/location-report/location-report.component';
import { ProjectReportComponent } from './report-components/project-report/project-report.component';
import { BudgetReportComponent } from './report-components/budget-report/budget-report.component';
import { ProjectMembershipComponent } from './project-membership/project-membership.component';
import { MembershipRequestsComponent } from './membership-requests/membership-requests.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { TimeTrendReportComponent } from './report-components/time-trend-report/time-trend-report.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BudgetReportSummaryComponent } from './report-components/budget-report-summary/budget-report-summary.component';
import { DataImportComponent } from './data-import/data-import.component';
import { ContactProjectComponent } from './contact-project/contact-project.component';
import { ExrateUsageComponent } from './exrate-usage/exrate-usage.component';
import { ManageExrateUsageComponent } from './manage-exrate-usage/manage-exrate-usage.component';
import { HomePageSettingsComponent } from './home-page-settings/home-page-settings.component';
import { ManageHelpComponent } from './manage-help/manage-help.component';
import { DataEntryComponent } from './data-entry/data-entry/data-entry.component';
import { ManageEnvelopeTypeComponent } from './manage-envelope-type/manage-envelope-type.component';
import { EnvelopeTypesComponent } from './envelope-types/envelope-types.component';
import { DeleteEnvelopeTypeComponent } from './delete-envelope-type/delete-envelope-type.component';
import { EnvelopeReportComponent } from './report-components/envelope-report/envelope-report.component';
import { DataBackupComponent } from './data-backup/data-backup.component';
import { AllProjectsReportComponent } from './report-components/all-projects-report/all-projects-report.component';
import { OrganizationTypesComponent } from './organization-types/organization-types.component';
import { ManageOrganizationTypeComponent } from './manage-organization-type/manage-organization-type.component';
import { DeleteOrganizationTypeComponent } from './delete-organization-type/delete-organization-type.component';
import { FinancialYearSettingsComponent } from './financial-year-settings/financial-year-settings.component';
import { EmailUsersComponent } from './email-users/email-users.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { DocumentLinkComponent } from './document-link/document-link.component';
import { ManageDocumentLinkComponent } from './manage-document-link/manage-document-link.component';
import { ContactMessagesComponent } from './contact-messages/contact-messages.component';

// Route Configuration
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'user-registration', component: UserRegistrationComponent},
  { path: 'user-org-registration', component: UserOrgRegistrationComponent },
  { path: 'password-change', component: PasswordChangeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'projects', component: ProjectsComponent },
  { path: 'reports-panel', component: ReportsPanelComponent},
  { path: 'management', component: ManagementComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'contact-messages', component: ContactMessagesComponent},
  { path: 'organizations', component: OrganizationsComponent},
  { path: 'organization-types', component: OrganizationTypesComponent},
  { path: 'delete-organization/:{id}', component: DeleteOrganizationComponent },
  { path: 'delete-organization-type/:{id}', component: DeleteOrganizationTypeComponent },
  { path: 'manage-organization/:{id}', component: ManageOrganizationComponent, data: { isForEdit: true } },
  { path: 'manage-organization', component: ManageOrganizationComponent },
  { path: 'manage-organization-type/:{id}', component: ManageOrganizationTypeComponent, data: { isForEdit: true } },
  { path: 'manage-organization-type', component: ManageOrganizationTypeComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'manage-location/:{id}', component: ManageLocationComponent, data: { isForEdit: true } },
  { path: 'delete-location/:{id}', component: DeleteLocationComponent },
  { path: 'manage-location', component: ManageLocationComponent },
  { path: 'sector-types', component: SectorTypesComponent },
  { path: 'manage-sectortype/:{id}', component: ManageSectortypeComponent, data: { isForEdit: true } },
  { path: 'manage-sectortype', component: ManageSectortypeComponent },
  { path: 'delete-sectortype/:{id}', component: DeleteSectortypeComponent },
  { path: 'sectors', component: SectorsComponent },
  { path: 'manage-sector', component: ManageSectorComponent },
  { path: 'manage-sector/:{id}', component: ManageSectorComponent, data: { isForEdit: true } },
  { path: 'delete-sector/:{id}', component: DeleteSectorComponent },
  { path: 'sector-mappings', component: SectorMappingsComponent},
  { path: 'projects', component: ProjectsComponent },
  { path: 'manage-project/:{id}', component: ManageProjectComponent, data: { isForEdit: true } },
  { path: 'manage-project', component: ManageProjectComponent },
  { path: 'new-project', component: NewProjectComponent},
  { path: 'view-project/:{id}', component: ViewProjectComponent },
  { path: 'project-location/:{id}', component: ProjectLocationComponent },
  { path: 'project-sector/:{id}', component: ProjectSectorComponent },
  { path: 'project-funder/:{id}', component: ProjectFunderComponent },
  { path: 'project-implementer/:{id}', component: ProjectImplementerComponent },
  { path: 'project-disbursement/:{id}', component: ProjectDisbursementComponent },
  { path: 'project-document/:{id}', component: ProjectDocumentComponent },
  { path: 'project-entry', component: ProjectEntryComponent },
  { path: 'data-entry', component: DataEntryComponent },
  { path: 'sectors-report', component: SectorReportComponent },
  { path: 'data-export', component: AllProjectsReportComponent },
  { path: 'locations-report', component: LocationReportComponent },
  { path: 'time-trend-report', component: TimeTrendReportComponent },
  { path: 'budget-report', component: BudgetReportComponent },
  { path: 'envelope-report', component: EnvelopeReportComponent },
  { path: 'iati-settings', component: IatiSettingsComponent },
  { path: 'smtp-settings', component: SmtpSettingsComponent },
  { path: 'home-page-settings', component: HomePageSettingsComponent},
  { path: 'manage-account', component: ManageAccountComponent },
  { path: 'currencies', component: CurrenciesComponent },
  { path: 'manage-currency', component: ManageCurrencyComponent },
  { path: 'manage-users', component: UserManagerComponent },
  { path: 'manage-currency/:{id}', component: ManageCurrencyComponent, data: { isForEdit: true } },
  { path: 'financial-years', component: ManageYearComponent },
  { path: 'financial-year-settings', component: FinancialYearSettingsComponent },
  { path: 'manage-year', component:  ManageYearComponent},
  { path: 'user-subscriptions', component: UserSubscriptionComponent },
  { path: 'merge-projects', component: MergeProjectsComponent },
  { path: 'merge-organizations', component: MergeOrganizationComponent},
  { path: 'exchange-rate-settings', component: ExrateSettingsComponent },
  { path: 'exchange-rate-usage', component: ExrateUsageComponent },
  { path: 'manage-exchange-rate-usage', component: ManageExrateUsageComponent },
  { path: 'manage-exchange-rate-usage/:{id}', component: ManageExrateUsageComponent, data: { isForEdit: true } },
  { path: 'envelope-types', component: EnvelopeTypesComponent },
  { path: 'envelope', component: EnvelopeComponent},
  { path: 'manage-envelope-type', component: ManageEnvelopeTypeComponent},
  { path: 'manage-envelope-type/:{id}', component: ManageEnvelopeTypeComponent, data: { isForEdit: true }},
  { path: 'delete-envelope-type/:{id}', component: DeleteEnvelopeTypeComponent },
  { path: 'markers', component: MarkersComponent },
  { path: 'manage-markers', component: ManageMarkersComponent },
  { path: 'manage-markers/:{id}', component: ManageMarkersComponent, data: { isForEdit: true } },
  { path: 'delete-marker/:{id}', component: DeleteMarkerComponent },
  { path: 'funding-types', component: FundingTypesComponent },
  { path: 'manage-funding-type', component: ManageFundingTypeComponent },
  { path: 'manage-funding-type/:{id}', component: ManageFundingTypeComponent, data: { isForEdit: true } },
  { path: 'email-messages', component: EmailMessagesComponent },
  { path: 'email-users', component: EmailUsersComponent },
  { path: 'manage-email-message', component: ManageEmailMessageComponent },
  { path: 'manage-email-message/:{id}', component: ManageEmailMessageComponent, data: { isForEdit: true } },
  { path: 'project-membership/:{id}', component: ProjectMembershipComponent },
  { path: 'contact-project/:{id}', component: ContactProjectComponent },
  { path: 'membership-requests', component: MembershipRequestsComponent },
  { path: 'data-import', component: DataImportComponent },
  { path: 'contact', component: ContactFormComponent },
  { path: 'help-text', component: ManageHelpComponent },
  { path: 'data-backup', component: DataBackupComponent },
  { path: 'document-links', component: DocumentLinkComponent },
  { path: 'manage-document-link', component: ManageDocumentLinkComponent },
  { path: '**', component: NotFoundComponent },
];

//export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
/*
Adding children to main routes
children: [
    {path: '', redirectTo: 'tracks'},
    {path: 'tracks', component: ArtistTrackListComponent},
    {path: 'albums', component: ArtistAlbumListComponent},
  ] },*/