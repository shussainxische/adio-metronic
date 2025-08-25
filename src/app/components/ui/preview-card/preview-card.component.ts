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
}
