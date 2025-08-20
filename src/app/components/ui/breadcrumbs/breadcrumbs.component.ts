import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../navigation.service';
import { TranslateModule } from '@ngx-translate/core';

export interface Breadcrumb {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
    host: {
    class:
      'w-full',
  },

})
export class BreadcrumbsComponent {
  @Input() items: Breadcrumb[] = [];
  constructor(
    public nav: NavigationService,
  ) {}

}
