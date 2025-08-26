import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePaginationComponent } from '../table/table-pagination/table-pagination.component';

export interface DataTableColumn {
  field: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TablePaginationComponent],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th 
              *ngFor="let column of columns" 
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              [style.width]="column.width">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            *ngFor="let item of data" 
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            [class]="getRowClasses(item)"
            (click)="onRowClick(item)">
            <ng-container *ngTemplateOutlet="rowTemplate; context: { $implicit: item, columns: columns }"></ng-container>
          </tr>
        </tbody>
      </table>
    </div>
    
    <app-table-pagination 
      *ngIf="showPagination && totalItems > 0"
      [currentPage]="currentPage"
      [perPage]="perPage" 
      [totalItems]="totalItems"
      (pageChange)="pageChange.emit($event)"
      (perPageChange)="perPageChange.emit($event)">
    </app-table-pagination>
  `,
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showPagination: boolean = false;
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() perPage: number = 10;
  @Input() rowClasses?: (item: any) => string;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();
  
  @ContentChild('rowTemplate', { static: true }) rowTemplate!: TemplateRef<any>;

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }

  getRowClasses(item: any): string {
    return this.rowClasses ? this.rowClasses(item) : '';
  }
}