import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input-calculated',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './input-calculated.component.html',
  styleUrl: './input-calculated.component.scss'
})
export class InputCalculatedComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() unit: string = '';
  @Input() tooltip: string = '';
  @Input() className: string = '';
  @Input() required: boolean = false;
  @Input() variant: 'blue' | 'mid-calculation' = 'blue';

  showTooltip = false;

  onMouseEnter() {
    if (this.tooltip) {
      this.showTooltip = true;
    }
  }

  onMouseLeave() {
    this.showTooltip = false;
  }
}