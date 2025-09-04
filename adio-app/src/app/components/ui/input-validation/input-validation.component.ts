import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.scss'
})
export class InputValidationComponent {
  @Input() control: FormControl = new FormControl('');
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() helperText: string = '';
  @Input() validationRule: (value: any) => boolean = () => false;
  @Input() validationMessage: string = 'Applicable';
  @Input() invalidMessage: string = 'Not Applicable';
  @Input() unit: string = '';
  @Input() variant: 'input' | 'dropdown' = 'input';
  @Input() options: {value: any, label: string}[] = [];
  @Output() validationChange = new EventEmitter<boolean>();

  get isValid(): boolean {
    const value = this.control.value;
    if (!value || value === '') return false;
    
    const valid = this.validationRule(value);
    this.validationChange.emit(valid);
    return valid;
  }

  get validationStatus(): 'valid' | 'invalid' | 'none' {
    const value = this.control.value;
    if (!value || value === '') {
      // For empty values, always show as invalid (Not Applicable)
      return 'invalid';
    }
    return this.isValid ? 'valid' : 'invalid';
  }

  get statusBadgeText(): string {
    const value = this.control.value;
    if (!value || value === '') {
      // Show "Not Applicable" for empty values
      return this.invalidMessage;
    }
    
    switch (this.validationStatus) {
      case 'valid': return this.validationMessage;
      case 'invalid': return this.invalidMessage;
      default: return '';
    }
  }
}