import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  BaseApplicationsSummaryService, 
  ApplicationSummaryItem, 
  ApplicationsSummaryResponse 
} from './base-applications-summary.service';

@Injectable()
export class MockApplicationsSummaryService extends BaseApplicationsSummaryService {

  constructor() { 
    super(); 
  }

  getApplicationsSummary(): Observable<ApplicationsSummaryResponse> {
    const mockData = this.getMockData();
    return of(mockData);
  }

  getApplicationsSummaryByStage(stage: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      const mockData = this.getMockData();
      const filteredItems = mockData.data.filter(item => 
        item.wfStgName.toLowerCase() === stage.toLowerCase()
      );
      observer.next(filteredItems);
      observer.complete();
    });
  }

  getApplicationsSummaryBySubStage(subStage: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      const mockData = this.getMockData();
      const filteredItems = mockData.data.filter(item => 
        item.wfSubstgName.toLowerCase() === subStage.toLowerCase()
      );
      observer.next(filteredItems);
      observer.complete();
    });
  }

  getApplicationsSummaryByAppType(appType: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      const mockData = this.getMockData();
      const filteredItems = mockData.data.filter(item => 
        item.appTypeName.toLowerCase() === appType.toLowerCase()
      );
      observer.next(filteredItems);
      observer.complete();
    });
  }

  getApplicationsSummaryByCompany(companyName: string): Observable<ApplicationSummaryItem[]> {
    return new Observable(observer => {
      const mockData = this.getMockData();
      const filteredItems = mockData.data.filter(item => 
        item.invCompanyName.toLowerCase().includes(companyName.toLowerCase())
      );
      observer.next(filteredItems);
      observer.complete();
    });
  }

  getApplicationSummaryById(appId: number): Observable<ApplicationSummaryItem | undefined> {
    return new Observable(observer => {
      const mockData = this.getMockData();
      const application = mockData.data.find(item => item.appId === appId);
      observer.next(application);
      observer.complete();
    });
  }

  private getMockData(): ApplicationsSummaryResponse {
    return {
      data: [
        {
          appId: 1,
          wfStgName: "RFQ",
          wfSubstgName: "pending",
          appReferenceNumber: "ESP-001",
          appTypeName: "Renewal",
          invCompanyName: "Al Dhafra Manufacturing LLC",
          appIsElectricity: true,
          appIsGas: false,
          wfSubstgProgress: 12.5
        },
        {
          appId: 2,
          wfStgName: "RFQ",
          wfSubstgName: "pending",
          appReferenceNumber: "ESP-002",
          appTypeName: "Renewal",
          invCompanyName: "Abu Dhabi Plastics Co.",
          appIsElectricity: true,
          appIsGas: true,
          wfSubstgProgress: 12.5
        },
        {
          appId: 3,
          wfStgName: "RFQ",
          wfSubstgName: "pending",
          appReferenceNumber: "ESP-003",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 12.5
        },
        {
          appId: 4,
          wfStgName: "RFQ",
          wfSubstgName: "submitted",
          appReferenceNumber: "ESP-004",
          appTypeName: "Enrollment",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 12.5
        },
        {
          appId: 5,
          wfStgName: "RFQ",
          wfSubstgName: "submitted",
          appReferenceNumber: "ESP-005",
          appTypeName: "Enrollment",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 30
        },
        {
          appId: 6,
          wfStgName: "RFQ",
          wfSubstgName: "submitted",
          appReferenceNumber: "ESP-006",
          appTypeName: "Enrollment",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 30
        },
        {
          appId: 7,
          wfStgName: "Evaluation",
          wfSubstgName: "In progress",
          appReferenceNumber: "ESP-007",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 8,
          wfStgName: "Evaluation",
          wfSubstgName: "In progress",
          appReferenceNumber: "ESP-008",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 9,
          wfStgName: "Evaluation",
          wfSubstgName: "In progress",
          appReferenceNumber: "ESP-009",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 10,
          wfStgName: "Evaluation",
          wfSubstgName: "Returned",
          appReferenceNumber: "ESP-010",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 11,
          wfStgName: "Evaluation",
          wfSubstgName: "Returned",
          appReferenceNumber: "ESP-011",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 12,
          wfStgName: "Evaluation",
          wfSubstgName: "Returned",
          appReferenceNumber: "ESP-012",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 25
        },
        {
          appId: 13,
          wfStgName: "Review",
          wfSubstgName: "initial review",
          appReferenceNumber: "ESP-013",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 50
        },
        {
          appId: 14,
          wfStgName: "Review",
          wfSubstgName: "final review",
          appReferenceNumber: "ESP-014",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 75
        },
        {
          appId: 15,
          wfStgName: "Close",
          wfSubstgName: "certified",
          appReferenceNumber: "ESP-015",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 100
        },
        {
          appId: 16,
          wfStgName: "Close",
          wfSubstgName: "not certified",
          appReferenceNumber: "ESP-016",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 100
        },
        {
          appId: 17,
          wfStgName: "Close",
          wfSubstgName: "expired",
          appReferenceNumber: "ESP-017",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 100
        },
        {
          appId: 18,
          wfStgName: "Close",
          wfSubstgName: "canceled",
          appReferenceNumber: "ESP-018",
          appTypeName: "Renewal",
          invCompanyName: "Ruwais Industrial",
          appIsElectricity: false,
          appIsGas: true,
          wfSubstgProgress: 100
        }
      ],
      errors: [],
      responseTime: "2025-08-29T15:59:52.960667+04:00",
      isSuccess: true
    };
  }
}
