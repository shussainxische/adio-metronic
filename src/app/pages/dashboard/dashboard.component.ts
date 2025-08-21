import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageWrapperComponent } from '../../wrappers/page-wrapper/page-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { RecentTasksComponent } from './all widgets/recent-tasks/recent-tasks.component';
import { QuickAccessComponent } from './all widgets/quick-access/quick-access.component';
import { TaskDistributionComponent } from './all widgets/task-distribution/task-distribution.component';
import { UpcomingDeadlinesComponent } from './all widgets/upcoming-deadlines/upcoming-deadlines.component';
import { SystemAnnouncementComponent } from './all widgets/system-announcement/system-announcement.component';
import { TeamActivitesComponent } from './all widgets/team-activites/team-activites.component';
import { TasksComponent } from './all widgets/tasks/tasks.component';
import { TendersComponent } from './all widgets/tenders/tenders.component';
import { LandbankComponent } from './all widgets/landbank/landbank.component';
import { RecentActivitiesComponent } from './all widgets/recent-activites/recent-activites.component';
import { AuthService } from '../../services/auth/auth.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RecentTasksComponent,
    RecentActivitiesComponent,
    RouterModule,
    PageWrapperComponent,
    TranslateModule,
    PageHeaderComponent,
    TasksComponent,
    TendersComponent,
    LandbankComponent,
    QuickAccessComponent,
    TaskDistributionComponent,
    UpcomingDeadlinesComponent,
    SystemAnnouncementComponent,
    TeamActivitesComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  userData: any;
  userRoles: string[] = [];

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
  this.userRoles = this.authService.getRoles(); 
  console.log('Roles from localStorage:', this.authService.getRoles());

}

  hasTenderRole(): boolean {
    return this.userRoles.includes('Tender_Admin')
         
  }
  haslandRole():boolean{
          return this.userRoles.includes('Land_Bank_Admin') ||
           this.userRoles.includes('Land_Bank_User');
  }
   hassuperAdminRole(): boolean {
        return this.userRoles.includes('super_admin');

  }
}
