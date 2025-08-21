import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderComponent } from '../loader/loader.component';
import { CheckboxInputComponent } from '../checkbox-input/checkbox-input.component';
import { InputComponent } from '../input/input.component';
import { MenuItemComponent } from '../menu/menu-item/menu-item.component';
import { MenuDropdownComponent } from '../menu/menu-dropdown/menu-dropdown.component';
import { CommonModule } from '@angular/common';
import { DropdownWrapperComponent } from '../../../wrappers/dropdown-wrapper/dropdown-wrapper.component';

export interface SelectOption {
  value: string;
  label: string;
  arabicName?: string;
  icon?: string; // URL or path to icon/image
  iconClass?: string; // CSS class for icon (like FontAwesome)
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // TranslateModule,
    LoaderComponent,
    MenuDropdownComponent,
    // CheckboxInputComponent,
    MenuItemComponent,
    // InputComponent,
    DropdownWrapperComponent,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() control!: FormControl;
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'common.select';
  @Input() label: string = '';
  @Input() minWidth: string;
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() showIcons: boolean = false; // New: Enable icon display
  @Input() iconSize: string = 'size-4'; // New: Icon size class
  @Input() bindLable: boolean = false;

  @Output() change = new EventEmitter<any>();

  @ViewChild('parentWrapper') parentWrapper: ElementRef;
  @ViewChild('menuDropdownWrapper') menuDropdownWrapper: ElementRef;

  isDropdownOpen = false;
  private isOptionClicked = false;
  dropdownWidth: string = '0px';
  dropdownWidthCalculated = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    // private translate: TranslateService
  ) {}

  ngOnInit() {
    this.updateDisabledState();
  }

  ngAfterViewInit() {
    // Calculate initial dropdown width
    this.calculateDropdownWidth();

    // Setup resize observer
    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateDropdownWidth();

        // If dropdown is open, make sure it has the correct width
        if (this.isDropdownOpen) {
          this.applyDropdownWidth();
        }
      });

      if (this.parentWrapper?.nativeElement) {
        this.resizeObserver.observe(this.parentWrapper.nativeElement);
      }
    }
  }

  /**
   * Calculate the width of the parent element
   */
  calculateDropdownWidth(): void {
    if (this.parentWrapper?.nativeElement) {
      const width =
        this.parentWrapper.nativeElement.getBoundingClientRect().width;
      this.dropdownWidth = `${width}px`;
      this.dropdownWidthCalculated = true;
    }
  }

  /**
   * Apply the calculated width to the dropdown menu
   */
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

  @HostListener('window:resize')
  onWindowResize(): void {
    this.calculateDropdownWidth();
    if (this.isDropdownOpen) {
      this.applyDropdownWidth();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if click was inside this component
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    // If option was clicked, we need to force close the dropdown
    if (this.isOptionClicked) {
      this.isOptionClicked = false;
      this.isDropdownOpen = false;
      // Try to close menu-dropdown using document click
      setTimeout(() => {
        document.body.click();
      }, 0);
      return;
    }

    // If dropdown was open and click is outside
    if (this.isDropdownOpen && !clickedInside) {
      this.isDropdownOpen = false;

      // Mark control as touched when clicking outside
      if (this.control && !this.control.touched) {
        setTimeout(() => {
          this.control.markAsTouched();
        }, 0);
      }
    }
  }

  onTriggerClick(event: Event) {
    // Before opening dropdown, ensure width is calculated
    if (!this.dropdownWidthCalculated) {
      this.calculateDropdownWidth();
    }

    this.isDropdownOpen = true;

    // Apply width immediately when opening
    this.applyDropdownWidth();
  }

  get hasError(): boolean {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] || changes['mode']) {
      this.updateDisabledState();
    }
  }

  getSelectedOption(): SelectOption | undefined {
    if (!this.control.value) {
      return undefined;
    }
    return this.options.find((option) => option.value === this.control.value);
  }

  getSelectedLabel(): string {
    const selectedOption = this.getSelectedOption();
    if (selectedOption) {
      return this.getOptionDisplayText(selectedOption);
    }
    return 'Test'//this.translate.instant(this.placeholder);
  }

  private updateDisabledState() {
    if (!this.control) {
      return;
    }
    if (this.disabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onOptionChange(option: SelectOption, event?: MouseEvent): void {
    // If no form control or option is disabled, do nothing
    if (!this.control || option.disabled) {
      return;
    }

    // Mark that an option was clicked and prevent the dropdown from closing immediately
    if (event) {
      this.isOptionClicked = true;
      event.stopPropagation();
    }

    // Update the FormControl
    this.control.setValue(option.value);
    this.control.markAsTouched();
    this.control.markAsDirty();

    // Close dropdown
    this.isDropdownOpen = false;

    // Emit the change (if emitter is present)
    this.change?.emit({
      target: {
        value: this.control.value,
        label: option.label,
        option,
      },
    });

    // Ensure any document‐level click handlers see a “click” to finalize closing
    setTimeout(() => document.body.click(), 0);
  }

  trackByOption(index: number, option: SelectOption): string {
    return option.value;
  }

  ngOnDestroy() {
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  getOptionDisplayText(option: SelectOption): string {
    // const currentLang = this.translate.currentLang;
    // if (currentLang === 'ar' && option.arabicName) {
    //   return option.arabicName;
    // }
    return 'Test';// this.translate.instant(option.label);
  }
}
