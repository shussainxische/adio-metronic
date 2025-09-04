import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface ActivityLogItem {
  id: string;
  message: string;
  user: string;
  timestamp: string;
  icon: string;
  iconColor: 'yellow' | 'green' | 'purple' | 'blue' | 'red';
}

@Component({
  selector: 'app-activity-log-item',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './activity-log-item.component.html',
  styleUrl: './activity-log-item.component.scss'
})
export class ActivityLogItemComponent {
  @Input() item!: ActivityLogItem;
  
  get iconColorClass(): string {
    const colorMap = {
      'yellow': 'bg-yellow-100 text-yellow-600',
      'green': 'bg-green-100 text-green-600', 
      'purple': 'bg-purple-100 text-purple-600',
      'blue': 'bg-blue-100 text-blue-600',
      'red': 'bg-red-100 text-red-600'
    };
    return colorMap[this.item.iconColor] || colorMap['green'];
  }
}