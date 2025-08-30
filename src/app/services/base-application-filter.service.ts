import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable()
export abstract class BaseApplicationFilterService {
  
  abstract getApplicationFilters(): Observable<ApplicationFiltersResponse>;
  
  abstract getAppTypes(): Observable<AppType[]>;
  
  abstract getStages(): Observable<Stage[]>;
  
  abstract getStageById(stageId: number): Observable<Stage | undefined>;
  
  abstract getSubStageById(subStageId: number): Observable<SubStage | undefined>;
  
  abstract getStageColor(stageName: string): Observable<string>;
  
  abstract getSubStageColor(subStageName: string): Observable<string>;
  
  abstract getStageIcon(stageName: string): Observable<string>;
  
  abstract getSubStageIcon(subStageName: string): Observable<string>;
}