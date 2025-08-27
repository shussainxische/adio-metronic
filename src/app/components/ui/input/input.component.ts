import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  forwardRef,
  ContentChild,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
// import { ReplaceEnglishWithArabicDirective } from '../../../directives/replace-english-with-arabic/replace-english-with-arabic.directive';
import { Language, TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // ReplaceEnglishWithArabicDirective,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': '"h-full " + className',
  },
})
export class InputComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() control?: FormControl;
  @Input() value: string = '';
  @Input() type: any = 'text';
  @Input() placeholder: string = '';
  @Input() className = '';
  @Input() inputClass = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() language: Language = null;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() readOnly: boolean = false;
  @ContentChild('[iconBefore]') iconBeforeContent: any;
  @ContentChild('[iconAfter]') iconAfterContent: any;
  @Input() labelStyle: 'floating' | 'standard' = 'standard';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() variant: 'default' | 'locked' = 'default';
  
  // New validation inputs
@Input() validationType: 'email' | 'mobile' | 'name' | 'number' | 'text' | 'arabic' = 'text';
  @Input() pattern?: string; // Custom pattern override
  @Input() maxLength?: number;
  @Input() minLength?: number;

  @ViewChild('rtlInput') rtlInput?: ElementRef;
  @ViewChild('ltrInput') ltrInput?: ElementRef;
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() search = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  // Internal form control if no external control is provided
  private internalControl!: FormControl;
  // Internal value for ControlValueAccessor
  private _value: any = '';
  private onChange: (_: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Validation patterns
  private validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[+\-]?[0-9\s()]*$/,
  name: /^[a-zA-Z0-9\s]*$/, 
  number: /^[0-9]*$/,
  arabic: /^[\u0600-\u06FF0-9\s]*$/ // 
};
  // Input restriction patterns (what characters are allowed during typing)

private inputRestrictionPatterns = {
  email: /[a-zA-Z0-9._%+-@]/,
  mobile: /[0-9\s()]/,
  name: /[a-zA-Z0-9\s]/,
  number: /[0-9]/,
  arabic: /[\u0600-\u06FF0-9\s]/
};



  get isRtl(): boolean {
    return this.language === 'ar';
  }

  get hasError(): boolean {
    return (
      this.getControl() &&
      this.getControl().invalid &&
      (this.getControl().touched)
    );
  }

  get hasIconBefore(): boolean {
    return !!this.iconBeforeContent;
  }

  get hasIconAfter(): boolean {
    return !!this.iconAfterContent;
  }

  get isLocked(): boolean {
    return this.variant === 'locked';
  }

get inputPattern(): string {
  if (this.pattern) {
    return this.pattern;
  }

  switch (this.validationType) {
    case 'email':
      return '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
    case 'mobile':
      return '[+\\-0-9\\s()]*';
    case 'name':
      return '[a-zA-Z0-9\\s]*';   
    case 'number':
      return '[0-9]*';
    case 'arabic':
      return '[\\u0600-\\u06FF0-9\\s]*'; 
    default:
      return '';
  }
}



  // Helper method to get the active control (external or internal)
  getControl(): FormControl {
    return this.control || this.internalControl;
  }

  ngOnInit() {
    // Create internal control if external is not provided
    if (!this.control) {
      this.internalControl = new FormControl(this.value);
    }

    // Set initial value from direct input if provided
    if (this.value) {
      this.setInput(this.value);
    }

    // Set initial disabled state
    this.updateDisabledState();

    // Subscribe to the control's value changes
    this.getControl().valueChanges.subscribe((value) => {
      this._value = value;
      this.onChange(value);
      this.valueChange.emit(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if value input changed
    if (changes['value'] && !changes['value'].firstChange) {
      this.setInput(this.value);
    }

    // Check if the disabled property has changed
    if (changes['disabled']) {
      this.updateDisabledState();
    }
  }

  // Helper method to update disabled state
  private updateDisabledState(): void {
    if (this.getControl()) {
      if (this.disabled) {
        this.getControl().disable({ emitEvent: false });
      } else {
        this.getControl().enable({ emitEvent: false });
      }
    }
  }

  // ControlValueAccessor methods
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


handleInput(event: any) {
  let value = event.target.value;
  
  // Apply input restrictions based on validation type
  value = this.applyInputRestrictions(value);
  
  // Update the input field value if it was modified
  if (value !== event.target.value) {
    event.target.value = value;
  }

  // Apply max length if specified
  if (this.maxLength && value.length > this.maxLength) {
    value = value.substring(0, this.maxLength);
    event.target.value = value;
  }
  
  // Only update form control value, don't trigger validation yet
  if (this.getControl()) {
    this.getControl().setValue(value, { emitEvent: false });
  }

  // Update internal state and emit changes
  this._value = value;
  this.onChange(value);
  this.value = value;
  this.valueChange.emit(value);
  this.search.emit(value);
}


  // Apply input restrictions during typing
  private applyInputRestrictions(value: string): string {
    if (this.validationType === 'text') {
      return value;
    }

    if (this.validationType === 'mobile') {
      return this.applyMobileRestrictions(value);
    }

    const pattern = this.inputRestrictionPatterns[this.validationType];
    if (!pattern) {
      return value;
    }

    return value
      .split('')
      .filter(char => pattern.test(char))
      .join('');
  }
  private applyMobileRestrictions(value: string): string {
    if (!value) return value;
    
    // Remove all invalid characters first
    let cleaned = value.replace(/[^+\-0-9\s()]/g, '');
    
    // Handle leading symbol (+ or -)
    let leadingSymbol = '';
    let restOfNumber = cleaned;
    
    if (cleaned.startsWith('+') || cleaned.startsWith('-')) {
      leadingSymbol = cleaned[0];
      restOfNumber = cleaned.substring(1);
    }
    
    // Remove any remaining + or - symbols from the rest
    restOfNumber = restOfNumber.replace(/[+\-]/g, '');
    
    // Combine leading symbol with the rest
    return leadingSymbol + restOfNumber;
  }



  // Validate the complete value
  isValidValue(value: string): boolean {
    if (!value || this.validationType === 'text') {
      return true;
    }

    const pattern = this.validationPatterns[this.validationType];
    return pattern ? pattern.test(value) : true;
  }

  // Handle keypress events for additional validation
  onKeyPress(event: KeyboardEvent) {
    const char = event.key;
    
    // Ignore special keys (Arrow keys, Backspace, Delete, etc.)
    if (char.length > 1) {
      return true;
    }
    
    const target = event.target as HTMLInputElement;
    const cursorPosition = target.selectionStart || 0;
    
    if (this.validationType === 'mobile') {
      // For mobile, check position-specific rules
      if (cursorPosition === 0) {
        // First position: allow +, -, numbers, spaces, parentheses
        if (!/[+\-0-9\s()]/.test(char)) {
          event.preventDefault();
          return false;
        }
      } else {
        // Other positions: only allow numbers, spaces, parentheses
        if (!/[0-9\s()]/.test(char)) {
          event.preventDefault();
          return false;
        }
      }
    } else if (this.validationType !== 'text') {
      const pattern = this.inputRestrictionPatterns[this.validationType];
      if (pattern && !pattern.test(char)) {
        event.preventDefault();
        return false;
      }
    }

    return true;
  }


onPaste(event: ClipboardEvent) {
  event.preventDefault();
  
  const clipboardData = event.clipboardData;
  const pastedText = clipboardData?.getData('text') || '';
  
  let cleanedText = '';
  
  if (this.validationType === 'mobile') {
    cleanedText = this.applyMobileRestrictions(pastedText);
  } else {
    cleanedText = this.applyInputRestrictions(pastedText);
  }
  
  const target = event.target as HTMLInputElement;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  
  const currentValue = target.value;
  let newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);
  
  // For mobile, ensure we don't end up with multiple leading symbols
  if (this.validationType === 'mobile') {
    newValue = this.applyMobileRestrictions(newValue);
  }
  
  const finalValue = this.maxLength && newValue.length > this.maxLength 
    ? newValue.substring(0, this.maxLength)
    : newValue;
  
  // Update the input element value
  target.value = finalValue;
  
  // DIRECTLY update the form control value and validation
  if (this.getControl()) {
    // Set the value on the form control
    this.getControl().setValue(finalValue, { emitEvent: false });
    
    // Handle minLength validation manually
    if (this.minLength) {
      if (finalValue.length < this.minLength && finalValue.length > 0) {
        this.getControl().setErrors({ 
          ...this.getControl().errors, 
          minlength: { requiredLength: this.minLength, actualLength: finalValue.length } 
        });
      } else if (this.getControl().errors?.['minlength'] && finalValue.length >= this.minLength) {
        const errors = { ...this.getControl().errors };
        delete errors['minlength'];
        this.getControl().setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
    
    // Force validation update
    this.getControl().updateValueAndValidity();
    this.getControl().markAsDirty();
    this.getControl().markAsTouched();
  }
  
  // Update internal state
  this._value = finalValue;
  this.value = finalValue;
  
  // Emit changes
  this.onChange(finalValue);
  this.valueChange.emit(finalValue);
  this.search.emit(finalValue);
  
  // Set cursor position
  const newPosition = start + cleanedText.length;
  setTimeout(() => {
    target.setSelectionRange(newPosition, newPosition);
  }, 0);
}



  onBlur(event?: FocusEvent) {
    this.onTouched();
    if (event) {
      this.blur.emit(event);
    }
  }

  onFocus(event: FocusEvent) {
    this.focus.emit(event);
  }

  focusInput() {
    if (this.disabled || this.readOnly) {
      return;
    }

    if (this.isRtl && this.rtlInput) {
      this.rtlInput.nativeElement.focus();
    } else if (!this.isRtl && this.ltrInput) {
      this.ltrInput.nativeElement.focus();
    }
  }

  onClick(event: MouseEvent) {
    event.preventDefault();
    this.focusInput();
  }

  onIconMouseDown(event: MouseEvent) {
    event.preventDefault();
  }

  setInput(value: string = '') {
    // Apply input restrictions to the value
    const cleanedValue = this.applyInputRestrictions(value);
    
    this._value = cleanedValue;
    this.value = cleanedValue;

    if (this.getControl()) {
      this.getControl().setValue(cleanedValue, { emitEvent: true });
    }

    // Also directly update the input elements if they exist
    if (this.isRtl && this.rtlInput) {
      this.rtlInput.nativeElement.value = cleanedValue;
    } else if (!this.isRtl && this.ltrInput) {
      this.ltrInput.nativeElement.value = cleanedValue;
    }

    // Trigger value change and search events
    this.valueChange.emit(cleanedValue);
    this.search.emit(cleanedValue);
  }
}