import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3">
      <div class="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          [class]="progressColor"
          [style.width.%]="progress">
        </div>
      </div>
      <span class="text-xs font-bold text-primary-on-surface">{{ progress }}%</span>
    </div>
  `,
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() color: 'primary' | 'yellow' | 'green' | 'blue' | 'red' = 'primary';
  @Input() urgent: boolean = false;

  get progressColor(): string {
    if (this.urgent) {
      return 'bg-red-500';
    }
    
    const colorMap = {
      'primary': 'bg-primary',
      'yellow': 'bg-yellow-500',
      'green': 'bg-green-500', 
      'blue': 'bg-blue-500',
      'red': 'bg-red-500'
    };
    return colorMap[this.color];
  }
}