import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: 'submit' | 'button' = 'button';
  @Input() className =  'btn btn-primary'; // 'bg-blue-500 text-white px-4 py-2 rounded';
  @Input() disabled: boolean = false;
}
