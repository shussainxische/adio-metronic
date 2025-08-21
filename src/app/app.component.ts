import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    // MsalModule,
    CommonModule,
    TranslateModule,
    LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'adio-metronic';
  constructor(private router: Router, public loaderService: LoaderService) {
  }

    ngAfterViewInit(): void {
    KTComponents.init();
    KTLayout.init();
  }

  ngOnInit() {
    //this.langService.initLanguage(); // Call the initialization function
  }
}
