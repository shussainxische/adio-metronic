import { Component } from '@angular/core';
// import { NavigationService } from '../../navigation.service';
import { RouterModule } from '@angular/router';
// import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // constructor(public nav: NavigationService) {
  // }
  currentYear: number = new Date().getFullYear();
  // appVersion: string = environment.appVersion;
  // environmentName: string = environment.environmentName;
}
