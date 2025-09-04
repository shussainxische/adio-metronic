import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-wrapper',
  imports: [],
  templateUrl: './icon-wrapper.component.html',
  styleUrl: './icon-wrapper.component.scss',
})
export class IconWrapperComponent {
  @Input() size: 'extra-small' | 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'outlined' | 'filled' = 'outlined';
  @Input() shape: 'rounded' | 'squared' = 'squared';
  @Input() mode: 'neutral' | 'danger' | 'success' = 'neutral';
  @Input() disabled: boolean = false;
  @Input() active: boolean = false;
  @Input() disableFocusStyles: boolean = false;

  get wrapperClasses(): string[] {
    const baseClasses = ['flex', 'items-center', 'justify-center'];

    // Size and padding classes
    switch (this.size) {
      case 'extra-small':
        baseClasses.push('text-[16px]', 'p-[6px]');
        break;
      case 'small':
        baseClasses.push('text-[18px]', 'p-[7px]');
        break;
      case 'medium':
        baseClasses.push('text-[24px]', 'p-[8px]');
        break;
      case 'large':
        baseClasses.push('text-[28px]', 'p-[10px]');
        break;
    }
    switch (this.shape) {
      case 'rounded':
        baseClasses.push('rounded-full');
        break;
      default:
        baseClasses.push('rounded-md');
    }
    if (this.mode === 'neutral') {
      this.disabled ? 'cursor-not-allowed text-gray-600' : '';
      if (this.active) {
        baseClasses.push('bg-surface-active-status', 'text-primary-on-surface');
      }
      baseClasses.push(
        'rounded-full',
        'text-gray-800',
        'hover:!bg-surface-active-status',
        'hover:text-primary-on-surface'
      );
      if (!this.disableFocusStyles) {
        baseClasses.push(
          'focus:bg-surface-active-status',
          'focus:text-primary-on-surface'
        );
      }

      if (this.disabled) {
        baseClasses.push('cursor-not-allowed', 'text-gray-600');
      }
    } else {
      if (this.mode === 'danger') {
        baseClasses.push(
          'border-[1.8px]',
          'hover:shadow-[0_0_0_1.2px]', // Simulates border growth
          'hover:shadow-red-active',
          'border-red',
          'text-red',
          'cursor-pointer'
        );

        if (!this.active) {
          baseClasses.push('hover:text-red-active');
        }

        if (this.active) {
          baseClasses.push('text-white', 'border-red-active', 'bg-red-active');
        }
      }
      if (this.mode === 'success') {
        baseClasses.push(
          'border-[1.8px]',
          'hover:shadow-[0_0_0_1.2px]', // Simulated border growth
          'hover:shadow-green-active',
          'border-green',
          'text-green',
          'cursor-pointer'
        );

        if (!this.active) {
          baseClasses.push('hover:text-green-active');
        }

        if (this.active) {
          baseClasses.push(
            'text-white',
            'border-green-active',
            'bg-green-active'
          );
        }
      }
    }

    if (this.disabled) {
      baseClasses.push('opacity-50', 'cursor-not-allowed');
    }

    return baseClasses;
  }
}
