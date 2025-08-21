import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  imports: [CommonModule, TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    class: 'text-gray-900',
  },
})
export class CardComponent {
  @Input() title = '';
  @Input() className = '';
  @Input() showShadow = true;
  @Input() titleMode: 'primary' | 'secondary' = 'primary';
}
