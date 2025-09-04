import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-preview-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './preview-card.component.html',
  styleUrl: './preview-card.component.scss',
  host: {
    class: 'text-gray-900',
  },
})
export class PreviewCardComponent {
  @Input() title = '';
  @Input() className = '';
  @Input() showShadow = true;
  @Input() titleMode: 'primary' | 'secondary' = 'primary';
  @Input() hoverable = true;

  get cardClasses(): string {
    const classes = [
      'rounded-xl border border-stroke-container p-5 h-full',
      this.className
    ];

    if (this.showShadow) {
      classes.push('shadow-0-1');
    }

    if (this.hoverable) {
      classes.push('group cursor-pointer transition-all duration-200');
      classes.push('hover:shadow-lg hover:-translate-y-1');
    }

    return classes.join(' ');
  }
}
