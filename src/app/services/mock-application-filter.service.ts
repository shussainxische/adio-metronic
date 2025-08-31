import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable, of } from 'rxjs';
import { 
  BaseApplicationFilterService, 
  AppType, 
  Stage, 
  SubStage, 
  ApplicationFiltersResponse 
} from './base-application-filter.service';

@Injectable()
export class MockApplicationFilterService extends BaseApplicationFilterService implements InMemoryDbService {

  constructor() { 
    super(); 
  }

  createDb(): {} {
    const applicationFilters: ApplicationFiltersResponse = {
      data: {
        appTypes: [
          {
            appTypeId: 1,
            appTypeName: "Enrollment"
          },
          {
            appTypeId: 2,
            appTypeName: "Renewal"
          },
          {
            appTypeId: 3,
            appTypeName: "New Manufacturing Entity"
          },
          {
            appTypeId: 4,
            appTypeName: "Existing Manufacturing Entity"
          },
          {
            appTypeId: 5,
            appTypeName: "Blocked"
          }
        ],
        stages: [
          {
            wfStgId: 1,
            serviceId: 100,
            wfStgName: "Quotation",
            wfStgColor: "#4A90E2",
            wfStgIcon: "fa-file-text-o",
            wfStgSortId: 1,
            subStages: [
              {
                wfSubstgId: 1,
                wfStgId: 1,
                wfSubstgName: "pending",
                wfSubstgColor: "#F5A623",
                wfSubstgIcon: "fa-clock-o",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 2,
                wfStgId: 1,
                wfSubstgName: "submitted",
                wfSubstgColor: "#7ED321",
                wfSubstgIcon: "fa-paper-plane",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 2,
            serviceId: 100,
            wfStgName: "Evaluation",
            wfStgColor: "#F5A623",
            wfStgIcon: "fa-cogs",
            wfStgSortId: 2,
            subStages: [
              {
                wfSubstgId: 3,
                wfStgId: 2,
                wfSubstgName: "In progress",
                wfSubstgColor: "#4A90E2",
                wfSubstgIcon: "fa-spinner",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 4,
                wfStgId: 2,
                wfSubstgName: "Returned",
                wfSubstgColor: "#D0021B",
                wfSubstgIcon: "fa-undo",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 3,
            serviceId: 100,
            wfStgName: "Review",
            wfStgColor: "#BD10E0",
            wfStgIcon: "fa-search",
            wfStgSortId: 3,
            subStages: [
              {
                wfSubstgId: 5,
                wfStgId: 3,
                wfSubstgName: "initial review",
                wfSubstgColor: "#F8E71C",
                wfSubstgIcon: "fa-eye",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 6,
                wfStgId: 3,
                wfSubstgName: "final review",
                wfSubstgColor: "#50E3C2",
                wfSubstgIcon: "fa-gavel",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 4,
            serviceId: 100,
            wfStgName: "Closed",
            wfStgColor: "#9B9B9B",
            wfStgIcon: "fa-archive",
            wfStgSortId: 4,
            subStages: [
              {
                wfSubstgId: 7,
                wfStgId: 4,
                wfSubstgName: "certified",
                wfSubstgColor: "#7ED321",
                wfSubstgIcon: "fa-check-circle",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 8,
                wfStgId: 4,
                wfSubstgName: "not certified",
                wfSubstgColor: "#D0021B",
                wfSubstgIcon: "fa-times-circle",
                wfSubstgSortId: 2
              },
              {
                wfSubstgId: 9,
                wfStgId: 4,
                wfSubstgName: "expired",
                wfSubstgColor: "#4A4A4A",
                wfSubstgIcon: "fa-calendar-times-o",
                wfSubstgSortId: 3
              },
              {
                wfSubstgId: 10,
                wfStgId: 4,
                wfSubstgName: "canceled",
                wfSubstgColor: "#B3B3B3",
                wfSubstgIcon: "fa-ban",
                wfSubstgSortId: 4
              }
            ]
          }
        ]
      },
      errors: [],
      responseTime: "2025-08-29T15:59:52.960667+04:00",
      isSuccess: true
    };

    return {
      'application-filters': applicationFilters
    };
  }

  getApplicationFilters(): Observable<ApplicationFiltersResponse> {
    const mockData = this.getMockData();
    return of(mockData);
  }

  private getMockData(): ApplicationFiltersResponse {
    return {
      data: {
        appTypes: [
          {
            appTypeId: 1,
            appTypeName: "Enrollment"
          },
          {
            appTypeId: 2,
            appTypeName: "Renewal"
          },
          {
            appTypeId: 3,
            appTypeName: "New Manufacturing Entity"
          },
          {
            appTypeId: 4,
            appTypeName: "Existing Manufacturing Entity"
          },
          {
            appTypeId: 5,
            appTypeName: "Blocked"
          }
        ],
        stages: [
          {
            wfStgId: 1,
            serviceId: 100,
            wfStgName: "Quotation",
            wfStgColor: "#4A90E2",
            wfStgIcon: "fa-file-text-o",
            wfStgSortId: 1,
            subStages: [
              {
                wfSubstgId: 1,
                wfStgId: 1,
                wfSubstgName: "pending",
                wfSubstgColor: "#F5A623",
                wfSubstgIcon: "fa-clock-o",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 2,
                wfStgId: 1,
                wfSubstgName: "submitted",
                wfSubstgColor: "#7ED321",
                wfSubstgIcon: "fa-paper-plane",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 2,
            serviceId: 100,
            wfStgName: "Evaluation",
            wfStgColor: "#F5A623",
            wfStgIcon: "fa-cogs",
            wfStgSortId: 2,
            subStages: [
              {
                wfSubstgId: 3,
                wfStgId: 2,
                wfSubstgName: "In progress",
                wfSubstgColor: "#4A90E2",
                wfSubstgIcon: "fa-spinner",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 4,
                wfStgId: 2,
                wfSubstgName: "Returned",
                wfSubstgColor: "#D0021B",
                wfSubstgIcon: "fa-undo",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 3,
            serviceId: 100,
            wfStgName: "Review",
            wfStgColor: "#BD10E0",
            wfStgIcon: "fa-search",
            wfStgSortId: 3,
            subStages: [
              {
                wfSubstgId: 5,
                wfStgId: 3,
                wfSubstgName: "initial review",
                wfSubstgColor: "#F8E71C",
                wfSubstgIcon: "fa-eye",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 6,
                wfStgId: 3,
                wfSubstgName: "final review",
                wfSubstgColor: "#50E3C2",
                wfSubstgIcon: "fa-gavel",
                wfSubstgSortId: 2
              }
            ]
          },
          {
            wfStgId: 4,
            serviceId: 100,
            wfStgName: "Closed",
            wfStgColor: "#9B9B9B",
            wfStgIcon: "fa-archive",
            wfStgSortId: 4,
            subStages: [
              {
                wfSubstgId: 7,
                wfStgId: 4,
                wfSubstgName: "certified",
                wfSubstgColor: "#7ED321",
                wfSubstgIcon: "fa-check-circle",
                wfSubstgSortId: 1
              },
              {
                wfSubstgId: 8,
                wfStgId: 4,
                wfSubstgName: "not certified",
                wfSubstgColor: "#D0021B",
                wfSubstgIcon: "fa-times-circle",
                wfSubstgSortId: 2
              },
              {
                wfSubstgId: 9,
                wfStgId: 4,
                wfSubstgName: "expired",
                wfSubstgColor: "#4A4A4A",
                wfSubstgIcon: "fa-calendar-times-o",
                wfSubstgSortId: 3
              },
              {
                wfSubstgId: 10,
                wfStgId: 4,
                wfSubstgName: "canceled",
                wfSubstgColor: "#B3B3B3",
                wfSubstgIcon: "fa-ban",
                wfSubstgSortId: 4
              }
            ]
          }
        ]
      },
      errors: [],
      responseTime: "2025-08-29T15:59:52.960667+04:00",
      isSuccess: true
    };
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
}
