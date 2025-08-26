import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

export type StatusBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type StatusBadgeVariant = 'active' | 'success' | 'warning' | 'pending' | 'archived' | 'complete' | 'reserved' | 'awarded' | 'category';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule, TooltipModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
  host: {
    class:
      'contents',
  },
})
export class StatusBadgeComponent {
  @Input() text: string = '';
  @Input() tooltip: string = '';
  @Input() size: StatusBadgeSize = 'md';
  @Input() variant: StatusBadgeVariant = 'pending';
  @Input() autoWidth: boolean = false;
  @Input() className: string = '';

  get sizeClasses(): string {
    // Special handling for category badges - make them square for single letters
    if (this.variant === 'category') {
      return this.size === 'xs' 
        ? 'h-6 w-6 text-xs leading-6 flex items-center justify-center' // Square for categories
        : 'h-6 w-8 text-xs leading-6 flex items-center justify-center';
    }
    
    const widthPrefix = this.autoWidth ? 'min-w-' : 'w-';
    const sizeMap: {[key: string]: string} = {
      'xs': `h-6 px-3 text-xs leading-6 ${widthPrefix}20`,
      'sm': `h-6 px-4 text-xs leading-6 ${widthPrefix}24`,
      'md': `h-6 px-4 text-sm leading-6 ${widthPrefix}32`,
      'lg': `h-8 px-5 text-base leading-8 ${widthPrefix}40`
    };
    return sizeMap[this.size] || sizeMap['md'];
  }

  get variantClasses(): string {
    const variantMap: {[key: string]: string} = {
      'active':  'bg-status-active text-primary-on-surface2',
      'success': 'bg-status-success text-primary-on-surface2',
      'warning': 'bg-status-warning text-primary-on-surface2',
      'pending': 'bg-status-pending text-primary-on-surface2',
      'archived': 'bg-status-archived text-primary-on-surface2',
      'complete': 'bg-status-success text-primary-on-surface2',
      'reserved':'bg-status-reserved text-primary-on-surface2',
      'awarded':'bg-status-awarded text-primary-on-surface2',
      'category': 'bg-gray-200 text-gray-700'
    };
    return variantMap[this.variant] || variantMap['pending'];
  }
}
