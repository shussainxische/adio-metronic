import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { ApplicationDetailComponent } from './pages/application-detail/application-detail.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'applications', component: ApplicationsComponent },
    { path: 'applications/:id', component: ApplicationDetailComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'profile-settings', component: ProfileSettingsComponent },
];
