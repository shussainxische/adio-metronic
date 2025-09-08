import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageWrapperComponent } from '../../wrappers/page-wrapper/page-wrapper.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, PageWrapperComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  constructor(private router: Router) {}

  selectCertifyingBody(): void {
    sessionStorage.setItem('selectedRole', 'cb');
    // Navigate to CB app on port 4202
    window.location.href = 'http://localhost:4202';
  }

  selectADIO(): void {
    sessionStorage.setItem('selectedRole', 'adio');
    this.router.navigate(['/adio/applications']);
  }
}