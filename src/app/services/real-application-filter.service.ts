import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { 
  BaseApplicationFilterService, 
  AppType, 
  Stage, 
  SubStage, 
  ApplicationFiltersResponse 
} from './base-application-filter.service';

@Injectable()
export class RealApplicationFilterService extends BaseApplicationFilterService {
  private apiUrl = 'https://localhost:44354/api/Application/cb-get-application-filters';

  constructor(private http: HttpClient) { 
    super(); 
  }

  getApplicationFilters(): Observable<ApplicationFiltersResponse> {
    return this.http.get<ApplicationFiltersResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAppTypes(): Observable<AppType[]> {
    return new Observable(observer => {
      this.getApplicationFilters().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.appTypes) {
            observer.next(response.data.appTypes);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load application types'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getStages(): Observable<Stage[]> {
    return new Observable(observer => {
      this.getApplicationFilters().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data?.stages) {
            observer.next(response.data.stages);
            observer.complete();
          } else {
            observer.error(new Error('Failed to load stages'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getStageById(stageId: number): Observable<Stage | undefined> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          const stage = stages.find(s => s.wfStgId === stageId);
          observer.next(stage);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getSubStageById(subStageId: number): Observable<SubStage | undefined> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          let foundSubStage: SubStage | undefined;
          for (const stage of stages) {
            foundSubStage = stage.subStages.find(ss => ss.wfSubstgId === subStageId);
            if (foundSubStage) break;
          }
          observer.next(foundSubStage);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getStageColor(stageName: string): Observable<string> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          const stage = stages.find(s => s.wfStgName.toLowerCase() === stageName.toLowerCase());
          observer.next(stage?.wfStgColor || '#9B9B9B');
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getSubStageColor(subStageName: string): Observable<string> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          let foundColor = '#9B9B9B';
          for (const stage of stages) {
            const subStage = stage.subStages.find(ss => 
              ss.wfSubstgName.toLowerCase() === subStageName.toLowerCase()
            );
            if (subStage) {
              foundColor = subStage.wfSubstgColor;
              break;
            }
          }
          observer.next(foundColor);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getStageIcon(stageName: string): Observable<string> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          const stage = stages.find(s => s.wfStgName.toLowerCase() === stageName.toLowerCase());
          observer.next(stage?.wfStgIcon || 'fa-file');
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getSubStageIcon(subStageName: string): Observable<string> {
    return new Observable(observer => {
      this.getStages().subscribe({
        next: (stages) => {
          let foundIcon = 'fa-file';
          for (const stage of stages) {
            const subStage = stage.subStages.find(ss => 
              ss.wfSubstgName.toLowerCase() === subStageName.toLowerCase()
            );
            if (subStage) {
              foundIcon = subStage.wfSubstgIcon;
              break;
            }
          }
          observer.next(foundIcon);
          observer.complete();
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
    
    console.error('RealApplicationFilterService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}