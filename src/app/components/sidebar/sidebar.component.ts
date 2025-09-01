import { Component, OnInit, OnDestroy } from '@angular/core';
import KTComponents from '../../../metronic/core/index';
import KTLayout from '../../../metronic/app/layouts/demo1';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavItem } from '../../models/auth.model';
// import { NavigationService } from '../../navigation.service';
import { IconWrapperComponent } from "../ui/icon-wrapper/icon-wrapper.component";
import { PageWrapperComponent } from "../../wrappers/page-wrapper/page-wrapper.component";
import { Subscription } from 'rxjs';
import { AppLauncherService } from '../../services/app-launcher/app-launcher.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';

// Define the Application interface
interface Application {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, IconWrapperComponent, PageWrapperComponent,TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  launcherActive = false;
  launcherHover = false;
  sideNavPages: NavItem[] = [];
  selectedApplication: Application | null = null;
  private selectedApplicationSubscription: Subscription;

  // Notification properties
  unreadNotificationCount: number = 0;
  private unreadCountSubscription: Subscription;

  constructor(
    // public nav: NavigationService,
    private appLauncherService: AppLauncherService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Subscribe to selected application changes
    this.selectedApplicationSubscription = this.appLauncherService.selectedApplication$.subscribe(
      (application) => {
        this.selectedApplication = application;
        this.loadAndFilterNavigationMenu();
      }
    );

    // Initial load
    this.loadAndFilterNavigationMenu();

    // Subscribe to notification unread count
    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(
      count => {
        this.unreadNotificationCount = count;
      }
    );
  }

  ngOnDestroy() {
    if (this.selectedApplicationSubscription) {
      this.selectedApplicationSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }

  private loadAndFilterNavigationMenu(): void {
    const menu = JSON.parse(localStorage.getItem("navigationMenu") || 'null');
    if (menu) {
      this.sideNavPages = this.filterLeafNodes(menu);
    } else {
      // Load menu from JSON file
      this.loadMenuFromFile();
    }
  }

  private loadMenuFromFile(): void {
    this.http.get<{sideNavPages: NavItem[]}>('assets/mock-data/sidebar-menu.json')
      .subscribe({
        next: (data) => {
          this.sideNavPages = this.filterLeafNodes(data.sideNavPages);
        },
        error: (error) => {
          console.error('Error loading sidebar menu:', error);
          // Fallback to empty array if loading fails
          this.sideNavPages = [];
        }
      });
  }

  private filterLeafNodes(items: any[]): any[] {
    if (!items) return [];

    return items.map(item => {
      // If item has children, recursively filter them first
      if (item.children && item.children.length > 0) {
        const filteredChildren = this.filterLeafNodes(item.children);
        // If after filtering, there are no valid children, don't include this parent
        if (filteredChildren.length === 0) {
          return null;
        }
        // Return the parent with filtered children
        return {
          ...item,
          children: filteredChildren
        };
      } else {
        // This is a leaf node - filter based on selected application
        const hasMatchingApp = this.hasMatchingApplication(item);
        return hasMatchingApp ? item : null;
      }
    }).filter(item => item !== null);
  }

  private hasMatchingApplication(item: any): boolean {
    if (!item.applications || !Array.isArray(item.applications)) {
      return false;
    }

    // If no application is selected, show default applications (Musataha, Shared)
    if (!this.selectedApplication) {
      return item.applications.some((app: any) =>
        app.name === "Musataha" || app.name === "Shared"
      );
    }

    // If an application is selected, show items that have that application
    return item.applications.some((app: any) =>
      app.name === this.selectedApplication?.name ||
      app.id === this.selectedApplication?.id ||
      app.name === "Shared" // Always include shared items
    );
  }

  get sidebarClasses(): string {
    const baseClasses = 'sidebar bg-surface-header-and-sider border-e border-e-gray-200 dark:border-e-coal-100 fixed z-20 hidden lg:flex flex-col items-stretch shrink-0 max-h-[100vh] h-screen lg:!z-10';
    return baseClasses;
  }

  isNotificationsPage(item: any): boolean {
    return item.pageCode === '/notifications' || item.label === 'notifications';
  }

  toggleTheme(isDarkMode: boolean) {
    this.isDarkMode = isDarkMode;
  }

  ngAfterViewInit(): void {
    // KTComponents.init();
    // KTLayout.init();
  }
}
