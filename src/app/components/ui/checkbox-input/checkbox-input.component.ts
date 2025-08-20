import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';

type CheckboxSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ]
})


export class CheckboxInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() disabledAppearance: boolean = true;
  @Input() id: string = `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  @Output() change = new EventEmitter<boolean>();
  @Input() size: CheckboxSize = 'small';
  public _checked = false;


  @Input()
  set checked(value: boolean) {
    this._checked = value;
  }

  get checked(): boolean {
    return this._checked;
  }

  private onChange: (_: any) => void = () => {};
  private onTouched: () => void = () => {};

  onCheckboxChange(event: Event) {
    if(this.disabled) {
      return;
    }
    event.stopPropagation();
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked = isChecked;
    this.onChange(isChecked);
    this.onTouched();
    this.change.emit(isChecked);
  }

  // ControlValueAccessor methods
  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


toggleChecked(event: Event): void {
  if (this.disabled) return;

  // Prevent default checkbox behavior since we're manually controlling it
  event.preventDefault();

  // Toggle the checked state
  this.checked = !this.checked;

  // Call the form control callbacks
  this.onChange(this.checked);
  this.onTouched();

  // Emit the new value
  this.change.emit(this.checked);
}

get CheckboxClasses(): string {
  const classes = [];

  switch (this.size) {
    case 'small':
      classes.push('w-[18px]', 'h-[18px]', '!rounded');
      break;
    case 'medium':
      classes.push('w-[22px]', 'h-[22px]', '!rounded-md');
      break;
    case 'large':
      classes.push('w-[26px]', 'h-[26px]', '!rounded-md');
      break;
  }

  return classes.join(' ');
}

get CheckmarkClasses(): string {
  const classes = [];

  switch (this.size) {
    case 'small':
      classes.push('w-[12px]', 'h-[12px]');
      break;
    case 'medium':
      classes.push('w-[14px]', 'h-[14px]');
      break;
    case 'large':
      classes.push('w-[18px]', 'h-[18px]');
      break;
  }

  return classes.join(' ');
}

}
