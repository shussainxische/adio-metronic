import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { FormFieldsWrapperComponent } from '../../../wrappers/form-fields-wrapper/form-fields-wrapper.component';

interface FormField {
  controlName: string;
  type: 'input' | 'textarea' | 'select';
  label: string;
  placeholder: string;
  options?: { label: string; value: any }[];
  isMandatory?: boolean;
  readOnly?: boolean;
  language?: 'en' | 'ar';
}

@Component({
  selector: 'app-entity-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    TranslateModule,
    ButtonComponent,
    FormFieldsWrapperComponent,
  ],
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityFormComponent {
  @Input() form: FormGroup;
  @Input() fields: FormField[] = [];
  @Input() mode: string = '';
  @Output() formSubmit = new EventEmitter<any>();
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] && !changes['fields'].firstChange) {
      this.cdr.markForCheck();
    }
  }
  getControl(name: string): FormControl | null {
    const control = this.form?.get(name);
    if (!control) {
      return null;
    }
    return control as FormControl;
  }
  trackByFn(index: number, field: FormField) {
    return field.controlName;
  }
  onSubmit(): void {
    if (this.form?.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      if (this.form) {
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key)?.markAsTouched();
          this.form.get(key)?.updateValueAndValidity();
        });
      }
      this.cdr.detectChanges();
    }
  }
}
