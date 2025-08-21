import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard',pathMatch: 'prefix' },
     { path: 'dashboard', component: DashboardComponent },
];
