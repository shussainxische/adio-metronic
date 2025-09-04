import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: 'completed' | 'active' | 'pending';
  color: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  @Input() title: string = 'Timeline';
  @Input() subtitle: string = '';
  @Input() steps: TimelineStep[] = [];

  getStatusColor(step: TimelineStep): string {
    if (step.color) {
      return step.color.startsWith('#') ? step.color : `text-${step.color}-600`;
    }
    
    switch (step.status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-yellow-600';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  }

  getBgColor(step: TimelineStep): string {
    if (step.color) {
      return step.color.startsWith('#') ? step.color : `bg-${step.color}-600`;
    }
    
    switch (step.status) {
      case 'completed': return 'bg-green-600';
      case 'active': return 'bg-yellow-600';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  }

  get processedSteps() {
    return this.steps.map(step => ({
      ...step,
      duration: this.calculateDuration(step),
      dateRange: this.getDateRange(step)
    }));
  }

  private calculateDuration(step: TimelineStep): string {
    if (!step.endDate) {
      if (step.status === 'active') {
        const start = new Date(step.startDate);
        const now = new Date();
        const months = this.getMonthsDifference(start, now);
        return `${months} months (Ongoing)`;
      } else if (step.status === 'pending') {
        return 'TBD';
      }
    }
    
    const start = new Date(step.startDate);
    const end = new Date(step.endDate);
    const months = this.getMonthsDifference(start, end);
    return `${months} months`;
  }

  private getMonthsDifference(start: Date, end: Date): number {
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  }

  private getDateRange(step: TimelineStep): string {
    const startDate = new Date(step.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!step.endDate) {
      return step.status === 'active' ? `${startDate} – Present` : 'Pending';
    }
    
    const endDate = new Date(step.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${startDate} – ${endDate}`;
  }
}