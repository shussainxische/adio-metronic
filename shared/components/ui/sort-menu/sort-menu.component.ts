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
import { CommonModule } from '@angular/common';
import { AdioButtonComponent } from '../adio-button/adio-button.component';
import { TooltipModule } from 'primeng/tooltip';
import { MenuDropdownComponent } from '../menu/menu-dropdown/menu-dropdown.component';
import { MenuItemComponent } from '../menu/menu-item/menu-item.component';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownWrapperComponent } from '../../../wrappers/dropdown-wrapper/dropdown-wrapper.component';

@Component({
  selector: 'app-sort-menu',
  imports: [
    AdioButtonComponent,
    CommonModule,
    TooltipModule,
    MenuDropdownComponent,
    MenuItemComponent,
    TranslateModule,
    DropdownWrapperComponent,
  ],
  templateUrl: './sort-menu.component.html',
  styleUrls: ['./sort-menu.component.scss'],
})
export class SortMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() sortOptions: { label: string; value: string; icon?: string }[] = [
    { label: 'table.sort_by_newest', value: 'newest', icon: 'access_time' },
    { label: 'table.sort_by_oldest', value: 'oldest', icon: 'access_time' },
  ];
  @Input() selectedSort: string = '';
  @Input() label: string = '';
  @Output() sortChange = new EventEmitter<string>();

  @ViewChild('parentWrapper') parentWrapper: ElementRef;
  @ViewChild('menuDropdownWrapper') menuDropdownWrapper: ElementRef;

  showDropdown = false;
  menuOpening = false;
  dropdownWidth = '201px';
  dropdownWidthCalculated = false;

  private destroy$ = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.showDropdown) {
          this.applyDropdownWidth();
        }
      });
      if (this.parentWrapper?.nativeElement) {
        this.resizeObserver.observe(this.parentWrapper.nativeElement);
      }
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

  toggleDropdown(): void {
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

  // Add this method to check if an option is selected
  isSelected(value: string): boolean {
    return this.selectedSort === value;
  }

  onSortOptionClick(option: { label: string; value: string }): void {
    this.selectedSort = option.value;
    this.sortChange.emit(this.selectedSort);
    this.showDropdown = false;

    // Force close by clicking outside to trigger the document:click handler
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
