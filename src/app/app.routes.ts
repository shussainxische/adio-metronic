import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EspDashboardComponent } from './pages/esp-dashboard/esp-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard',pathMatch: 'prefix' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'esp-dashboard', component: EspDashboardComponent },
];
