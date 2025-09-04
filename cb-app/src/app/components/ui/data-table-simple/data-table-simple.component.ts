import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SimpleTableRow {
  fieldLabel: string;
  labelEn: string;
  labelAr: string;
}

@Component({
  selector: 'app-data-table-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div *ngIf="title" class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p *ngIf="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <table class="w-full">
        <tbody>
          <tr *ngFor="let row of data; let last = last" 
              [class.border-b]="!last" 
              class="border-gray-100">
            <td class="px-6 w-1/2" [class.py-2]="!last" [class.pt-2]="last" [class.pb-4]="last">
              <div class="text-xs text-gray-500 mb-1">{{ row.fieldLabel }}</div>
              <div class="text-sm text-gray-900">{{ row.labelEn }}</div>
            </td>
            <td class="px-6 w-1/2 text-right" [class.py-2]="!last" [class.pt-2]="last" [class.pb-4]="last" dir="rtl">
              <div class="text-xs text-gray-500 mb-1">{{ row.fieldLabel }}</div>
              <div class="text-sm text-gray-900">{{ row.labelAr }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DataTableSimpleComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() data: SimpleTableRow[] = [];
}