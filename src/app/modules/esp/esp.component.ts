import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTE_CONFIG } from 'src/app/core/constants/route-config';

@Component({
  selector: 'app-esp',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './esp.component.html',
  styleUrl: './esp.component.scss',
})
export class EspComponent {
  userData: any;
  userRoles: string[] = [];

  constructor(private router: Router /*private authService: AuthService,*/) { }

  ngOnInit(): void {
    // this.userRoles = this.authService.getRoles(); 
    // console.log('Roles from localStorage:', this.authService.getRoles());
  }

  // hasTenderRole(): boolean {
  //   return this.userRoles.includes('Tender_Admin')

  // }
  // haslandRole():boolean{
  //         return this.userRoles.includes('Land_Bank_Admin') ||
  //          this.userRoles.includes('Land_Bank_User');
  // }
  //  hassuperAdminRole(): boolean {
  //       return this.userRoles.includes('super_admin');

  // }

  onSelectESP_Role(selectedRole: string): void {
    if (selectedRole === ROUTE_CONFIG.cb.path) {
      sessionStorage.setItem('selectedRole', selectedRole);
      this.router.navigate([ROUTE_CONFIG.cb.landingPage]);
    } else if (selectedRole === ROUTE_CONFIG.adio.path) {
      sessionStorage.setItem('selectedRole', selectedRole);
      this.router.navigate([ROUTE_CONFIG.adio.landingPage]);
    }
  }

}
