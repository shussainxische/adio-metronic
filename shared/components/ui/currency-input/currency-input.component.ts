import { Component, Input, forwardRef, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true,
    },
  ],
})
export class CurrencyInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() control?: FormControl;
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() unit: string = 'AED'; // AED, No., %
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  @ViewChild('inputElement') inputElement?: ElementRef;

  // Internal form control if no external control is provided
  private internalControl!: FormControl;
  private _value: any = '';
  private onChange = (value: any) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return (
      this.getControl() &&
      this.getControl().invalid &&
      (this.getControl().touched)
    );
  }

  // Helper method to get the active control (external or internal)
  getControl(): FormControl {
    return this.control || this.internalControl;
  }

  ngOnInit() {
    if (!this.control) {
      this.internalControl = new FormControl('');
    }

    if (this.value) {
      this.setInput(this.value);
    }

    this.updateDisabledState();

    this.getControl().valueChanges.subscribe((value) => {
      this._value = value;
      this.onChange(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.setInput(this.value);
    }

    if (changes['disabled']) {
      this.updateDisabledState();
    }
  }

  private updateDisabledState(): void {
    if (this.getControl()) {
      if (this.disabled) {
        this.getControl().disable({ emitEvent: false });
      } else {
        this.getControl().enable({ emitEvent: false });
      }
    }
  }

  writeValue(value: any): void {
    this._value = value;
    if (this.getControl()) {
      this.getControl().setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.updateDisabledState();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (this.getControl()) {
      this.getControl().setValue(value, { emitEvent: false });
    }

    this._value = value;
    this.onChange(value);
    this.value = value;
  }

  onFocus(event: FocusEvent) {
  }

  onBlur(event?: FocusEvent): void {
    this.onTouched();
  }

  focusInput() {
    if (this.disabled) {
      return;
    }

    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }

  setInput(value: string = '') {
    this._value = value;
    this.value = value;

    if (this.getControl()) {
      this.getControl().setValue(value, { emitEvent: true });
    }

    if (this.inputElement) {
      this.inputElement.nativeElement.value = value;
    }
  }
}