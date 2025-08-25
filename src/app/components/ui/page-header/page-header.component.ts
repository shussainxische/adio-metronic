import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-center lg:items-end justify-between gap-5">
      <div class="flex flex-col justify-center gap-2">
        <h1 class="text-xl font-semibold leading-none text-gray-900">{{ title }}</h1>
        <div class="flex items-center gap-2 text-sm font-medium text-gray-600" *ngIf="subtitle">
          {{ subtitle }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}