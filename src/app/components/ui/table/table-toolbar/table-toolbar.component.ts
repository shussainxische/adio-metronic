import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { InputComponent } from '../../input/input.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdioButtonComponent } from '../../adio-button/adio-button.component';
import { DropdownFilterComponent } from '../../dropdown-filter/dropdown-filter.component';
import { SortMenuComponent } from '../../sort-menu/sort-menu.component';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table-toolbar',
  imports: [
    SortMenuComponent,
    CommonModule,
    FormsModule,
    AdioButtonComponent,
    DropdownFilterComponent,
    // TranslateModule,
    InputComponent,
  ],
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.scss',
})
export class TableToolbarComponent {
  @ViewChild(InputComponent) searchInputComponent: InputComponent;

  @Input() exportRoute: string = '';
  @Input() newItemRoute: string = '';
  @Input() hideSeparator: boolean = false;
  @Input() newItemLabel: string = '';
  @Input() searchPlaceholder: string = 'Search';
  @Input() isSearchEnabled: boolean = true;
  @Input() tooltipMessage: string = 'Search';

  // Add these new inputs for sort state
  @Input() currentSort: string = '';
  sortOptions: {
    label: string;
    value: string;
    field: string;
    direction: 'asc' | 'desc';
  }[] = [
    {
      label: 'table.sort_by_newest',
      value: 'newest',
      field: 'createdon',
      direction: 'desc',
    },
    {
      label: 'table.sort_by_oldest',
      value: 'oldest',
      field: 'createdon',
      direction: 'asc',
    },
  ];

  isInputFocused: boolean = false;
  typingTimeout: any;

  @Input()
  get searchText(): string {
    return this._searchText;
  }
  set searchText(value: string) {
    // Keep track of old value for change detection
    const oldValue = this._searchText;
    this._searchText = value;

    // If value is being reset to empty, mark to reset the input component
    if (value === '' && oldValue !== '') {
      // Wait for the next cycle to actually reset the input
      setTimeout(() => {
        this.resetSearch();
      });
    }
    this.searchTextChange.emit(value);
  }
  private _searchText: string = '';

  @Input() totalItems = 0;
  @Input() perPage?: number;
  @Input() hasActiveFilters: boolean = false;

  @Output() searchTextChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<{
    field: string;
    direction: 'asc' | 'desc';
  }>();
  @Output() perPageChange = new EventEmitter<number>();

  // constructor(private translateService: TranslateService) {}

  // Public method to reset the search input - can be called from parent
  resetSearch() {
    if (this.searchInputComponent) {
      this.searchInputComponent.setInput('');
    }
    this._searchText = '';
    this.searchTextChange.emit('');
    this.search.emit('');

    // Reset the focus state to collapse the input field
    // this.isInputFocused = false;
    this.focusSearchInput();
  }

  // New method to focus the search input
  focusSearchInput() {
    if (this.searchInputComponent) {
      // Focus the input using the existing focus method in InputComponent
      this.searchInputComponent.focusInput();
      // Update focus state to expand the input
      this.isInputFocused = true;
    }
  }

  isRtl() {
    return true; // this.translateService.currentLang === 'ar';
  }

  onSortBy(sortValue: string): void {
    const sortOption = this.sortOptions.find(
      (option) => option.value === sortValue
    );

    if (sortOption) {
      this.currentSort = sortValue;
      this.sortChanged.emit({
        field: sortOption.field,
        direction: sortOption.direction,
      });
    }
  }

  // Methods to handle input focus state
  onInputFocus(): void {
    this.isInputFocused = true;
  }

  onInputBlur(): void {
    this.isInputFocused = false;
    this.tooltipMessage = '';
  }

  // Dynamic class binding based on focus state
  get inputClassName(): string {
    if (this.isInputFocused && !this.hideSeparator) {
      return 'absolute w-[calc(100%-66px)] h-[42px] block transition-width duration-300 ease-in-out bg-surface';
    }
    if (this.isInputFocused && this.hideSeparator) {
      return 'absolute w-[calc(100%-50px)] h-[42px] block transition-width duration-300 ease-in-out bg-surface';
    }
    return 'absolute w-[42px] h-[42px] block transition-width duration-300 ease-in-out ps-0 cursor-pointer bg-surface';
  }

  get inputClass(): string {
    return this.isInputFocused
      ? 'transition-all'
      : 'ps-0 pe-0 w-0 transition-all';
  }

  onSearch(value: string) {
    this.isInputFocused = true;
    this._searchText = value;
    this.search.emit(value); // Correctly forward the search text to the parent
  }

  onPerPageChange(perPage: number): void {
    this.perPageChange.emit(perPage);
  }

  get displayedStartIndex() {
    return this.perPage > this.totalItems ? this.totalItems : this.perPage;
  }
}
