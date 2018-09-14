import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

// Route Configuration
export const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'user-registration', component: UserRegistrationComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);