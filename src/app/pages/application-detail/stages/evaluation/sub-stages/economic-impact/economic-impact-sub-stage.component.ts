import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../components/ui/input/input.component';
import { InputCalculatedComponent } from '../../../../../../components/ui/input-calculated/input-calculated.component';

@Component({
  selector: 'app-economic-impact-sub-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, InputCalculatedComponent],
  templateUrl: './economic-impact-sub-stage.component.html',
  styleUrl: './economic-impact-sub-stage.component.scss'
})
export class EconomicImpactSubStageComponent implements OnInit {
  @Input() readOnly: boolean = false;
  
  ngOnInit() {
    if (this.readOnly) {
      this.grossBookValueAbuDhabiControl.disable();
      this.totalGrossBookValueControl.disable();
      this.salaryBenefitsEmiratiControl.disable();
      this.totalSpentManpowerControl.disable();
      this.originalEmiratiNumberControl.disable();
      this.growthEmiratiNumberControl.disable();
      this.totalStaffControl.disable();
      this.skilledStaffControl.disable();
      this.adLogisticsFeesControl.disable();
      this.uaeLogisticsFeesControl.disable();
    }
  }
  // Investment Form Controls
  grossBookValueAbuDhabiControl = new FormControl('0');
  totalGrossBookValueControl = new FormControl('0');
  
  // Manpower & Emiratisation Form Controls
  salaryBenefitsEmiratiControl = new FormControl('0');
  totalSpentManpowerControl = new FormControl('0');
  originalEmiratiNumberControl = new FormControl('0');
  growthEmiratiNumberControl = new FormControl('0');
  totalStaffControl = new FormControl('0');
  skilledStaffControl = new FormControl('0');
  
  // Logistics Form Controls
  adLogisticsFeesControl = new FormControl('0');
  uaeLogisticsFeesControl = new FormControl('0');

  // Investment Section Data
  investmentData = {
    title: 'Investment',
    fields: {
      grossBookValueAbuDhabi: {
        label: 'Gross Book Value of the Fixed Assets & Investment Properties in Abu Dhabi',
        placeholder: '20,000,000',
        validationType: 'number' as const,
      },
      totalGrossBookValue: {
        label: 'Total Gross Book Value of the Fixed Assets & Investment Properties',
        placeholder: '50,000,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      investmentScore: {
        label: 'Investment Score',
        tooltip: 'Calculated based on gross book value ratios and investment metrics'
      },
      investmentTopUpScore: {
        label: 'Investment Top-Up Score',
        tooltip: 'Additional investment scoring based on total investment value'
      }
    }
  };

  // Manpower & Emiratisation Section Data
  manpowerData = {
    title: 'Manpower & Emiratisation',
    fields: {
      salaryBenefitsEmirati: {
        label: 'Salary & Benefits Cost Paid to Emirati Employees in Abu Dhabi',
        placeholder: '2,500,000',
        validationType: 'number' as const,
      },
      totalSpentManpower: {
        label: 'Total Spent on Manpower',
        placeholder: '10,000,000',
        validationType: 'number' as const,
      },
      originalEmiratiNumber: {
        label: 'Original Number of Emiratis',
        placeholder: '8',
        validationType: 'number' as const,
      },
      growthEmiratiNumber: {
        label: 'Growth In Emirati No\'s',
        placeholder: '12',
        validationType: 'number' as const,
      },
      totalStaff: {
        label: 'Total Number of Staff',
        placeholder: '150',
        validationType: 'number' as const,
      },
      skilledStaff: {
        label: 'Number of Skilled Staff',
        placeholder: '90',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      emiratisationSalaryScore: {
        label: 'Emiratisation: Salary & Benefits Score',
        tooltip: 'Score based on salary and benefits paid to Emirati employees'
      },
      emiratisationGrowthScore: {
        label: 'Emiratisation: Growth Score',
        tooltip: 'Score based on growth in number of Emirati employees'
      },
      skilledLabourScore: {
        label: 'Skilled Labour Score',
        tooltip: 'Score based on percentage of skilled staff'
      }
    }
  };

  // Logistics Section Data
  logisticsData = {
    title: 'Logistics',
    fields: {
      adLogisticsFees: {
        label: 'AD Logistics fees & charges',
        placeholder: '1,200,000',
        validationType: 'number' as const,
      },
      uaeLogisticsFees: {
        label: 'UAE Total Logistics fees & Charges',
        placeholder: '3,000,000',
        validationType: 'number' as const,
      }
    },
    calculatedFields: {
      supplyChainScore: {
        label: 'Supply Chain Support Score',
        tooltip: 'Score based on logistics spending in Abu Dhabi vs UAE total'
      }
    }
  };

  // Economic Impact Score Summary Data
  scoreSummaryData = {
    title: 'Economic Impact Score Summary',
    headers: ['Component', 'Score', 'Weight', 'Result'],
    totalScore: 86.0
  };

  // Investment Score Calculation Method
  calculateAppInvestmentScore(
    appInvestmentGbvAdfaAd: number,
    appInvestmentGbvTotalProprities: number
  ): number {
    if (appInvestmentGbvTotalProprities === 0) {
      return 0;
    }
    return Math.min(1, appInvestmentGbvAdfaAd / appInvestmentGbvTotalProprities);
  }

  calculateAppInvestmentWeightedScore(appInvestmentScore: number): number {
    return appInvestmentScore * 0.5;
  }

  // Calculated Investment Scores
  get investmentScore(): string {
    const abuDhabiValue = parseFloat(this.grossBookValueAbuDhabiControl.value || '0');
    const totalValue = parseFloat(this.totalGrossBookValueControl.value || '0');
    
    const score = this.calculateAppInvestmentScore(abuDhabiValue, totalValue);
    return score.toFixed(2);
  }

  get investmentTopUpScore(): string {
    const appInvestmentGbvAdfaAd = parseFloat(this.grossBookValueAbuDhabiControl.value || '0');

    let score = appInvestmentGbvAdfaAd; // Cap at 1.0 for 100M+
    if (appInvestmentGbvAdfaAd < 5_000_000) {
      score = 0;
    } else if (appInvestmentGbvAdfaAd > 150_000_000) {
      score = 0;
    } else {
      score = appInvestmentGbvAdfaAd / 150_000_000;
    }
    return score.toFixed(2);
  }

  // Calculated Manpower & Emiratisation Scores
  get emiratisationSalaryScore(): string {
    const emiratiSalary = parseFloat(this.salaryBenefitsEmiratiControl.value || '0');
    const totalManpower = parseFloat(this.totalSpentManpowerControl.value || '0');
    
    if (emiratiSalary  === 0 || totalManpower === 0) return '0.00';
    
    const denominator = totalManpower * 0.20; // 20%
    const ratio = emiratiSalary / denominator;
    return Math.min(1, ratio).toFixed(2);
  }

  get emiratisationGrowthScore(): string {
    const appEmiratizationGrowthInEmiratiNo = parseInt(this.originalEmiratiNumberControl.value || '0');
    const appEmiratizationNumberOfEmiratis = parseInt(this.growthEmiratiNumberControl.value || '0');
    let score = 0;
    if (appEmiratizationGrowthInEmiratiNo === 0 || appEmiratizationNumberOfEmiratis === 0) {
      score = 0;
    }
    const denominator = appEmiratizationNumberOfEmiratis * 0.20; // 20%
    const ratio = appEmiratizationGrowthInEmiratiNo / denominator;
    score = Math.min(1, ratio);
    return Math.max(score, 0).toFixed(2);
  }

  get skilledLabourScore(): string {
    const skilled = parseInt(this.skilledStaffControl.value || '0');
    const total = parseInt(this.totalStaffControl.value || '0');
    
    if (skilled === 0 || total === 0) return '0.00';

    const denominator = total * 0.20;
    const ratio = skilled / denominator;
    const score = Math.min(ratio, 1); // Cap at 1.0
    return score.toFixed(2);
  }

  // Calculated Logistics Score
  get supplyChainScore(): string {
    const adLogistics = parseFloat(this.adLogisticsFeesControl.value || '0');
    const uaeLogistics = parseFloat(this.uaeLogisticsFeesControl.value || '0');
    
    if (adLogistics === 0 || uaeLogistics === 0) return '0.00';
    
    const ratio = adLogistics / uaeLogistics;
    const score = Math.min(ratio, 1); // Cap at 1.0
    return score.toFixed(2);
  }

  // Economic Impact Score Summary Table Data
  get scoreSummaryTableData() {
    return [
      {
        component: 'Investment',
        score: Math.round(parseFloat(this.investmentScore) * 100),
        weight: '20%',
        result: (parseFloat(this.investmentScore) * 20).toFixed(1)
      },
      {
        component: 'Investment Top-Up',
        score: Math.round(parseFloat(this.investmentTopUpScore) * 100),
        weight: '10%',
        result: (parseFloat(this.investmentTopUpScore) * 10).toFixed(1)
      },
      {
        component: 'Emiratization',
        score: Math.round(parseFloat(this.emiratisationSalaryScore) * 100),
        weight: '20%',
        result: (parseFloat(this.emiratisationSalaryScore) * 20).toFixed(1)
      },
      {
        component: 'Emiratization - No\'s',
        score: Math.round(parseFloat(this.emiratisationGrowthScore) * 100),
        weight: '10%',
        result: (parseFloat(this.emiratisationGrowthScore) * 10).toFixed(1)
      },
      {
        component: 'Skilled Staff',
        score: Math.round(parseFloat(this.skilledLabourScore) * 100),
        weight: '20%',
        result: (parseFloat(this.skilledLabourScore) * 20).toFixed(1)
      },
      {
        component: 'AD Logistics',
        score: Math.round(parseFloat(this.supplyChainScore) * 100),
        weight: '20%',
        result: (parseFloat(this.supplyChainScore) * 20).toFixed(1)
      }
    ];
  }

  get totalEconomicImpactScore(): number {
    return this.scoreSummaryTableData.reduce((total, row) => total + parseFloat(row.result), 0);
  }

}
