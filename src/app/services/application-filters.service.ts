import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AppType {
  appTypeId: number;
  appTypeName: string;
}

export interface SubStage {
  wfSubstgId: number;
  wfStgId: number;
  wfSubstgName: string;
  wfSubstgColor: string;
  wfSubstgIcon: string;
  wfSubstgSortId: number;
}

export interface Stage {
  wfStgId: number;
  serviceId: number;
  wfStgName: string;
  wfStgColor: string;
  wfStgIcon: string;
  wfStgSortId: number;
  subStages: SubStage[];
}

export interface ApplicationFiltersResponse {
  data: {
    appTypes: AppType[];
    stages: Stage[];
  };
  errors: string[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationFiltersService {
  private apiUrl = 'http://localhost:5297/api/Application/cb-get-application-filters';
  private filtersSubject = new BehaviorSubject<{ appTypes: AppType[], stages: Stage[] }>({ appTypes: [], stages: [] });
  
  constructor(private http: HttpClient) {}

  loadFilters(): Observable<{ appTypes: AppType[], stages: Stage[] }> {
    return this.http.get<ApplicationFiltersResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.isSuccess) {
          const filters = response.data;
          this.filtersSubject.next(filters);
          return filters;
        }
        throw new Error('Failed to load application filters');
      })
    );
  }

  getFilters(): Observable<{ appTypes: AppType[], stages: Stage[] }> {
    return this.filtersSubject.asObservable();
  }

  getCurrentFilters(): { appTypes: AppType[], stages: Stage[] } {
    return this.filtersSubject.value;
  }

  getAppTypes(): AppType[] {
    return this.getCurrentFilters().appTypes;
  }

  getStages(): Stage[] {
    return this.getCurrentFilters().stages;
  }

  getStageById(stageId: number): Stage | undefined {
    return this.getStages().find(stage => stage.wfStgId === stageId);
  }

  getSubStageById(subStageId: number): SubStage | undefined {
    for (const stage of this.getStages()) {
      const subStage = stage.subStages.find(sub => sub.wfSubstgId === subStageId);
      if (subStage) return subStage;
    }
    return undefined;
  }

  getAppTypeOptions() {
    const appTypes = this.getAppTypes();
    return [
      { label: 'All Types', value: 'all' },
      ...appTypes.map(type => ({ 
        label: type.appTypeName, 
        value: type.appTypeId.toString() 
      }))
    ];
  }

  getStageColor(stageName: string): string {
    const stage = this.getStages().find(s => s.wfStgName === stageName);
    return stage?.wfStgColor || '#4A90E2';
  }

  getSubStageColor(subStageName: string): string {
    for (const stage of this.getStages()) {
      const subStage = stage.subStages.find(sub => sub.wfSubstgName === subStageName);
      if (subStage) return subStage.wfSubstgColor;
    }
    return '#F5A623';
  }

  getStageIcon(stageName: string): string {
    const stage = this.getStages().find(s => s.wfStgName === stageName);
    return stage?.wfStgIcon || 'fa-file-text-o';
  }

  getSubStageIcon(subStageName: string): string {
    for (const stage of this.getStages()) {
      const subStage = stage.subStages.find(sub => sub.wfSubstgName === subStageName);
      if (subStage) return subStage.wfSubstgIcon;
    }
    return 'fa-clock-o';
  }
}