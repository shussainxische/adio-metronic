import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          [class]="progressColor"
          [style.width.%]="progress">
        </div>
      </div>
      
      <div class="flex justify-between items-center text-xs">
        <span [class]="deadlineColor" *ngIf="deadline">{{ deadline }}</span>
        <span class="font-bold text-primary-on-surface">{{ progress }}%</span>
      </div>
    </div>
  `,
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() progress: number = 0;
  @Input() deadline?: string;
  @Input() color: 'primary' | 'yellow' | 'green' | 'blue' | 'red' = 'primary';
  @Input() urgent: boolean = false;

  get progressColor(): string {
    const colorMap = {
      'primary': 'bg-primary',
      'yellow': 'bg-yellow-500',
      'green': 'bg-green-500', 
      'blue': 'bg-blue-500',
      'red': 'bg-red-500'
    };
    return colorMap[this.color];
  }

  get deadlineColor(): string {
    return this.urgent ? 'text-red' : 'text-black';
  }
}