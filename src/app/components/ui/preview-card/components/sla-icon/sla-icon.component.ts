import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sla-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="slaState" class="p-2 rounded-full">
      <!-- No SLA State -->
      <div *ngSwitchCase="'none'" class="w-4 h-4"></div>
      
      <!-- Active SLA State -->
      <div *ngSwitchCase="'active'" class="p-1 bg-green-100 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-green-600">
          <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      
      <!-- Expired SLA State -->
      <div *ngSwitchCase="'expired'" class="p-1 bg-gray-100 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-600">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `,
  styles: []
})
export class SlaIconComponent {
  @Input() slaState: 'none' | 'active' | 'expired' = 'none';
}