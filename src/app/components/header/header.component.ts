import {
  Component,
  ElementRef,
  ViewChild,
  TemplateRef,
  HostListener,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
// import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfilePictureComponent } from '../ui/profile-picture/profile-picture.component';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../ui/input/input.component';
import { IconWrapperComponent } from '../ui/icon-wrapper/icon-wrapper.component';
import { AdioLogoComponent } from '../adio-logo/adio-logo.component';
// import { FormPopupComponent } from '../form-popup/form-popup.component';
import Swal from 'sweetalert2';
// import { SweetAlertService } from '../../services/sweet-alert.service';
import { AppLauncherService } from '../../services/app-launcher/app-launcher.service';
import { Subject, Subscription } from 'rxjs';
import { MenuDropdownComponent } from '../ui/menu/menu-dropdown/menu-dropdown.component';
import { DropdownWrapperComponent } from '../../wrappers/dropdown-wrapper/dropdown-wrapper.component';
import { AdioButtonComponent } from '../ui/adio-button/adio-button.component';
import { BackComponentComponent } from '../ui/back-component/back-component.component';
// import { NavigationService } from '../../navigation.service';
import { TranslateModule } from '@ngx-translate/core';

// Add interface for Application
interface Application {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: '[app-header]',
  imports: [
    LanguageSwitcherComponent,
    ProfilePictureComponent,
    CommonModule,
    // InputComponent,
    IconWrapperComponent,
    AdioLogoComponent,
    MenuDropdownComponent,
    DropdownWrapperComponent,
    AdioButtonComponent,
    BackComponentComponent,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  photoUrl = '';
  profilePictureExist = true;
  authenitcationRes: AuthenticationResult;

  // Add applications properties
  applications: Application[] = [];
  featuredApps: Application[] = [];
  hasMoreApps = false; // To show "View All" button

  // Keep original properties
  showAppLauncher = false;
  appLauncherMenuOpening = false;
  launcherActive = false;

  // Add SortMenuComponent pattern properties
  showDropdown = false;
  menuOpening = false;
  dropdownWidth = '486px';
  dropdownWidthCalculated = false;
  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  // Keep original ViewChild references
  @ViewChild('profileContent') profileContent: ElementRef;
  @ViewChild('profileDropdown') profileDropdown: ElementRef;
  @ViewChild('appLauncherTemplate') appLauncherTemplate: TemplateRef<any>;
  @ViewChild('appLauncherDropdown') appLauncherDropdown: ElementRef;

  // Add SortMenuComponent ViewChild references
  @ViewChild('parentWrapper') parentWrapper: ElementRef;
  @ViewChild('menuDropdownWrapper') menuDropdownWrapper: ElementRef;

  selectedApplication: Application | null = null;
  private selectedApplicationSubscription: Subscription;

  constructor(
    // private msalService: MsalService,
    // private authService: AuthService,
    private router: Router,
    // private nav: NavigationService,
    // private sweetAlertService: SweetAlertService,
    private appLauncherService: AppLauncherService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    // this.msalService.initialize().subscribe();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadApplications();
    this.selectedApplicationSubscription =
      this.appLauncherService.selectedApplication$.subscribe((application) => {
        this.selectedApplication = application;

        // If no application is selected, or if the selected application doesn't exist in the available applications
        if (
          !application ||
          !this.applications.find((app) => app.id === application.id)
        ) {
          this.launcherActive = true;
          this.appLauncherService.setLauncherActive(true);
        }
      });
  }

  ngAfterViewInit() {
    this.setupThemeToggle();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.selectedApplicationSubscription) {
      this.selectedApplicationSubscription.unsubscribe();
    }
  }
  isAppSelected(app: Application): boolean {
    return this.selectedApplication?.id === app.id;
  }

  // Add method to load applications
  private loadApplications(): void {
    // Get applications directly from localStorage with key 'applications'
    const storedApplications = localStorage.getItem('applications');
    // Get navigation menu to filter applications
    const storedNavigationMenu = localStorage.getItem('navigationMenu');

    let allApplications: Application[] = [];

    if (storedApplications) {
      try {
        allApplications = JSON.parse(storedApplications);
      } catch (e) {
        console.error('Failed to parse stored applications', e);
        allApplications = [];
      }
    }

    if (storedNavigationMenu && allApplications.length > 0) {
      try {
        const navigationMenu = JSON.parse(storedNavigationMenu);
        // Extract application IDs from navigation hierarchy
        const applicationIdsInNavigation =
          this.extractApplicationIdsFromNavigation(navigationMenu);

        // Filter applications to only include those present in navigation
        this.applications = allApplications
          .filter((app) => applicationIdsInNavigation.includes(app.id))
          .filter((app) => app.name !== 'Shared');
      } catch (e) {
        console.error('Failed to parse stored navigation menu', e);
        // If navigation parsing fails, show no applications for security
        this.applications = [];
      }
    } else {
      // If no navigation menu or no applications, show empty array
      this.applications = [];
    }

    this.featuredApps = this.applications.slice(0, 3);
    this.hasMoreApps = this.applications.length > 3;
  }

  // Helper method to recursively extract application IDs from navigation hierarchy
  private extractApplicationIdsFromNavigation(
    navigationItems: any[]
  ): string[] {
    const applicationIds: string[] = [];

    if (!navigationItems || !Array.isArray(navigationItems)) {
      return applicationIds;
    }

    for (const item of navigationItems) {
      // Check if this navigation item has applications
      if (item.applications && Array.isArray(item.applications)) {
        for (const app of item.applications) {
          if (app.id && !applicationIds.includes(app.id)) {
            applicationIds.push(app.id);
          }
        }
      }

      // Recursively check children
      if (item.children && Array.isArray(item.children)) {
        const childApplicationIds = this.extractApplicationIdsFromNavigation(
          item.children
        );
        for (const id of childApplicationIds) {
          if (!applicationIds.includes(id)) {
            applicationIds.push(id);
          }
        }
      }
    }

    return applicationIds;
  }

  // Add SortMenuComponent methods
  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.showDropdown) {
          this.applyDropdownWidth();
        }
      });
      if (this.parentWrapper?.nativeElement) {
        this.resizeObserver.observe(this.parentWrapper.nativeElement);
      }
    }
  }

  applyDropdownWidth(): void {
    setTimeout(() => {
      if (this.menuDropdownWrapper?.nativeElement) {
        const menuDropdown =
          this.menuDropdownWrapper.nativeElement.querySelector(
            '.menu-dropdown'
          );
        if (menuDropdown) {
          this.renderer.setStyle(menuDropdown, 'width', this.dropdownWidth);
          this.renderer.setStyle(menuDropdown, 'max-width', this.dropdownWidth);
        }
      }
    }, 0);
  }

  toggleDropdown(): void {
    if (!this.showDropdown) {
      this.applyDropdownWidth();
      setTimeout(() => {
        this.menuOpening = true;
        this.showDropdown = true;
      }, 0);
    } else {
      this.menuOpening = false;
      this.showDropdown = false;
    }
  }

  // Updated to accept Application object
  onAppOptionClick(app: Application): void {
    this.showDropdown = false;
    this.launcherActive = false;
    this.appLauncherService.setLauncherActive(false);

    // Set the selected application in the service
    this.appLauncherService.setSelectedApplication(app);

    // Use the predefined route mapping
    const route = this.applicationRoutesByName[app.name];

    if (route) {
      // this.nav.navigateTo([route]);
    }

    // Force close by clicking outside to trigger the document:click handler
    setTimeout(() => {
      document.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }, 0);
  }

  private loadUserData(): void {
    const savedAuthRes = localStorage.getItem('authenticationResult');
    const savedProfilePictureExist = localStorage.getItem(
      'profilePictureExist'
    );
    const savedPhotoUrl = localStorage.getItem('photoUrl');

    if (savedAuthRes) {
      try {
        this.authenitcationRes = JSON.parse(savedAuthRes);
      } catch (e) {
        console.error('Failed to parse saved authentication result', e);
      }
    }

    if (savedProfilePictureExist !== null) {
      this.profilePictureExist = savedProfilePictureExist === 'true';
    }

    if (savedPhotoUrl) {
      this.photoUrl = savedPhotoUrl;
    }

    this.fetchUserProfile();
  }

  private fetchUserProfile(): void {
    // const activeAccount = this.msalService.instance.getActiveAccount();

    // this.msalService.instance
    //   .acquireTokenSilent({
    //     scopes: ['user.read'],
    //     account: activeAccount,
    //   })
    //   .then((response) => {
    //     this.authenitcationRes = response;
    //     localStorage.setItem('authenticationResult', JSON.stringify(response));

    //     // Make Graph API call for photo
    //     fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
    //       headers: {
    //         Authorization: `Bearer ${response.accessToken}`,
    //       },
    //     })
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error('No image found');
    //         }
    //         const contentType = response.headers.get('content-type');
    //         if (!contentType || !contentType.includes('image')) {
    //           throw new Error('Invalid image');
    //         }
    //         return response.blob();
    //       })
    //       .then((blob) => {
    //         this.photoUrl = URL.createObjectURL(blob);
    //         this.profilePictureExist = true;
    //         localStorage.setItem('photoUrl', this.photoUrl);
    //         localStorage.setItem('profilePictureExist', 'true');
    //       })
    //       .catch((error) => {
    //         this.profilePictureExist = false;
    //         localStorage.setItem('profilePictureExist', 'false');
    //       });
    //   });
  }

  private setupThemeToggle(): void {
    const defaultThemeMode = 'light';
    let themeMode =
      localStorage.getItem('theme') ||
      document.documentElement.getAttribute('data-theme-mode') ||
      defaultThemeMode;

    if (themeMode === 'system') {
      themeMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    // Update checkbox state based on current theme
    const themeToggle = document.querySelector(
      '[data-theme-toggle="true"]'
    ) as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = themeMode === 'dark';
    }
  }

  async logout() {
    // this.authService.logout().subscribe({
    //   next: () => {},
    //   error: (err) => {
    //     console.error('Logout failed', err);
    //   },
    // });

    // this.msalService.logout().subscribe({
    //   next: () => {
    //     this.router.navigate(['/login']);
    //   },
    //   error: () => {
    //     this.router.navigate(['/login']);
    //   },
    // });
  }

  refreshUserSession(): void {
    // this.authService.refreshToken().subscribe({
    //   next: (response) => {
    //     if (response.isSuccess) {
    //       // Success handler
    //     } else {
    //       this.authService.logout();
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Token refresh error:', err);
    //     this.authService.logout();
    //   },
    // });
  }

  onSearch(value: string) {
    // Search implementation
  }

  // Updated App Launcher Methods
  toggleAppLauncher(): void {
    this.toggleDropdown();
  }

  // Updated to accept Application object
  navigateToApp(app: Application): void {
    this.onAppOptionClick(app);
  }

  viewAllApps(): void {
    // Close the dropdown
    this.showDropdown = false;
    this.menuOpening = false;

    // Show the full-screen launcher
    this.launcherActive = true;
    this.appLauncherService.setLauncherActive(true);

    // Force close the dropdown by dispatching a click event outside
    // This ensures any internal dropdown state is also reset
    setTimeout(() => {
      document.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }, 0);
  }

  // Legacy method to maintain compatibility
  openAppLauncher(): void {
    this.toggleDropdown();
  }

  closeFullscreenLauncher(): void {
    this.launcherActive = false;
    this.appLauncherService.setLauncherActive(false);
  }

  private applicationRoutesByName: { [key: string]: string } = {
    Musataha: 'musataha/tenders/list',
    Retail: 'retail/list',
    Tasks: 'tasks',
  };
}
