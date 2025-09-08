import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-adio',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
  ],
  templateUrl: './adio.component.html',
  styleUrl: './adio.component.scss',
})
export class AdioComponent {
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



  selectCertifyingBody(): void {
    sessionStorage.setItem('selectedRole', 'cb');
    this.router.navigate(['/cb-dashboard']);
  }

  selectADIO(): void {
    sessionStorage.setItem('selectedRole', 'adio');
    this.router.navigate(['/adio-dashboard']);
  }
}
