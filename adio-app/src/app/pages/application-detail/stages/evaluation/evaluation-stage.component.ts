import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSubStageComponent } from './sub-stages/general/general-sub-stage.component';
import { Application } from '../../../../services/application-status.service';

@Component({
  selector: 'app-evaluation-stage',
  standalone: true,
  imports: [CommonModule, GeneralSubStageComponent],
  templateUrl: './evaluation-stage.component.html',
  styleUrl: './evaluation-stage.component.scss'
})
export class EvaluationStageComponent {
  @Input() application?: Application;

  get isReadOnly(): boolean {
    return this.application?.stage === 'Review';
  }
}