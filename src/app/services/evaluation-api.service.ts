import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface EvaluationData {
  appId: number;
  appInvestmentGbvAdfaAd: number;
  appInvestmentGbvTotalProprities: number;
  appInvestmentScore: number;
  appInvestmentWeightedScore: number;
  appInvestmentTopUpGbvAdScore: number;
  appEmairatizationSalaryBenfCostPaid: number;
  appEmiratizationSpentOnManpower: number;
  appEmiratizationNumberOfEmiratis: number;
  appEmiratizationGrowthInEmiratiNo: number;
  appSkilledNumberOfStaffTotal: number;
  appSkilledNumberOfStaff: number;
  appEmiratizationSalaryBenefitsScore: number;
  appEmiratizationNoScore: number;
  appEmiratizationNoWeightedScore: number;
  appSkilledStaffScore: number;
  appSkilledStaffWeightedScore: number;
  appLogisticsFeesChargesAd: number;
  appLogisticsFeesChargesUaeTotal: number;
  appLogisticsSupplyChainSupportScore: number;
  appLogisticsSupplyChainSupportWeightedScore: number;
  appProductRevenueMain: number;
  appProductFinishedgoodsBoy: number;
  aappProductFinishedgoodsEoy: number;
  appProductWipBoy: number;
  appProductWipEoy: number;
  appProductRevenueRentals: number;
  appProductRevenueMisc: number;
  appProductTotalMainRevenue: number;
  appProductTotalSecondaryRevenue: number;
  appProductTotalRevenue: number;
  appTotalCostofProduction: number;
  appProductBankingCharges: number;
  appDepreciationCogs: number;
  appDepreciationGA: number;
  appProductBenefitsGrantedEmpGa: number;
  appProductWagesSalariesBonusesCashGa: number;
  appProductTotalGeneralAdminExpenses: number;
  appProductBenefitsGrantedEmpCogs: number;
  appProductWagesSalariesBonusesCashCogs: number;
  appProductAvgNumberEmployees: number;
  appProductIntermediateConsumptionTotal: number;
  appProductValueAdded: number;
  appProductProductivity: number;
  appConnectionLoadMeter: number;
  appEmsApplicability: number;
  appConfigDmsOptionsId: number;
  demandSideConsumptionPercentage: number;
  appDmsScore: number;
  appConfigDmsOptionsScore: number;
}

export interface EvaluationConfiguration {
  investmentScoreMaxValue: number;
  investmentWeightedScoreMultiplier: number;
  investmentTopUpMinThreshold: number;
  investmentTopUpMaxThreshold: number;
  investmentTopUpDivisor: number;
  emiratizationPercentageMultiplier: number;
  emiratizationNoWeightedMultiplier: number;
  skilledStaffPercentageMultiplier: number;
  skilledStaffWeightedMultiplier: number;
  logisticsWeightedMultiplier: number;
  dmsScoreTable: any[];
  calculationTolerance: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface ApplicationSummary {
  appTypeName: string;
  appIsElectricity: boolean;
  appIsGas: boolean;
  appFinancialYearEndData: string;
}

export interface LicenseDetails {
  invId: number;
  invLicenseId: number;
  invCompanyName: string;
  invAddress: string;
  invIndustrialType: string;
  invLicenseIssueDate: string;
  invLicenseExpiryDate: string;
  invOperationDate: string;
  invAddressCity: string;
  invAddressEmirate: string;
}

export interface CompanyContact {
  invFullName: string;
  invEmail: string;
  invPhone: string;
  invPosition: string;
}

export interface ActivityLogEntry {
  logId: number;
  createdOn: string;
  userName: string;
  message: string;
}

export interface EvaluationApplicationData {
  licenseDetails: LicenseDetails;
  companyContact: CompanyContact;
  applicationSummary: ApplicationSummary;
  documents: any[];
  activityLog: ActivityLogEntry[];
  evaluationConfiguration: EvaluationConfiguration;
  evaluation: EvaluationData;
}

export interface EvaluationApplicationResponse {
  data: EvaluationApplicationData;
  errors: string[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationApiService {
  private apiBaseUrl = 'https://localhost:44354/api/Application';
  private evaluationDataSubject = new BehaviorSubject<EvaluationApplicationData | null>(null);
  
  // Observable for components to subscribe to
  public evaluationData$ = this.evaluationDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get evaluation application data by appId
   */
  getEvaluationApplication(appId: number): Observable<EvaluationApplicationData> {
    const url = `${this.apiBaseUrl}/cb-get-evaluation-application?appId=${appId}`;
    
    return this.http.get<EvaluationApplicationResponse>(url).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          this.evaluationDataSubject.next(response.data);
          return response.data;
        } else {
          throw new Error(response.errors.join(', ') || 'Failed to fetch evaluation data');
        }
      }),
      catchError(error => {
        console.error('API Error - falling back to mock data:', error);
        return this.getMockEvaluationData();
      })
    );
  }

  /**
   * Get mock evaluation data from JSON file
   */
  private getMockEvaluationData(): Observable<EvaluationApplicationData> {
    return this.http.get<EvaluationApplicationResponse>('/assets/mock-data/application-evaluation.json').pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          this.evaluationDataSubject.next(response.data);
          return response.data;
        } else {
          throw new Error('Failed to load mock evaluation data');
        }
      })
    );
  }

  /**
   * Get current evaluation data without making a new API call
   */
  getCurrentEvaluationData(): EvaluationApplicationData | null {
    return this.evaluationDataSubject.value;
  }

  /**
   * Update evaluation data in the service state
   */
  updateEvaluationData(data: EvaluationApplicationData): void {
    this.evaluationDataSubject.next(data);
  }

  /**
   * Check if application is in Review stage (readonly)
   */
  isApplicationInReview(): boolean {
    const currentData = this.getCurrentEvaluationData();
    // You may need to adjust this based on how stage information is provided
    // For now, assuming we need to check against application stage
    return false; // Will be updated based on application stage logic
  }
}