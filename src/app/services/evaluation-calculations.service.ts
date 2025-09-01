import { Injectable } from '@angular/core';

/**
 * Evaluation Calculations for ESP System
 * Updated with configuration support for Angular application
 * Updated: 2025-08-30 07:50:49 UTC
 * User: Brahimhz
 */

// Configuration Interfaces
export interface DmsScoreRange {
    minPercentage: number;
    maxPercentage: number;
    score: number;
    description?: string;
}

export interface EvaluationConfiguration {
    // Investment Configuration
    investmentScoreMaxValue: number;
    investmentWeightedScoreMultiplier: number;
    investmentTopUpMinThreshold: number;
    investmentTopUpMaxThreshold: number;
    investmentTopUpDivisor: number;

    // Emiratization Configuration  
    emiratizationPercentageMultiplier: number;
    emiratizationNoWeightedMultiplier: number;
    skilledStaffPercentageMultiplier: number;
    skilledStaffWeightedMultiplier: number;

    // Logistics Configuration
    logisticsWeightedMultiplier: number;

    // DMS Configuration
    dmsScoreTable: DmsScoreRange[];

    // Calculation Tolerance
    calculationTolerance: number;

    // Metadata
    lastUpdated: string;
    updatedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationCalculationsService {
    
    // Static configuration - will be loaded from API
    private config: EvaluationConfiguration = {
        // Default values - will be overridden by loadConfiguration()
        investmentScoreMaxValue: 1.0,
        investmentWeightedScoreMultiplier: 0.5,
        investmentTopUpMinThreshold: 5_000_000,
        investmentTopUpMaxThreshold: 150_000_000,
        investmentTopUpDivisor: 150_000_000,
        emiratizationPercentageMultiplier: 0.20,
        emiratizationNoWeightedMultiplier: 0.5,
        skilledStaffPercentageMultiplier: 0.20,
        skilledStaffWeightedMultiplier: 0.5,
        logisticsWeightedMultiplier: 0.5,
        dmsScoreTable: [
            { minPercentage: 0, maxPercentage: 74.99, score: 0.0, description: "Below 75%" },
            { minPercentage: 75, maxPercentage: 79, score: 0.25, description: "75% to 79%" },
            { minPercentage: 80, maxPercentage: 84, score: 0.50, description: "80% to 84%" },
            { minPercentage: 85, maxPercentage: 89, score: 0.75, description: "85% to 89%" },
            { minPercentage: 90, maxPercentage: 94, score: 0.90, description: "90% to 94%" },
            { minPercentage: 95, maxPercentage: 105, score: 1.00, description: "95% to 105%" },
            { minPercentage: 105.01, maxPercentage: Number.MAX_VALUE, score: 0.0, description: "Above 105%" }
        ],
        calculationTolerance: 0.001,
        lastUpdated: "2025-08-30 07:50:49",
        updatedBy: "Brahimhz"
    };

    /**
     * Load configuration from API or provided object
     */
    loadConfiguration(configuration: EvaluationConfiguration): void {
        this.config = { ...configuration };
        console.log(`[${new Date().toISOString()}] Configuration loaded by user: ${this.config.updatedBy}`);
    }

    /**
     * Get current configuration
     */
    getConfiguration(): EvaluationConfiguration {
        return { ...this.config };
    }

    // #region Investment Section
    
    /**
     * Calculate AppInvestmentScore
     * Formula: (app_investment_gbv_adfa_ad / app_investment_gbv_total_proprities), if>1 =1
     */
    calculateAppInvestmentScore(
        appInvestmentGbvAdfaAd: number,
        appInvestmentGbvTotalProprities: number
    ): number {
        if (appInvestmentGbvTotalProprities === 0) {
            return 0;
        }
        return Math.min(this.config.investmentScoreMaxValue, appInvestmentGbvAdfaAd / appInvestmentGbvTotalProprities);
    }

    /**
     * Calculate AppInvestmentWeightedScore
     * Formula: AppInvestmentScore * configurable multiplier
     */
    calculateAppInvestmentWeightedScore(appInvestmentScore: number): number {
        return appInvestmentScore * this.config.investmentWeightedScoreMultiplier;
    }

    /**
     * Calculate AppInvestmentTopUpGbvAdScore
     * Formula: 0 if < threshold, 1 if > threshold, app_investment_gbv_adfa_ad / divisor otherwise
     */
    calculateAppInvestmentTopUpGbvAdScore(appInvestmentGbvAdfaAd: number): number {
        if (appInvestmentGbvAdfaAd < this.config.investmentTopUpMinThreshold) {
            return 0;
        } else if (appInvestmentGbvAdfaAd > this.config.investmentTopUpMaxThreshold) {
            return this.config.investmentScoreMaxValue;
        } else {
            return appInvestmentGbvAdfaAd / this.config.investmentTopUpDivisor;
        }
    }

    // #endregion

    // #region Emiratization Section

    /**
     * Calculate AppEmiratizationSalaryBenefitsScore
     * Uses configurable percentage multiplier
     */
    calculateAppEmiratizationSalaryBenefitsScore(
        appEmairatizationSalaryBenfCostPaid: number,
        appEmiratizationSpentOnManpower: number
    ): number {
        if (appEmiratizationSpentOnManpower === 0 || appEmairatizationSalaryBenfCostPaid === 0) {
            return 0;
        }
        const denominator = appEmiratizationSpentOnManpower * this.config.emiratizationPercentageMultiplier;
        const ratio = appEmairatizationSalaryBenfCostPaid / denominator;
        return Math.min(this.config.investmentScoreMaxValue, ratio);
    }

    /**
     * Calculate AppEmiratizationNoScore
     * Uses configurable percentage multiplier
     */
    calculateAppEmiratizationNoScore(
        appEmiratizationGrowthInEmiratiNo: number,
        appEmiratizationNumberOfEmiratis: number
    ): number {
        if (appEmiratizationGrowthInEmiratiNo === 0 || appEmiratizationNumberOfEmiratis === 0) {
            return 0;
        }
        //const denominator = appEmiratizationNumberOfEmiratis * this.config.emiratizationPercentageMultiplier;
        const ratio = appEmiratizationGrowthInEmiratiNo / appEmiratizationNumberOfEmiratis;
        return Math.min(this.config.investmentScoreMaxValue, ratio);
    }

    /**
     * Calculate AppEmiratizationNoWeightedScore
     * Uses configurable weighted multiplier
     */
    calculateAppEmiratizationNoWeightedScore(appEmiratizationNoScore: number): number {
        return appEmiratizationNoScore * this.config.emiratizationNoWeightedMultiplier;
    }

    /**
     * Calculate AppSkilledStaffScore
     * Uses configurable percentage multiplier
     */
    calculateAppSkilledStaffScore(
        appSkilledNumberOfStaff: number,
        appSkilledNumberOfStaffTotal: number
    ): number {
        if (appSkilledNumberOfStaffTotal === 0 || appSkilledNumberOfStaff === 0) {
            return 0;
        }
        const denominator = appSkilledNumberOfStaffTotal * this.config.skilledStaffPercentageMultiplier;
        const ratio = appSkilledNumberOfStaff / denominator;
        return Math.min(this.config.investmentScoreMaxValue, ratio);
    }

    /**
     * Calculate AppSkilledStaffWeightedScore
     * Uses configurable weighted multiplier
     */
    calculateAppSkilledStaffWeightedScore(appSkilledStaffScore: number): number {
        return appSkilledStaffScore * this.config.skilledStaffWeightedMultiplier;
    }

    // #endregion

    // #region Logistics Section

    /**
     * Calculate AppLogisticsSupplyChainSupportScore
     */
    calculateAppLogisticsSupplyChainSupportScore(
        appLogisticsFeesChargesAd: number,
        appLogisticsFeesChargesUaeTotal: number
    ): number {
        if (appLogisticsFeesChargesUaeTotal === 0 || appLogisticsFeesChargesAd === 0) {
            return 0;
        }
        const ratio = appLogisticsFeesChargesAd / appLogisticsFeesChargesUaeTotal;
        return Math.min(this.config.investmentScoreMaxValue, ratio);
    }

    /**
     * Calculate AppLogisticsSupplyChainSupportWeightedScore
     * Uses configurable weighted multiplier
     */
    calculateAppLogisticsSupplyChainSupportWeightedScore(appLogisticsSupplyChainSupportScore: number): number {
        return appLogisticsSupplyChainSupportScore * this.config.logisticsWeightedMultiplier;
    }

    // #endregion

    // #region DMS Section

    /**
     * Calculate AppDmsScore based on configurable demand side consumption percentage table
     */
    calculateAppDmsScore(demandSideConsumptionPercentage: number): number {
        for (const range of this.config.dmsScoreTable) {
            if (demandSideConsumptionPercentage >= range.minPercentage && 
                demandSideConsumptionPercentage <= range.maxPercentage) {
                return range.score;
            }
        }
        return 0; // Default fallback
    }

    /**
     * Get DMS score description for given percentage
     */
    getDmsScoreDescription(demandSideConsumptionPercentage: number): string {
        for (const range of this.config.dmsScoreTable) {
            if (demandSideConsumptionPercentage >= range.minPercentage && 
                demandSideConsumptionPercentage <= range.maxPercentage) {
                return range.description || `${range.minPercentage}% to ${range.maxPercentage}%`;
            }
        }
        return "Unknown range";
    }

    // #endregion

    // #region Productivity Section

    /**
     * Calculate AppProductTotalMainRevenue
     */
    calculateAppProductTotalMainRevenue(
        appProductRevenueMain: number,
        appProductFinishedgoodsBoy: number,
        appProductFinishedgoodsEoy: number,
        appProductWipBoy: number,
        appProductWipEoy: number
    ): number {
        return appProductRevenueMain + 
               appProductFinishedgoodsBoy + 
               appProductFinishedgoodsEoy + 
               appProductWipBoy + 
               appProductWipEoy;
    }

    /**
     * Calculate AppProductTotalSecondaryRevenue
     */
    calculateAppProductTotalSecondaryRevenue(
        appProductRevenueRentals: number,
        appProductRevenueMisc: number
    ): number {
        return appProductRevenueRentals + appProductRevenueMisc;
    }

    /**
     * Calculate AppProductTotalRevenue
     */
    calculateAppProductTotalRevenue(
        appProductTotalMainRevenue: number,
        appProductTotalSecondaryRevenue: number
    ): number {
        return appProductTotalMainRevenue + appProductTotalSecondaryRevenue;
    }

    // #endregion

    // #region Intermediate Consumption

    /**
     * Calculate AppProductIntermediateConsumptionTotal
     */
    calculateAppProductIntermediateConsumptionTotal(
        appTotalCostofProduction: number,
        appProductWagesSalariesBonusesCashCogs: number,
        appProductBenefitsGrantedEmpCogs: number,
        appDepreciationCogs: number,
        appProductTotalGeneralAdminExpenses: number,
        appProductWagesSalariesBonusesCashGa: number,
        appProductBenefitsGrantedEmpGa: number,
        appDepreciationGa: number,
        appProductBankingCharges: number
    ): number {
        return appTotalCostofProduction
             - appProductWagesSalariesBonusesCashCogs
             - appProductBenefitsGrantedEmpCogs
             - appDepreciationCogs
             + appProductTotalGeneralAdminExpenses
             - appProductWagesSalariesBonusesCashGa
             - appProductBenefitsGrantedEmpGa
             - appDepreciationGa
             + appProductBankingCharges;
    }

    // #endregion

    // #region Value Added

    /**
     * Calculate AppProductValueAdded
     */
    calculateAppProductValueAdded(
        appProductTotalRevenue: number,
        appProductIntermediateConsumptionTotal: number
    ): number {
        return appProductTotalRevenue - appProductIntermediateConsumptionTotal;
    }

    /**
     * Calculate AppProductProductivity
     */
    calculateAppProductProductivity(
        appProductValueAdded: number,
        appProductAvgNumberEmployees: number
    ): number {
        if (appProductAvgNumberEmployees === 0) {
            return 0;
        }
        return appProductValueAdded / appProductAvgNumberEmployees;
    }

    // #endregion

    // #region Validation Methods

    /**
     * Validate calculated score with tolerance
     */
    validateCalculatedScore(calculatedValue: number, expectedValue: number): boolean {
        return Math.abs(calculatedValue - expectedValue) <= this.config.calculationTolerance;
    }

    /**
     * Get calculation tolerance
     */
    getCalculationTolerance(): number {
        return this.config.calculationTolerance;
    }

    // #endregion

    // #region Utility Methods

    /**
     * Calculate all investment scores at once
     */
    calculateAllInvestmentScores(
        appInvestmentGbvAdfaAd: number,
        appInvestmentGbvTotalProprities: number
    ): {
        appInvestmentScore: number;
        appInvestmentWeightedScore: number;
        appInvestmentTopUpGbvAdScore: number;
    } {
        const appInvestmentScore = this.calculateAppInvestmentScore(
            appInvestmentGbvAdfaAd, 
            appInvestmentGbvTotalProprities
        );
        
        return {
            appInvestmentScore,
            appInvestmentWeightedScore: this.calculateAppInvestmentWeightedScore(appInvestmentScore),
            appInvestmentTopUpGbvAdScore: this.calculateAppInvestmentTopUpGbvAdScore(appInvestmentGbvAdfaAd)
        };
    }

    /**
     * Calculate all emiratization scores at once
     */
    calculateAllEmiratizationScores(
        appEmairatizationSalaryBenfCostPaid: number,
        appEmiratizationSpentOnManpower: number,
        appEmiratizationGrowthInEmiratiNo: number,
        appEmiratizationNumberOfEmiratis: number,
        appSkilledNumberOfStaff: number,
        appSkilledNumberOfStaffTotal: number
    ): {
        appEmiratizationSalaryBenefitsScore: number;
        appEmiratizationNoScore: number;
        appEmiratizationNoWeightedScore: number;
        appSkilledStaffScore: number;
        appSkilledStaffWeightedScore: number;
    } {
        const appEmiratizationSalaryBenefitsScore = this.calculateAppEmiratizationSalaryBenefitsScore(
            appEmairatizationSalaryBenfCostPaid,
            appEmiratizationSpentOnManpower
        );

        const appEmiratizationNoScore = this.calculateAppEmiratizationNoScore(
            appEmiratizationGrowthInEmiratiNo,
            appEmiratizationNumberOfEmiratis
        );

        const appSkilledStaffScore = this.calculateAppSkilledStaffScore(
            appSkilledNumberOfStaff,
            appSkilledNumberOfStaffTotal
        );

        return {
            appEmiratizationSalaryBenefitsScore,
            appEmiratizationNoScore,
            appEmiratizationNoWeightedScore: this.calculateAppEmiratizationNoWeightedScore(appEmiratizationNoScore),
            appSkilledStaffScore,
            appSkilledStaffWeightedScore: this.calculateAppSkilledStaffWeightedScore(appSkilledStaffScore)
        };
    }

    /**
     * Calculate all logistics scores at once
     */
    calculateAllLogisticsScores(
        appLogisticsFeesChargesAd: number,
        appLogisticsFeesChargesUaeTotal: number
    ): {
        appLogisticsSupplyChainSupportScore: number;
        appLogisticsSupplyChainSupportWeightedScore: number;
    } {
        const appLogisticsSupplyChainSupportScore = this.calculateAppLogisticsSupplyChainSupportScore(
            appLogisticsFeesChargesAd,
            appLogisticsFeesChargesUaeTotal
        );

        return {
            appLogisticsSupplyChainSupportScore,
            appLogisticsSupplyChainSupportWeightedScore: this.calculateAppLogisticsSupplyChainSupportWeightedScore(appLogisticsSupplyChainSupportScore)
        };
    }

    // #endregion
}