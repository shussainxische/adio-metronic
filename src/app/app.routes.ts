import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EspComponent } from './pages/esp/esp.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard',pathMatch: 'prefix' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'esp-dashboard', component: EspComponent },
];
