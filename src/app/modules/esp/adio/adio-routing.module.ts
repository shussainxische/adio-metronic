import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdioComponent } from './adio.component';
import { ApplicationsComponent } from '../components/applications/applications.component';
import { ApplicationDetailComponent } from '../components/application-detail/application-detail.component';

const routes: Routes = [

  { path: '', component: AdioComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: ApplicationsComponent },
  { path: 'applications/:id', component: ApplicationDetailComponent },
  // { path: 'resources', component: ResourcesComponent },
  // { path: 'notifications', component: NotificationsComponent },
  // { path: 'profile-settings', component: ProfileSettingsComponent },

  /** Load CB Submodule */
  // {
  //   path: 'tenders',
  //   loadChildren: () => import('./cb/tenders.module').then(m => m.TendersModule)
  // },

  /** Load ADIO Submodule */
  // {
  //   path: 'land-bank',
  //   loadChildren: () => import('./adio/land-bank.module').then(m => m.LandBankModule)
  // },
  // {
  //   path: 'post-contract',
  //   loadChildren: () => import('../musataha/post-contract/post-contract.module').then(m => m.PostContractModule)
  // }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EspRoutingModule { }
