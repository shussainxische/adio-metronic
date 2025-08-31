import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { 
  BaseApplicationsSummaryService, 
  ApplicationSummaryItem, 
  ApplicationsSummaryResponse 
} from './base-applications-summary.service';
import { environment } from '../../environments/environment';

@Injectable()
export class RealApplicationsSummaryService extends BaseApplicationsSummaryService {
  private apiUrl = `${environment.apiBaseUrl}/Application/get-applications-summary`;

  constructor(private http: HttpClient) { 
    super(); 
  }

  getApplicationsSummary(): Observable<ApplicationsSummaryResponse> {
    return this.http.get<ApplicationsSummaryResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplicationsSummaryByStage(stage: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      this.getApplicationsSummary().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const filteredItems = response.data.filter(item => 
              item.wfStgName.toLowerCase() === stage.toLowerCase()
            );
            observer.next(filteredItems);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications summary'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsSummaryBySubStage(subStage: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      this.getApplicationsSummary().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const filteredItems = response.data.filter(item => 
              item.wfSubstgName.toLowerCase() === subStage.toLowerCase()
            );
            observer.next(filteredItems);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications summary'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsSummaryByAppType(appType: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      this.getApplicationsSummary().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const filteredItems = response.data.filter(item => 
              item.appTypeName.toLowerCase() === appType.toLowerCase()
            );
            observer.next(filteredItems);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications summary'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationsSummaryByCompany(companyName: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      this.getApplicationsSummary().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const filteredItems = response.data.filter(item => 
              item.invCompanyName.toLowerCase().includes(companyName.toLowerCase())
            );
            observer.next(filteredItems);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications summary'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getApplicationSummaryById(appId: number): Observable<ApplicationSummaryItem | undefined> {
    return new Observable(observer => {
      this.getApplicationsSummary().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const application = response.data.find(item => item.appId === appId);
            observer.next(application);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load applications summary'));
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
    
    console.error('RealApplicationsSummaryService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}