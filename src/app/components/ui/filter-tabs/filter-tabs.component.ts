import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterTab {
  key: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-4 mb-6">
      <button 
        *ngFor="let tab of tabs"
        (click)="onTabClick(tab.key)"
        [ngClass]="selectedTab === tab.key ? 'bg-surface-active-status text-primary-on-surface' : 'text-gray-600'"
        class="px-4 py-2 hover:bg-surface-active-status hover:text-primary-on-surface transition-colors">
        {{ tab.label }} ({{ tab.count }})
      </button>
      
      <div class="ml-auto" *ngIf="showCount">
        <span class="text-2sm text-gray-600">{{ countLabel }}</span>
      </div>
    </div>
  `,
  styleUrl: './filter-tabs.component.scss'
})
export class FilterTabsComponent {
  @Input() tabs: FilterTab[] = [];
  @Input() selectedTab: string = '';
  @Input() showCount: boolean = true;
  @Input() countLabel: string = '';
  @Output() tabChanged = new EventEmitter<string>();

  onTabClick(tabKey: string) {
    this.tabChanged.emit(tabKey);
  }
}