import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { ApplicationDetailComponent } from './pages/application-detail/application-detail.component';


export const routes: Routes = [
    { path: '', redirectTo: 'dashboard',pathMatch: 'prefix' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'applications', component: ApplicationsComponent },
    { path: 'applications/:id', component: ApplicationDetailComponent },
];
