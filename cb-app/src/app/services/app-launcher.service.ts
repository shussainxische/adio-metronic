import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define the Application interface
interface Application {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppLauncherService {
  private launcherActiveSubject = new BehaviorSubject<boolean>(false);
  private selectedApplicationSubject = new BehaviorSubject<Application | null>(null);

  // Existing launcher state observables
  launcherActive$ = this.launcherActiveSubject.asObservable();

  // New selected application observables
  selectedApplication$ = this.selectedApplicationSubject.asObservable();

  constructor() {
    // Load the previously selected application from localStorage on service initialization
    this.loadSelectedApplicationFromStorage();
  }

  // Existing methods
  setLauncherActive(isActive: boolean): void {
    this.launcherActiveSubject.next(isActive);
  }

  // New methods for selected application
  setSelectedApplication(application: Application | null): void {
    this.selectedApplicationSubject.next(application);

    // Persist to localStorage
    if (application) {
      localStorage.setItem('selectedApplication', JSON.stringify(application));
    } else {
      localStorage.removeItem('selectedApplication');
    }
  }

  private loadSelectedApplicationFromStorage(): void {
    const storedApp = localStorage.getItem('selectedApplication');
    if (storedApp) {
      try {
        const application = JSON.parse(storedApp);
        this.selectedApplicationSubject.next(application);
      } catch (e) {
        console.error('Failed to parse stored selected application', e);
        localStorage.removeItem('selectedApplication');
      }
    }
  }
}
