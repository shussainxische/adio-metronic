import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngSwitch]="alertState" class="p-2 rounded-full">
      <!-- No Alert State -->
      <div *ngSwitchCase="'none'" class="w-4 h-4"></div>
      
      <!-- Warning State -->
      <div *ngSwitchCase="'warning'" class="p-1 bg-yellow-100 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-yellow-600">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- Critical State -->
      <div *ngSwitchCase="'critical'" class="p-1 bg-red-100 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-red-600">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `,
  styles: []
})
export class AlertIconComponent {
  @Input() alertState: 'none' | 'warning' | 'critical' = 'none';
}