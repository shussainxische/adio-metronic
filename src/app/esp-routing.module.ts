import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspComponent } from './esp/esp.component';
import { ROUTE_CONFIG } from 'src/app/core/constants/route-config';

const routes: Routes = [

  { path: '', component: EspComponent },

  /** Load CB Submodule */
  {
    path: ROUTE_CONFIG.cb.path,
    loadChildren: () => import('./esp/cb/cb.module').then(m => m.CBModule)
  },

  /** Load ADIO Submodule */
  {
    path: ROUTE_CONFIG.adio.path,
    loadChildren: () => import('./esp/adio/adio.module').then(m => m.ADIOModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EspRoutingModule { }


// import { AuditComponent } from '../settings/audit/list/audit.component';
// import { ApplicationsComponent } from './applications/applications.component';
// import { ApplicationDetailComponent } from './application-detail/application-detail.component';

// { path: 'dashboard', component: DashboardComponent },
// { path: 'applications', component: ApplicationsComponent },
// { path: 'applications/:id', component: ApplicationDetailComponent },
// { path: 'resources', component: ResourcesComponent },
// { path: 'notifications', component: NotificationsComponent },
// { path: 'profile-settings', component: ProfileSettingsComponent },
