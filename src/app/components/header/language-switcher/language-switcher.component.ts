import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
/* import { SelectComponent, SelectOption } from '../select/select.component'; */
// import { LanguageService } from '../../../services/language/language.service';
// import { SUPPORTED_LANGUAGES } from '../../../config/languages.config';
import { SelectComponent, SelectOption } from '../../ui/select/select.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    SelectComponent,
    CommonModule,
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  // supportedLanguages = SUPPORTED_LANGUAGES;
  currentLang: string = 'en';
  // currentLangObject: any = SUPPORTED_LANGUAGES[0];
  languageControl = new FormControl('en');
  languageOptions: SelectOption[] = [];
  @Input() label = '';
  @Input() size : 'small' | 'medium' | 'large' = 'medium' ;
  private routeSubscription: Subscription;

  @Input() profileContent: HTMLDivElement;
  @Input() profileDropdown: HTMLDivElement;
  @Input() minWidth: string;

  constructor(
    // private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Transform SUPPORTED_LANGUAGES to SelectOption format
    // this.languageOptions = SUPPORTED_LANGUAGES.map(lang => ({
    //   value: lang.code,
    //   label: lang.name,
    //   icon: `assets/media/flags/${lang.flag}`
    // }));

    // Subscribe to route params to get language
    this.routeSubscription = this.route.params.subscribe(params => {
      this.currentLang = params['lang'] || 'en';
      // Update currentLangObject based on the currentLang
      this.setCurrentLangObject(this.currentLang);
      // Update form control without emitting event
      this.languageControl.setValue(this.currentLang, { emitEvent: false });
    });
  }

  ngOnInit() {
    // Component initialization if needed
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  switchLang(lang: string) {
    this.updateLanguageInRoute(lang);
  }

  onLanguageChange(event: any) {
    const newLang = event.target.value;
    this.switchLang(newLang);
  }

  updateLanguageInRoute(newLang: string) {
    // Keep your original profile dropdown logic
    if (this.profileDropdown) {
      this.profileDropdown.className = "menu-item";
    }
    if (this.profileContent) {
      this.profileContent.className = "menu-dropdown menu-default light:border-gray-300 w-screen max-w-[250px]";
    }

    // Update the currentLangObject
    this.setCurrentLangObject(newLang);

    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');

    // Ensure the first segment is a valid language code and replace it
    if (urlSegments.length > 1) {
      urlSegments[1] = newLang;
    } else {
      urlSegments.unshift(newLang);
    }

    const updatedUrl = urlSegments.join('/');
    this.router.navigateByUrl(updatedUrl, { replaceUrl: true });
  }

  // Helper method to set currentLangObject based on language code
  private setCurrentLangObject(langCode: string) {
    // const found = this.supportedLanguages.find(lang => lang.code === langCode);
    // if (found) {
    //   this.currentLangObject = found;
    // }
  }
}
