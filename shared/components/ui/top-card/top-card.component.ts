import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-top-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './top-card.component.html',
  styleUrl: './top-card.component.scss',
  host: {
    class: 'text-gray-900',
  },
})
export class TopCardComponent {
  @Input() title = '';
  @Input() className = '';
  @Input() showShadow = true;
  @Input() titleMode: 'primary' | 'secondary' = 'primary';
  @Input() active = false;
  @Input() clickable = true;

  get cardClasses(): string {
    const classes = [
      'rounded-xl border border-stroke-container p-6 h-full',
      this.className
    ];

    if (this.showShadow || this.active) {
      classes.push('shadow-0-1');
    }

    if (this.clickable) {
      classes.push('cursor-pointer transition-all duration-200');
      
      if (this.active) {
        classes.push('ring-2 ring-primary shadow-lg');
      } else {
        classes.push('hover:shadow-md');
      }
    }

    return classes.join(' ');
  }
}
