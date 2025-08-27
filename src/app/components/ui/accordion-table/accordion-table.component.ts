import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface AccordionTableRow {
  id: string;
  component: string;
  value: string | number;
  weight: string;
  score: string | number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  subRows?: AccordionSubRow[];
  hideSubHeaders?: boolean;
  finalScore?: {
    label: string;
    value: string | number;
    isHighlighted?: boolean;
  };
}

export interface AccordionSubRow {
  id: string;
  component: string;
  score?: string | number;
  weight?: string;
  weighted?: string | number;
  value?: string;
  isDivider?: boolean;
}

@Component({
  selector: 'app-accordion-table',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './accordion-table.component.html',
  styleUrl: './accordion-table.component.scss'
})
export class AccordionTableComponent {
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() totalScore: string = '';
  @Input() rows: AccordionTableRow[] = [];

  toggleRow(rowId: string) {
    const row = this.rows.find(r => r.id === rowId);
    if (row && row.isExpandable) {
      row.isExpanded = !row.isExpanded;
    }
  }

  getValueDisplay(row: AccordionTableRow): string {
    if (typeof row.value === 'string' && (row.value.includes('Applicable') || row.value.includes('Available'))) {
      return '';
    }
    return row.value.toString();
  }

  hasStatusBadge(row: AccordionTableRow): boolean {
    return typeof row.value === 'string' && (row.value.includes('Applicable') || row.value.includes('Available'));
  }

  getStatusBadgeText(row: AccordionTableRow): string {
    if (typeof row.value === 'string') {
      if (row.value.includes('Applicable')) return 'Applicable';
      if (row.value.includes('Available')) return 'Available';
    }
    return '';
  }

  getStatusBadgeClass(row: AccordionTableRow): string {
    const text = this.getStatusBadgeText(row);
    return text === 'Applicable' || text === 'Available' ? 'status-applicable' : 'status-not-applicable';
  }
}