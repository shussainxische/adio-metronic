import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
})
export class DateInputComponent {
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Select date';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  get hasError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }
}