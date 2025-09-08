import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  GeneralSubStageComponent, EconomicImpactSubStageComponent, ProductivitySubStageComponent,
  EmsDmsSubStageComponent, SummarySubStageComponent, ReviewSubmitSubStageComponent
} from '../_index';

import { ApplicationEvaluationService } from '@services/esp/application-evaluation.service';

import { ApplicationEvaluationDto, ApplicationStatusDto } from '@models/esp/_index';

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
  @Input() application?: ApplicationStatusDto;

  evaluationData?: ApplicationEvaluationDto;
  private subscription = new Subscription();

  constructor(private evaluationApiService: ApplicationEvaluationService) { }

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
    // Simple condition: disable fields if application status is 'Initial Review'
    const readonly = this.application?.status === 'Initial Review';
    console.log('🔍 Evaluation Stage - isReadOnly check:', {
      application: this.application,
      status: this.application?.status,
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