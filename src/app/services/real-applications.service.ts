import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { 
  BaseApplicationsService, 
  ApplicationItem, 
  ApplicationsResponse 
} from './base-applications.service';

@Injectable()
export class RealApplicationsService extends BaseApplicationsService {
  private apiUrl = 'http://localhost:5297/api/Application/cb-get-applications';

  constructor(private http: HttpClient) { 
    super(); 
  }

  getApplications(): Observable<ApplicationsResponse> {
    return this.http.get<ApplicationsResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplicationById(id: string): Observable<ApplicationItem | undefined> {
    return new Observable(observer => {
      this.getApplications().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.applications) {
            const application = response.data.applications.find(app => app.id === id);
            observer.next(application);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsByStage(stage: string): Observable<ApplicationItem[]> {
    return new Observable(observer => {
      this.getApplications().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.applications) {
            const filteredApps = response.data.applications.filter(app => 
              app.stage.toLowerCase() === stage.toLowerCase()
            );
            observer.next(filteredApps);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsByStatus(status: string): Observable<ApplicationItem[]> {
    return new Observable(observer => {
      this.getApplications().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.applications) {
            const filteredApps = response.data.applications.filter(app => 
              app.status.toLowerCase() === status.toLowerCase()
            );
            observer.next(filteredApps);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsByAssignee(assignee: string): Observable<ApplicationItem[]> {
    return new Observable(observer => {
      this.getApplications().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.applications) {
            const filteredApps = response.data.applications.filter(app => 
              app.assignee.toLowerCase() === assignee.toLowerCase()
            );
            observer.next(filteredApps);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('RealApplicationsService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}