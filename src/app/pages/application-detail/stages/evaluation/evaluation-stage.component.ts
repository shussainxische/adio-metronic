import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSubStageComponent } from './sub-stages/general/general-sub-stage.component';

@Component({
  selector: 'app-evaluation-stage',
  standalone: true,
  imports: [CommonModule, GeneralSubStageComponent],
  templateUrl: './evaluation-stage.component.html',
  styleUrl: './evaluation-stage.component.scss'
})
export class EvaluationStageComponent {

}