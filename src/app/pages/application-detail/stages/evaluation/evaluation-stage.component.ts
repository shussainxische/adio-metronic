import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralSubStageComponent } from './sub-stages/general/general-sub-stage.component';
import { EconomicImpactSubStageComponent } from './sub-stages/economic-impact/economic-impact-sub-stage.component';
import { ProductivitySubStageComponent } from './sub-stages/productivity/productivity-sub-stage.component';
import { EmsDmsSubStageComponent } from './sub-stages/ems-dms/ems-dms-sub-stage.component';
import { SummarySubStageComponent } from './sub-stages/summary/summary-sub-stage.component';
import { ReviewSubmitSubStageComponent } from './sub-stages/review-submit/review-submit-sub-stage.component';
import { Application } from '../../../../services/application-status.service';

@Component({
  selector: 'app-evaluation-stage',
  standalone: true,
  imports: [CommonModule, GeneralSubStageComponent, EconomicImpactSubStageComponent, ProductivitySubStageComponent, EmsDmsSubStageComponent, SummarySubStageComponent, ReviewSubmitSubStageComponent],
  templateUrl: './evaluation-stage.component.html',
  styleUrl: './evaluation-stage.component.scss'
})
export class EvaluationStageComponent {
  @Input() application?: Application;

  currentStep: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) {
    // Get current step from query params
    this.route.queryParams.subscribe(params => {
      this.currentStep = parseInt(params['step']) || 0;
    });
  }

  get isReadOnly(): boolean {
    return this.application?.stage === 'Review';
  }

  get isAdioView(): boolean {
    return this.router.url.startsWith('/adio');
  }

  get evaluationStatus(): string {
    if (this.application?.status === 'Returned') {
      return 'Returned';
    }
    return 'In Progress';
  }

}