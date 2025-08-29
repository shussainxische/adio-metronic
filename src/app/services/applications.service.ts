import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
 
export interface ApplicationData {
  appId: number;
  wfStgName: string;
  wfSubstgName: string;
  appReferenceNumber: string;
  appTypeName: string;
  invCompanyName: string;
  appIsElectricity: boolean;
  appIsGas: boolean;
  wfSubstgProgress: number;
}
 
export interface ApplicationsResponse {
  data: ApplicationData[];
  errors: string[];
  responseTime: string;
  isSuccess: boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = 'http://localhost:5297/api/Application/cb-get-applications';
  private applicationsSubject = new BehaviorSubject<ApplicationData[]>([]);
 
  constructor(private http: HttpClient) {}
 
  loadApplications(): Observable<ApplicationData[]> {
    return this.http.get<ApplicationsResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.isSuccess) {
          const applications = response.data;
          this.applicationsSubject.next(applications);
          return applications;
        }
        throw new Error('Failed to load applications');
      })
    );
  }
 
  getApplications(): Observable<ApplicationData[]> {
    return this.applicationsSubject.asObservable();
  }
 
  getCurrentApplications(): ApplicationData[] {
    return this.applicationsSubject.value;
  }
 
  getApplicationById(appId: number): ApplicationData | undefined {
    return this.getCurrentApplications().find(app => app.appId === appId);
  }
 
  getApplicationsByStage(stageName: string): ApplicationData[] {
    return this.getCurrentApplications().filter(app => app.wfStgName === stageName);
  }
 
  getApplicationsBySubStage(subStageName: string): ApplicationData[] {
    return this.getCurrentApplications().filter(app => app.wfSubstgName === subStageName);
  }
 
  getApplicationsByType(appTypeName: string): ApplicationData[] {
    return this.getCurrentApplications().filter(app => app.appTypeName === appTypeName);
  }
 
  getApplicationCountByStage(stageName: string): number {
    return this.getApplicationsByStage(stageName).length;
  }
 
  getApplicationCountBySubStage(subStageName: string): number {
    return this.getApplicationsBySubStage(subStageName).length;
  }
 
  getUniqueStages(): string[] {
    const applications = this.getCurrentApplications();
    return [...new Set(applications.map(app => app.wfStgName))];
  }
 
  getUniqueSubStages(): string[] {
    const applications = this.getCurrentApplications();
    return [...new Set(applications.map(app => app.wfSubstgName))];
  }
 
  getUniqueAppTypes(): string[] {
    const applications = this.getCurrentApplications();
    return [...new Set(applications.map(app => app.appTypeName))];
  }
 
  getApplicationCategories(app: ApplicationData): string[] {
    const categories: string[] = [];
    if (app.appIsElectricity) categories.push('Electricity');
    if (app.appIsGas) categories.push('Gas');
    return categories.length > 0 ? categories : ['Electricity']; // Default to Electricity
  }
 
  // Helper method to convert API data to the format expected by the existing component
  convertToLegacyFormat(apiApp: ApplicationData): any {
    return {
      id: apiApp.appId.toString(),
      companyName: apiApp.invCompanyName,
      stage: apiApp.wfStgName,
      status: apiApp.wfSubstgName,
      progress: apiApp.wfSubstgProgress,
      companyType: apiApp.appTypeName.toLowerCase().replace(/\s+/g, '-'),
      category: this.getApplicationCategories(apiApp).join(', '),
      referenceNumber: apiApp.appReferenceNumber,
      // Add default values for fields not provided by API
      assignee: 'ADIO', // Default assignee
      deadline: null, // No deadline in API response
      submissionDate: new Date().toISOString(), // Default to current date
      lastUpdated: new Date().toISOString()
    };
  }
 
  // Convert all applications to legacy format for compatibility
  convertAllToLegacyFormat(): any[] {
    return this.getCurrentApplications().map(app => this.convertToLegacyFormat(app));
  }
}