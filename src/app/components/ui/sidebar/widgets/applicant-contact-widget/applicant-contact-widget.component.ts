import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../icon/icon.component';

export interface ContactData {
  name: string;
  position: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-applicant-contact-widget',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './applicant-contact-widget.component.html',
  styleUrl: './applicant-contact-widget.component.scss'
})
export class ApplicantContactWidgetComponent {
  @Input() data!: ContactData;
  @Input() isCollapsed: boolean = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}