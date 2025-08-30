import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApplicationSummaryItem {
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

export interface ApplicationsSummaryResponse {
  data: ApplicationSummaryItem[];
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable()
export abstract class BaseApplicationsSummaryService {
  
  abstract getApplicationsSummary(): Observable<ApplicationsSummaryResponse>;
  
  abstract getApplicationsSummaryByStage(stage: string): Observable<ApplicationSummaryItem[]>;
  
  abstract getApplicationsSummaryBySubStage(subStage: string): Observable<ApplicationSummaryItem[]>;
  
  abstract getApplicationsSummaryByAppType(appType: string): Observable<ApplicationSummaryItem[]>;
  
  abstract getApplicationsSummaryByCompany(companyName: string): Observable<ApplicationSummaryItem[]>;
  
  abstract getApplicationSummaryById(appId: number): Observable<ApplicationSummaryItem | undefined>;
}