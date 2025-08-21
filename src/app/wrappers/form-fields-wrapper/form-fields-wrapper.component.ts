import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-fields-wrapper',
  imports: [],
  templateUrl: './form-fields-wrapper.component.html',
  styleUrl: './form-fields-wrapper.component.scss',
})
export class FormFieldsWrapperComponent {
  @Input() className = '';
}
