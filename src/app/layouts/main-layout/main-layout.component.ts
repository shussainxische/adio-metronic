import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OnInit, AfterViewInit } from '@angular/core';
import KTComponents from '../../../metronic/core/index';
import KTLayout from '../../../metronic/app/layouts/demo1';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppLauncherService } from '../../services/app-launcher/app-launcher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, HeaderComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  host: {
    class:
      /* 'antialiased flex min-h-full h-auto text-base text-gray-700 [--tw-page-bg:#fefefe] [--tw-page-bg-dark:var(--tw-coal-500)] demo1 sidebar-fixed header-fixed bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]', */
      'antialiased flex min-h-full h-auto text-base text-gray-700 [--tw-page-bg:#fefefe] [--tw-page-bg-dark:var(--tw-coal-500)] demo1 sidebar-fixed header-fixed bg-surface',
  },
})
export class MainLayoutComponent implements AfterViewInit {
  launcherActive = false;
  private subscription: Subscription;
  constructor(private appLauncherService: AppLauncherService) {}
    ngOnInit(): void {
    this.subscription = this.appLauncherService.launcherActive$.subscribe(isActive => {
      this.launcherActive = isActive;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    KTComponents.init();
    KTLayout.init();
  }
}
