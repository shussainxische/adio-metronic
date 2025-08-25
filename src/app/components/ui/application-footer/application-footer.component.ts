import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-application-footer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <app-icon name="file-text" [size]="20" className="text-gray-600"></app-icon>
        <span class="text-2xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          {{ certifyingBody }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div *ngIf="showAlert" class="w-6 h-6 bg-yellow rounded-full flex items-center justify-center">
          <span class="text-2xs text-white font-bold">!</span>
        </div>
        <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  `,
  styleUrl: './application-footer.component.scss'
})
export class ApplicationFooterComponent {
  @Input() certifyingBody: string = 'Abu Dhabi Certification Body';
  @Input() showAlert: boolean = false;
}