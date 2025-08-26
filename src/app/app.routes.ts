import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
<<<<<<< HEAD
import { ApplicationsComponent } from './pages/applications/applications.component';
=======
import { EspDashboardComponent } from './pages/esp-dashboard/esp-dashboard.component';
>>>>>>> feature-ui

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard',pathMatch: 'prefix' },
    { path: 'dashboard', component: DashboardComponent },
<<<<<<< HEAD
    { path: 'applications', component: ApplicationsComponent },
=======
    { path: 'esp-dashboard', component: EspDashboardComponent },
>>>>>>> feature-ui
];
