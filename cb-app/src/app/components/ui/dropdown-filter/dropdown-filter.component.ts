import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { InputComponent } from '../input/input.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MenuDropdownComponent } from '../menu/menu-dropdown/menu-dropdown.component';
import { MenuItemComponent } from '../menu/menu-item/menu-item.component';
import { LoaderComponent } from '../loader/loader.component';
import { DropdownWrapperComponent } from '../../../wrappers/dropdown-wrapper/dropdown-wrapper.component';

@Component({
  selector: 'app-dropdown-filter',
  imports: [
    InputComponent,
    CommonModule,
    TranslateModule,
    MenuDropdownComponent,
    MenuItemComponent,
    LoaderComponent,
    DropdownWrapperComponent,
  ],
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss'],
  host: {
    class: 'w-full h-full',
  },
})
export class DropdownFilterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() label: string = '';
  @Input() errorMessage: string = '';
  @Input() isMandatory: boolean = false;
  @Input() control: any; // FormControl for validation
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // Add this computed property
  get hasError(): boolean {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }
  @Input() placeholder: string = 'common.select';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() options: { label: string; value: any }[] = [];
  @Input() selectedItems: any[] = [];
  @Input() showClearAll: boolean = true;
  @Input() showAllOption: boolean = true;
  @Input() menuClass: string = '';
  @Input() useCheckboxes: boolean = true;
  @Input() returnFullObjects: boolean = false;
  @Input() selectedLabel: string = '';
  // Input to control filtering mode
  @Input() localFiltering: boolean = true;

  // Infinite scrolling inputs
  @Input() enableInfiniteScroll: boolean = false;
  @Input() pageSize: number = 20;
  @Input() totalItems: number = 0;

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() cleared = new EventEmitter<void>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<number>();

  @ViewChild('parentWrapper') parentWrapper: ElementRef;
  @ViewChild('menuDropdownWrapper') menuDropdownWrapper: ElementRef;

  searchControl = new FormControl('');
  filteredOptions: { label: string; value: any }[] = [];
  selectionChangeSubject = new Subject<any>();
  showDropdown = false;
  menuOpening = false;
  dropdownWidth: string = '0px';
  dropdownWidthCalculated = false;

  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.filteredOptions = this.options;

    this.searchControl.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((term: string = '') => {
        this.searchTermChange.emit(term);
        if (this.localFiltering) {
          this.filterOptions(term);
        }
      });

    this.selectionChangeSubject
      .pipe(debounceTime(300))
      .subscribe((selection) => {
        this.selectionChange.emit(selection);
      });
  }

  ngAfterViewInit(): void {
    // Calculate initial width
    this.calculateDropdownWidth();

    // Setup resize observer
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateDropdownWidth();

        // If dropdown is open, make sure it has the same width as parent
        if (this.showDropdown) {
          this.applyDropdownWidth();
        }
      });

      if (this.parentWrapper?.nativeElement) {
        this.resizeObserver.observe(this.parentWrapper.nativeElement);
      }
    }
  }

  calculateDropdownWidth(): void {
    if (this.parentWrapper?.nativeElement) {
      const width =
        this.parentWrapper.nativeElement.getBoundingClientRect().width;
      if (width > 300) {
        this.dropdownWidth = `${width}px`;
      } else {
        this.dropdownWidth = `300px`;
      }
      this.dropdownWidthCalculated = true;
    }
  }

  applyDropdownWidth(): void {
    setTimeout(() => {
      if (this.menuDropdownWrapper?.nativeElement) {
        const menuDropdown =
          this.menuDropdownWrapper.nativeElement.querySelector(
            '.menu-dropdown'
          );
        if (menuDropdown) {
          this.renderer.setStyle(menuDropdown, 'width', this.dropdownWidth);
          this.renderer.setStyle(menuDropdown, 'max-width', this.dropdownWidth);
        }
      }
    }, 0);
  }

  getSelectedLabel(): string {
    // ✅ If selectedLabel is provided, use it directly
    if (this.selectedLabel) {
      return this.selectedLabel;
    }

    if (!this.selectedItems || this.selectedItems.length === 0)
      return this.placeholder;

    if (this.returnFullObjects) {
      // If we're returning full objects, the selected item IS the full object
      const selectedItem = this.selectedItems[0];
      return selectedItem.label || this.placeholder;
    } else {
      // If we're returning just values, find the option by value
      const selectedOption = this.options.find(
        (opt) => opt.value === this.selectedItems[0]
      );
      return selectedOption?.label || this.placeholder;
    }
  }

  private previousOptionsLength = 0;
  ngOnChanges(): void {
    if (this.localFiltering) {
      this.filteredOptions = this.options;
      const currentSearch = this.searchControl.value || '';
      if (currentSearch.trim()) {
        this.filterOptions(currentSearch);
      }
    } else {
      this.filteredOptions = this.options;
    }

    if (this.options.length > this.previousOptionsLength) {
      this.hasScrolledAboveThreshold = true;
      this.previousOptionsLength = this.options.length;
    }
  }

  toggleDropdown(): void {
    this.calculateDropdownWidth();

    if (!this.showDropdown) {
      this.applyDropdownWidth();
      setTimeout(() => {
        this.menuOpening = true;
        this.showDropdown = true;
      }, 0);
    } else {
      this.menuOpening = false;
      this.showDropdown = false;
    }
  }

  isSelected(value: any): boolean {
    if (!Array.isArray(this.selectedItems)) return false;

    return this.selectedItems.some((item) => {
      // Handle both scenarios - when selectedItems contains IDs vs full objects
      const itemValue = this.returnFullObjects ? item.value : item;
      return itemValue === value;
    });
  }

  onOptionChange(option: { label: string; value: any }): void {
    if (this.useCheckboxes) {
      const index = this.selectedItems.findIndex((item) => {
        // Handle both scenarios - when selectedItems contains IDs vs full objects
        const itemValue = this.returnFullObjects ? item.value : item;
        return itemValue === option.value;
      });

      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        // Add either the full object or just the value based on the flag
        this.selectedItems.push(this.returnFullObjects ? option : option.value);
      }

      this.selectionChangeSubject.next([...this.selectedItems]);
    }
  }

  onNonCheckboxOptionClick(option: { label: string; value: any }): void {
    if (!this.useCheckboxes) {
      // Emit either the full object or just the value based on the flag
      this.selectedItems = [this.returnFullObjects ? option : option.value];
      this.selectionChangeSubject.next([...this.selectedItems]);
      this.showDropdown = false;

      setTimeout(() => {
        document.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      }, 0);
    }
  }

  clearSelections(event?: MouseEvent): void {
    if (event) event.stopPropagation();

    this.selectedItems = [];
    this.selectionChange.emit([]);
    this.searchControl.setValue('');

    if (this.localFiltering) {
      this.filteredOptions = this.options;
    }

    this.cleared.emit();
  }

  filterOptions(searchText: string): void {
    const query = searchText.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }

  private isLoadingMore = false;
  private hasScrolledAboveThreshold = true;
  private scrollTimeout: any = null;

  onScroll(event: Event): void {
    if (!this.enableInfiniteScroll || this.isLoadingMore) return;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const element = event.target as HTMLElement;
      const scrollPosition = element.scrollTop + element.clientHeight;
      const scrollHeight = element.scrollHeight;
      const pixelThreshold = 50;
      const scrollThreshold = scrollHeight - pixelThreshold;

      if (scrollPosition < scrollThreshold) {
        this.hasScrolledAboveThreshold = true;
        return;
      }

      if (
        this.hasScrolledAboveThreshold &&
        scrollPosition > scrollThreshold &&
        this.options.length < this.totalItems
      ) {
        const page = Math.floor(this.options.length / this.pageSize) + 1;
        this.isLoadingMore = true;
        this.loadMore.emit(page);

        this.hasScrolledAboveThreshold = false;

        setTimeout(() => {
          this.isLoadingMore = false;
        }, 1000);
      }
    }, 200);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.calculateDropdownWidth();
    if (this.showDropdown) {
      this.applyDropdownWidth();
    }
  }

  selectAll(): void {
    if (this.returnFullObjects) {
      this.selectedItems = [...this.options]; // Select all option objects
    } else {
      this.selectedItems = this.options.map((o) => o.value); // Select all values
    }
    this.selectionChange.emit([...this.selectedItems]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
