import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoTableWidgetComponent, InfoTableData } from '../../../components/ui/widgets/info-table-widget/info-table-widget.component';
import { ActivityLogComponent } from '../activity-log/activity-log.component';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, InfoTableWidgetComponent, ActivityLogComponent],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss'
})
export class RightPanelComponent {
  @Input() position: 'left' | 'right' = 'right';
  @Input() width: string = 'w-80';
  @Input() className: string = '';
  @Input() summaryTableData!: InfoTableData;
  @Input() contactTableData!: InfoTableData;
  
  activeTab: 'summary' | 'activity' = 'summary';
  openWidget: 'summary' | 'contact' | null = 'summary'; // Only one widget open at a time
  
  switchTab(tab: 'summary' | 'activity') {
    this.activeTab = tab;
  }
  
  toggleWidget(widget: 'summary' | 'contact') {
    if (this.openWidget === widget) {
      this.openWidget = null; // Close if it's already open
    } else {
      this.openWidget = widget; // Open this widget and close others
    }
  }
  
  isWidgetOpen(widget: 'summary' | 'contact'): boolean {
    return this.openWidget === widget;
  }
}