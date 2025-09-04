import { CommonModule } from '@angular/common';
import { Component, ContentChild, HostBinding, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

type ButtonType = 'submit' | 'button';
type ButtonVariant = 'regular' | 'primary' | 'secondary' | 'delete' | 'warning' | 'success' | 'info';
type ButtonMode = 'filled' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-adio-button',
  imports: [CommonModule,TooltipModule],
  templateUrl: './adio-button.component.html',
  styleUrl: './adio-button.component.scss'
})
export class AdioButtonComponent {
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() mode: ButtonMode = 'filled';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() routerLink: string[]=[];
  @ContentChild('[iconBefore]') iconBeforeContent: any;
  @ContentChild('[iconAfter]') iconAfterContent: any;
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() className =  '';
  @Input() class =  '';

  @HostBinding('class')
  get hostClasses(): string {
    return this.class ?? '';
  }

  get buttonClasses(): string {
    const baseClasses = [
      'rounded-md',
      'transition-colors',
      'duration-200',
      'flex',
      'items-center',
      'gap-1',
      'whitespace-nowrap',
      'w-full',
    ];

    // Variant and Mode Specific Styles
  if (this.mode === 'filled') {
    switch (this.variant) {
      case 'primary':
        baseClasses.push('bg-primary', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-primary-disabled');
        }
        else {
          baseClasses.push('hover:bg-primary-active', 'active:bg-primary-active');
        }
        break;
      case 'secondary':
        baseClasses.push('bg-secondary', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-secondary-disabled');
        }
        else {
          baseClasses.push('hover:bg-secondary-active', 'active:bg-secondary-active');
        }
        break;
      case 'regular':
        baseClasses.push('bg-gray-800', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-gray-600');
        }
        else {
          baseClasses.push('hover:bg-primary-on-surface', 'active:bg-primary-on-surface');
        }
        break;
      case 'delete':
        baseClasses.push('bg-red', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-red-disabled');
        }
        else {
          baseClasses.push('hover:bg-red-active', 'active:bg-red-active');
        }
        break;
      case 'success':
        baseClasses.push('bg-green', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-green-disabled');
        }
        else {
          baseClasses.push('hover:bg-green-active', 'active:bg-green-active');
        }
        break;
      case 'warning':
        baseClasses.push('bg-yellow', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-yellow-disabled');
        }
        else {
          baseClasses.push('hover:bg-yellow-active', 'active:bg-yellow-active');
        }
        break;
      case 'info':
        baseClasses.push('bg-blue', 'text-white');
        if(this.disabled) {
          baseClasses.push('bg-blue-disabled');
        }
        else {
          baseClasses.push('hover:bg-blue-active', 'active:bg-blue-active');
        }
        break;
    }
  } else { // Outline mode
    switch (this.variant) {
      case 'primary':
        baseClasses.push('border', 'border-primary', 'text-primary');
        if(this.disabled) {
          baseClasses.push('border-primary-disabled', 'text-primary-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-primary-active)]',
            'hover:border-primary-active',
            'hover:text-primary-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-primary-active)]',
            'active:border-primary-active',
            'active:text-primary-active'
          );
        }
        break;
      case 'secondary':
        baseClasses.push('border', 'border-secondary', 'text-secondary');
        if(this.disabled) {
          baseClasses.push('border-secondary-disabled', 'text-secondary-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-secondary-active)]',
            'hover:border-secondary-active',
            'hover:text-secondary-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-secondary-active)]',
            'active:border-secondary-active',
            'active:text-secondary-active'
          );
        }
        break;
      case 'regular':
        baseClasses.push('border', 'border-gray-800', 'text-gray-800');
        if(this.disabled) {
          baseClasses.push('border-gray-600', 'text-gray-600');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-primary-on-surface)]',
            'hover:border-primary-on-surface',
            'hover:text-primary-on-surface',
            'active:shadow-[0_0_0_0.5px_var(--tw-primary-on-surface)]',
            'active:border-primary-on-surface',
            'active:text-primary-on-surface'
          );
        }
        break;
      case 'delete':
        baseClasses.push('border', 'border-red', 'text-red');
        if(this.disabled) {
          baseClasses.push('border-red-disabled', 'text-red-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-red-active)]',
            'hover:border-red-active',
            'hover:text-red-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-red-active)]',
            'active:border-red-active',
            'active:text-red-active'
          );
        }
        break;
      case 'success':
        baseClasses.push('border', 'border-green', 'text-green');
        if(this.disabled) {
          baseClasses.push('border-green-disabled', 'text-green-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-green-active)]',
            'hover:border-green-active',
            'hover:text-green-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-green-active)]',
            'active:border-green-active',
            'active:text-green-active'
          );
        }
        break;
      case 'warning':
        baseClasses.push('border', 'border-yellow', 'text-yellow');
        if(this.disabled) {
          baseClasses.push('border-yellow-disabled', 'text-yellow-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-yellow-active)]',
            'hover:border-yellow-active',
            'hover:text-yellow-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-yellow-active)]',
            'active:border-yellow-active',
            'active:text-yellow-active'
          );
        }
        break;
      case 'info':
        baseClasses.push('border', 'border-blue', 'text-blue');
        if(this.disabled) {
          baseClasses.push('border-blue-disabled', 'text-blue-disabled');
        }
        else {
          baseClasses.push(
            'hover:shadow-[0_0_0_0.5px_var(--tw-blue-active)]',
            'hover:border-blue-active',
            'hover:text-blue-active',
            'active:shadow-[0_0_0_0.5px_var(--tw-blue-active)]',
            'active:border-blue-active',
            'active:text-blue-active'
          );
        }
        break;
    }
  }

    // Size Specific Styles
    switch (this.size) {
      case 'small':
        baseClasses.push('px-4', 'py-1', 'text-xs');
        break;
      case 'medium':
        baseClasses.push('px-6', 'min-h-[42px]', 'text-base');
        break;
      case 'large':
        baseClasses.push('px-6', 'py-3', 'text-base');
        break;
    }

    // Disabled State
    if (this.disabled) {
      baseClasses.push('cursor-not-allowed');
    }

    return baseClasses.join(' ');
  }
}
