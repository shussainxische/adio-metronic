import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  imports: [TranslateModule],
})
export class RadioButtonComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() valueChange = new EventEmitter<string>();

  get radioClasses(): string {
    const sizeClasses = {
      small: 'w-[18px] h-[18px]',
      medium: 'w-[22px] h-[22px]',
      large: 'w-[26px] h-[26px]',
    };

    const dotSizes = {
      small: 'checked:after:w-[8px] checked:after:h-[8px]',
      medium: 'checked:after:w-[10px] checked:after:h-[10px]',
      large: 'checked:after:w-[12px] checked:after:h-[12px]',
    };

    const baseClasses =
      'relative appearance-none rounded-full bg-white focus-visible:outline-2 focus-visible:outline-offset-2 forced-colors:appearance-auto cursor-pointer';

    const stateClasses = `border border-gray-800 checked:border-primary checked:bg-primary checked:after:content-[""] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:bg-white checked:after:rounded-full focus-visible:outline-primary disabled:border-gray-400 disabled:bg-gray-200 disabled:checked:after:bg-gray-200 disabled:cursor-not-allowed`;

    return `${baseClasses} ${stateClasses} ${sizeClasses[this.size]} ${
      dotSizes[this.size]
    }`;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.valueChange.emit(this.value);
    }
  }

  onLabelClick(): void {
    if (!this.disabled) {
      this.valueChange.emit(this.value);
    }
  }
}
