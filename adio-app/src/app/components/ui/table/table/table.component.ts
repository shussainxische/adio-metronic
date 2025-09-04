import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TablePaginationComponent } from '../table-pagination/table-pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [TablePaginationComponent, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() className = '';
  @Input() showPagination: boolean = true;
  @Input() currentPage: number = 1;
  @Input() perPage: number = 10;
  @Input() totalItems: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPerPageChange(perPage: number): void {
    this.perPageChange.emit(perPage);
  }
}
