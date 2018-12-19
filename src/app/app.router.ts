import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserOrgRegistrationComponent } from './user-org-registration/user-org-registration.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ReportsComponent } from './reports/reports.component';
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
import { UserPasswordChangeComponent } from './user-password-change/user-password-change.component';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { ProjectLocationComponent } from './project-location/project-location.component';
import { ProjectSectorComponent } from './project-sector/project-sector.component';
import { ProjectFunderComponent } from './project-funder/project-funder.component';

// Route Configuration
export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'user-registration', component: UserRegistrationComponent},
  { path: 'user-org-registration', component: UserOrgRegistrationComponent },
  { path: 'user-password-change', component: UserPasswordChangeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'reports', component: ReportsComponent},
  { path: 'management', component: ManagementComponent },
  { path: 'data-entry', component: DataEntryComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'organizations', component: OrganizationsComponent },
  { path: 'manage-organization/:{id}', component: ManageOrganizationComponent, data: { isForEdit: true } },
  { path: 'manage-organization', component: ManageOrganizationComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'manage-location/:{id}', component: ManageLocationComponent, data: { isForEdit: true } },
  { path: 'manage-location', component: ManageLocationComponent },
  { path: 'sector-types', component: SectorTypesComponent },
  { path: 'manage-sectortype/:{id}', component: ManageSectortypeComponent, data: { isForEdit: true } },
  { path: 'manage-sectortype', component: ManageSectortypeComponent },
  { path: 'sector-categories', component: SectorCategoriesComponent },
  { path: 'manage-sectorcategory/:{id}', component: ManageSectorCategoryComponent, data: { isForEdit: true } },
  { path: 'manage-sectorcategory', component: ManageSectorCategoryComponent },
  { path: 'sector-subcategories', component: SectorSubCategoriesComponent },
  { path: 'manage-sectorsubcategory/:{id}', component: ManageSectorSubCategoryComponent, data: { isForEdit: true } },
  { path: 'manage-sectorsubcategory', component: ManageSectorSubCategoryComponent },
  { path: 'sectors', component: SectorsComponent },
  { path: 'manage-sector', component: ManageSectorComponent },
  { path: 'manage-sector/:{id}', component: ManageSectorComponent, data: { isForEdit: true } },
  { path: 'projects', component: ProjectsComponent },
  { path: 'manage-project/:{id}', component: ManageProjectComponent, data: { isForEdit: true } },
  { path: 'manage-project', component: ManageProjectComponent },
  { path: 'view-project/:{id}', component: ViewProjectComponent },
  { path: 'project-location/:{id}', component: ProjectLocationComponent },
  { path: 'project-sector/:{id}', component: ProjectSectorComponent },
  { path: 'project-funder/:{id}', component: ProjectFunderComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);