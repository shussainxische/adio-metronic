import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface for the evaluation submission request body
export interface EvaluationSubmitRequest {
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
}

// Interface for the API response
export interface EvaluationSubmitResponse {
  data: any;
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationSubmitService {
  private apiUrl = `${environment.apiBaseUrl}/Application/cb-post-submit-evaluation`;

  constructor(private http: HttpClient) {}

  /**
   * Submit evaluation data to the API
   * @param evaluationData - The evaluation data to submit
   * @returns Observable<EvaluationSubmitResponse>
   */
  submitEvaluation(evaluationData: EvaluationSubmitRequest): Observable<EvaluationSubmitResponse> {
    return this.http.post<EvaluationSubmitResponse>(this.apiUrl, evaluationData);
  }

  /**
   * Helper method to create evaluation request from component values and calculated scores
   * @param appId - Application ID
   * @param economicImpactValues - Values and scores from economic impact component
   * @param productivityValues - Values from productivity component
   * @returns EvaluationSubmitRequest
   */
  createEvaluationRequest(
    appId: number,
    economicImpactValues: {
      // Input values
      grossBookValueAbuDhabi: number;
      totalGrossBookValue: number;
      salaryBenefitsEmirati: number;
      totalSpentManpower: number;
      originalEmiratiNumber: number;
      growthEmiratiNumber: number;
      totalStaff: number;
      skilledStaff: number;
      adLogisticsFees: number;
      uaeLogisticsFees: number;
      // Calculated scores
      investmentScore: number;
      investmentWeightedScore: number;
      investmentTopUpScore: number;
      emiratisationSalaryScore: number;
      emiratisationGrowthScore: number;
      emiratisationGrowthWeightedScore: number;
      skilledStaffScore: number;
      skilledStaffWeightedScore: number;
      supplyChainScore: number;
      supplyChainWeightedScore: number;
    },
    productivityValues: {
      totalRevenueMainActivity: number;
      finishedGoodsBeginning: number;
      finishedGoodsEnd: number;
      workInProgressBeginning: number;
      workInProgressEnd: number;
      rentalsOfBuilding: number;
      otherMiscellaneousIncome: number;
      totalMainRevenue: number;
    }
  ): EvaluationSubmitRequest {
    return {
      appId,
      // Investment data
      appInvestmentGbvAdfaAd: economicImpactValues.grossBookValueAbuDhabi,
      appInvestmentGbvTotalProprities: economicImpactValues.totalGrossBookValue,
      appInvestmentScore: economicImpactValues.investmentScore,
      appInvestmentWeightedScore: economicImpactValues.investmentWeightedScore,
      appInvestmentTopUpGbvAdScore: economicImpactValues.investmentTopUpScore,
      // Emiratisation data
      appEmairatizationSalaryBenfCostPaid: economicImpactValues.salaryBenefitsEmirati,
      appEmiratizationSpentOnManpower: economicImpactValues.totalSpentManpower,
      appEmiratizationNumberOfEmiratis: economicImpactValues.originalEmiratiNumber,
      appEmiratizationGrowthInEmiratiNo: economicImpactValues.growthEmiratiNumber,
      appEmiratizationSalaryBenefitsScore: economicImpactValues.emiratisationSalaryScore,
      appEmiratizationNoScore: economicImpactValues.emiratisationGrowthScore,
      appEmiratizationNoWeightedScore: economicImpactValues.emiratisationGrowthWeightedScore,
      // Skilled staff data
      appSkilledNumberOfStaffTotal: economicImpactValues.totalStaff,
      appSkilledNumberOfStaff: economicImpactValues.skilledStaff,
      appSkilledStaffScore: economicImpactValues.skilledStaffScore,
      appSkilledStaffWeightedScore: economicImpactValues.skilledStaffWeightedScore,
      // Logistics data
      appLogisticsFeesChargesAd: economicImpactValues.adLogisticsFees,
      appLogisticsFeesChargesUaeTotal: economicImpactValues.uaeLogisticsFees,
      appLogisticsSupplyChainSupportScore: economicImpactValues.supplyChainScore,
      appLogisticsSupplyChainSupportWeightedScore: economicImpactValues.supplyChainWeightedScore,
      // Productivity data
      appProductRevenueMain: productivityValues.totalRevenueMainActivity,
      appProductFinishedgoodsBoy: productivityValues.finishedGoodsBeginning,
      aappProductFinishedgoodsEoy: productivityValues.finishedGoodsEnd,
      appProductWipBoy: productivityValues.workInProgressBeginning,
      appProductWipEoy: productivityValues.workInProgressEnd,
      appProductRevenueRentals: productivityValues.rentalsOfBuilding,
      appProductRevenueMisc: productivityValues.otherMiscellaneousIncome,
      appProductTotalMainRevenue: productivityValues.totalMainRevenue
    };
  }
}