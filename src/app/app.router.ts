import { ModuleWithProviders, Component }  from '@angular/core';
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
import { ProjectReportComponent } from './report-components/project-report/project-report.component';
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

// Route Configuration
export const routes: Routes = [
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
  { path: 'organizations', component: OrganizationsComponent },
  { path: 'delete-organization/:{id}', component: DeleteOrganizationComponent },
  { path: 'manage-organization/:{id}', component: ManageOrganizationComponent, data: { isForEdit: true } },
  { path: 'manage-organization', component: ManageOrganizationComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'manage-location/:{id}', component: ManageLocationComponent, data: { isForEdit: true } },
  { path: 'delete-location/:{id}', component: DeleteLocationComponent },
  { path: 'manage-location', component: ManageLocationComponent },
  { path: 'sector-types', component: SectorTypesComponent },
  { path: 'manage-sectortype/:{id}', component: ManageSectortypeComponent, data: { isForEdit: true } },
  { path: 'manage-sectortype', component: ManageSectortypeComponent },
  { path: 'sectors', component: SectorsComponent },
  { path: 'manage-sector', component: ManageSectorComponent },
  { path: 'manage-sector/:{id}', component: ManageSectorComponent, data: { isForEdit: true } },
  { path: 'delete-sector/:{id}', component: DeleteSectorComponent },
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
  { path: 'sectors-report', component: ProjectReportComponent },
  { path: 'iati-settings', component: IatiSettingsComponent },
  { path: 'smtp-settings', component: SmtpSettingsComponent },
  { path: 'manage-account', component: ManageAccountComponent },
  { path: 'currencies', component: CurrenciesComponent },
  { path: 'manage-currency', component: ManageCurrencyComponent },
  { path: 'financial-years', component: FinancialYearsComponent },
  { path: 'manage-year', component:  ManageYearComponent},
  { path: 'user-subscriptions', component: UserSubscriptionComponent },
  { path: 'merge-projects', component: MergeProjectsComponent },
  { path: 'merge-organizations', component: MergeOrganizationComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);