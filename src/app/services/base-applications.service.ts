import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApplicationItem {
  id: string;
  companyName: string;
  companyType: string;
  stage: string;
  status: string;
  progress: number;
  date: string;
  deadline?: string;
  category?: string;
  assignee: string;
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  applicationDate: string;
  applicationType: string;
  entityType: string;
  services: string[];
  compliance: string;
  issueDate?: string;
  expiryDate?: string;
  rejectionReason?: string;
  cancellationReason?: string;
}

export interface ApplicationsResponse {
  data: {
    applications: ApplicationItem[];
  };
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable()
export abstract class BaseApplicationsService {
  
  abstract getApplications(): Observable<ApplicationsResponse>;
  
  abstract getApplicationById(id: string): Observable<ApplicationItem | undefined>;
  
  abstract getApplicationsByStage(stage: string): Observable<ApplicationItem[]>;
  
  abstract getApplicationsByStatus(status: string): Observable<ApplicationItem[]>;
  
  abstract getApplicationsByAssignee(assignee: string): Observable<ApplicationItem[]>;
}