import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { CbDashboardComponent } from './pages/cb-dashboard/cb-dashboard.component';
import { AdioDashboardComponent } from './pages/adio-dashboard/adio-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { ApplicationDetailComponent } from './pages/application-detail/application-detail.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    
    // CB Routes
    { path: 'cb-dashboard', component: CbDashboardComponent },
    { path: 'cb/applications', component: ApplicationsComponent },
    { path: 'cb/applications/:id', component: ApplicationDetailComponent },
    { path: 'cb/resources', component: ResourcesComponent },
    { path: 'cb/notifications', component: NotificationsComponent },
    { path: 'cb/profile-settings', component: ProfileSettingsComponent },
    
    // ADIO Routes
    { path: 'adio-dashboard', component: AdioDashboardComponent },
    { path: 'adio/applications', component: ApplicationsComponent },
    { path: 'adio/applications/:id', component: ApplicationDetailComponent },
    { path: 'adio/resources', component: ResourcesComponent },
    { path: 'adio/notifications', component: NotificationsComponent },
    { path: 'adio/profile-settings', component: ProfileSettingsComponent },
    
    // Legacy routes (can be removed later)
    { path: 'dashboard', component: DashboardComponent },
    { path: 'applications', component: ApplicationsComponent },
    { path: 'applications/:id', component: ApplicationDetailComponent },
    { path: 'resources', component: ResourcesComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'profile-settings', component: ProfileSettingsComponent },
];
