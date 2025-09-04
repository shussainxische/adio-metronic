import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuDropdownComponent } from '../../menu/menu-dropdown/menu-dropdown.component';
import { MenuItemComponent } from '../../menu/menu-item/menu-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownWrapperComponent } from "../../../../wrappers/dropdown-wrapper/dropdown-wrapper.component";

@Component({
  selector: 'app-table-pagination',
  imports: [CommonModule, FormsModule, MenuDropdownComponent, MenuItemComponent, TranslateModule, DropdownWrapperComponent],
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.scss'
})
export class TablePaginationComponent {
  @Input() currentPage: number = 1;
  @Input() perPage: number = 10;
  @Input() totalItems: number = 0;
  @Input() pageSizes: number[] = [5, 10, 20, 50,100];
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();
  Math = Math;

  get isRtl(): boolean {
    return document.dir === 'rtl' || document.documentElement.lang === 'ar';
  }

  selectPerPage(size: number, event: MouseEvent) {
    // Update the value and emit the event
    this.perPage = size;
    this.perPageChange.emit(size);

    // Find the target element that was clicked
    const target = event.target as HTMLElement;

    // Find the closest menu item to the clicked element
    const menuItem = target.closest('.menu-item');

    // Find the parent menu
    const menuElement = menuItem?.closest('[data-menu="true"]');

    // Get the menu instance and dismiss it
    if (menuElement && typeof (window as any).KTMenu !== 'undefined') {
      const menu = (window as any).KTMenu.getInstance(menuElement);
      if (menu !== null) {
        menu.dismiss(menuItem);
      }
    }
  }

  get isLastPage(): boolean {
    return this.currentPage * this.perPage >= this.totalItems;
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.perPage);
  }

  getPageNumbers(): (number | "...")[] {
    const pages: (number | "...")[] = [];
    const totalPages = this.totalPages;

    // Always show first page
    pages.push(1);

    if (this.currentPage > 3) {
      pages.push('...');
    }

    // Calculate window around current page
    for (let i = Math.max(2, this.currentPage - 1);
         i <= Math.min(totalPages - 1, this.currentPage + 1);
         i++) {
      pages.push(i);
    }

    if (this.currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }
}
