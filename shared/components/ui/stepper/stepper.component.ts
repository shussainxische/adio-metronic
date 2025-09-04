import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface StepperItem {
  id: string;
  label: string;
  disabled?: boolean;
  clickable?: boolean; // New property to control if step is clickable
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  @Input() activeStep: number = 1;
  @Input() mode: 'create' | 'view' | 'edit' = 'create';
  @Input() steps: StepperItem[] = [];
  @Output() stepClick = new EventEmitter<number>();
  @Input() className = '';

  ngOnInit(): void {
    this.steps[0].clickable = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Check if activeStep has changed
    if (changes['activeStep']) {
      this.steps[changes['activeStep'].currentValue-1].clickable = true;
    }
  }

  get isRtl(): boolean {
    return document.dir === 'rtl' || document.documentElement.lang === 'ar';
  }

  onStepClick(stepNumber: number): void {
    if (this.isStepClickable(stepNumber)) {
      this.stepClick.emit(stepNumber);
    }
  }

  isStepClickable(stepNumber: number): boolean {
    const step = this.steps[stepNumber - 1];

    // Check if step explicitly has clickable flag set
    if (step.clickable === true) {
      return true;
    }

    // Otherwise use mode-based logic as fallback
    return this.mode === 'edit' ||
           this.mode === 'view' ||
           (this.mode === 'create' && stepNumber <= this.activeStep);
  }

  getStepState(stepIndex: number): 'completed' | 'active' | 'pending' {
    const stepNumber = stepIndex + 1;
    if (stepNumber === this.activeStep) {
      return 'active';
    }
      if(this.steps[stepIndex].clickable) {
        return 'completed'
      }
    return 'pending'
  }

  getStepClasses(stepIndex: number): any {
    const stepNumber = stepIndex + 1;
    const state = this.getStepState(stepIndex);

    return {
      // Circle styling
      'border-primary': state === 'active' || state === 'completed',
      'border-gray-400': state === 'pending',
      'bg-surface': state === 'active' || (state === 'pending' && this.mode !== 'edit'),
      'bg-primary': state === 'completed' || (this.mode === 'edit' && state !== 'active'),

      // Interaction
      'cursor-pointer': this.isStepClickable(stepNumber),
      'hover:shadow-0-2': this.isStepClickable(stepNumber)
    };
  }

  getLabelClasses(stepIndex: number): any {
    const stepNumber = stepIndex + 1;
    const state = this.getStepState(stepIndex);

    return {
      'text-primary': state === 'active' || state === 'completed' || this.mode === 'edit',
      'text-gray-600': state === 'pending' && this.mode !== 'edit',
      'font-semibold': state === 'active',
      'font-normal': state !== 'active',
      'cursor-pointer': this.isStepClickable(stepNumber)
    };
  }

  getProgressLineClasses(stepIndex: number): any {
    const stepNumber = stepIndex + 1;
    if(this.steps[stepNumber].clickable)
    return 'bg-primary';
    return 'bg-gray-600'
  }

  showCheckIcon(stepIndex: number): boolean {
    const stepNumber = stepIndex + 1;
    if(this.steps[stepIndex].clickable && stepNumber !== this.activeStep) {
      return true;
    }
    return false
  }
}
