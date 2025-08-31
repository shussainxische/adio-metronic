import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GeneralSubStageComponent } from './sub-stages/general/general-sub-stage.component';
import { EconomicImpactSubStageComponent } from './sub-stages/economic-impact/economic-impact-sub-stage.component';
import { ProductivitySubStageComponent } from './sub-stages/productivity/productivity-sub-stage.component';
import { EmsDmsSubStageComponent } from './sub-stages/ems-dms/ems-dms-sub-stage.component';
import { SummarySubStageComponent } from './sub-stages/summary/summary-sub-stage.component';
import { ReviewSubmitSubStageComponent } from './sub-stages/review-submit/review-submit-sub-stage.component';
import { Application } from '../../../../services/application-status.service';
import { EvaluationApiService, EvaluationApplicationData } from '../../../../services/evaluation-api.service';

@Component({
  selector: 'app-evaluation-stage',
  standalone: true,
  imports: [
    CommonModule, 
    GeneralSubStageComponent,
    EconomicImpactSubStageComponent,
    ProductivitySubStageComponent,
    EmsDmsSubStageComponent,
    SummarySubStageComponent,
    ReviewSubmitSubStageComponent
  ],
  templateUrl: './evaluation-stage.component.html',
  styleUrl: './evaluation-stage.component.scss'
})
export class EvaluationStageComponent implements OnInit, OnDestroy {
  @Input() application?: Application;

  evaluationData?: EvaluationApplicationData;
  private subscription = new Subscription();

  constructor(private evaluationApiService: EvaluationApiService) {}

  ngOnInit() {
    if (this.application?.id) {
      this.loadEvaluationData(Number(this.application.id));
    }

    // Subscribe to evaluation data changes
    this.subscription.add(
      this.evaluationApiService.evaluationData$.subscribe(data => {
        if (data) {
          this.evaluationData = data;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadEvaluationData(appId: number) {
    this.subscription.add(
      this.evaluationApiService.getEvaluationApplication(appId).subscribe({
        next: (data) => {
          this.evaluationData = data;
          console.log('✅ Evaluation data loaded successfully', data);
        },
        error: (error) => {
          console.error('❌ Error loading evaluation data:', error);
        }
      })
    );
  }

  get isReadOnly(): boolean {
    const readonly = this.application?.stage === 'Review';
    console.log('🔍 Evaluation Stage - isReadOnly check:', {
      application: this.application,
      stage: this.application?.stage,
      isReadOnly: readonly
    });
    return readonly;
  }

  get licenseDetails() {
    return this.evaluationData?.licenseDetails;
  }

  get companyContact() {
    return this.evaluationData?.companyContact;
  }

  get applicationSummary() {
    return this.evaluationData?.applicationSummary;
  }

  get evaluationConfiguration() {
    return this.evaluationData?.evaluationConfiguration;
  }

  get evaluation() {
    return this.evaluationData?.evaluation;
  }
}