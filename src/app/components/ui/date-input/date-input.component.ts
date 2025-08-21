import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, AfterViewInit, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePicker } from 'primeng/datepicker';
import { Language, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
// import { LanguageService } from '../../../services/language/language.service';
import { InputComponent } from '../input/input.component';
import { PrimeNG } from 'primeng/config';
// import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    InputComponent,
    TranslateModule,

  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss',
})
export class DateInputComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() control!: FormControl;
  @Input() placeholder: string = 'common.select';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() language: Language = 'en';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() errorMessage: string = '';

  get hasError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  @ViewChild('picker') picker!: DatePicker;

  arabicLocale = {
    firstDayOfWeek: 6,
    dayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    dayNamesShort: ["أحد", "إثن", "ثلاث", "أربع", "خميس", "جمعة", "سبت"],
    dayNamesMin: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
    monthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    monthNamesShort: ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
    today: "اليوم",
    clear: "مسح",
    weekHeader: "أسبوع"
  };

  datePickerControl = new FormControl();

  private subscriptions: Subscription[] = [];

  get isRtl(): boolean {
    return this.language === 'ar';
  }

  constructor(
    private route: ActivatedRoute,
    // private languageService: LanguageService,
    private elementRef: ElementRef,
    private primeng: PrimeNG,
    // private translateService: TranslateService
  ) {}

  // Convert string dates to Date objects
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;

  @Input() set minDate(value: string) {
    this._minDate = value ? dayjs(value).toDate() : null;
  }
  get minDate(): Date | null {
    return this._minDate;
  }

  @Input() set maxDate(value: string) {
    this._maxDate = value ? dayjs(value).toDate() : null;
  }
  get maxDate(): Date | null {
    return this._maxDate;
  }

  ngOnInit() {
    // Set date format based on language
    this.updateDateFormat(this.language);

    // Subscribe to the language service
    this.subscriptions.push(
      // this.languageService.language$.subscribe(lang => {
      //   this.language = lang;
      //   this.updateDateFormat(lang);
      //   this.translate(lang);
      // })
    );

    // Initial translation setup
    this.translate(this.language);

    // Apply initial disabled state
    this.updateDisabledState();

    // Set initial value from the main control using dayjs
    if (this.control.value) {
      const dateValue = typeof this.control.value === 'string' ? this.parseDate(this.control.value) : this.control.value;
      this.datePickerControl.setValue(dateValue);
    }

    // Subscribe to control status changes (enabled/disabled)
    this.subscriptions.push(
      this.control.statusChanges.subscribe(() => {
        this.updateDisabledState();
      })
    );

    // Sync from date picker control to main control using dayjs
    this.subscriptions.push(
      this.datePickerControl.valueChanges.subscribe(value => {
        if (value) {
          // Format date as ISO string using dayjs - this prevents timezone issues
          const formattedDate = this.formatDateToISOString(value);
          this.control.setValue(formattedDate);
        } else {
          this.control.setValue(null);
        }
      })
    );
  }

  private parseDate(dateStr: string): Date {
    return dayjs(dateStr).toDate();
  }

  private formatDateToISOString(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  // Helper method to update disabled state
  private updateDisabledState() {
    if (this.disabled || this.control.disabled) {
      this.datePickerControl.disable({emitEvent: false});
    } else {
      this.datePickerControl.enable({emitEvent: false});
    }
  }

  private updateDateFormat(lang: Language) {
    if (lang === 'ar') {
      this.primeng.setTranslation({
        firstDayOfWeek: 6,
        dayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        dayNamesShort: ["أحد", "إثن", "ثلاث", "أربع", "خميس", "جمعة", "سبت"],
        dayNamesMin: ["ح", "ن", "ث", "ر", "خ", "ج", "س"],
        monthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        monthNamesShort: ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"],
        today: "اليوم",
        clear: "مسح",
        weekHeader: "أسبوع"
      });
    } else {
      this.primeng.setTranslation({
        firstDayOfWeek: 0,
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        monthNamesShort: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        today: "Today",
        clear: "Clear",
        weekHeader: "Wk"
      });
    }
  }

  translate(lang: string) {
    // this.translateService.use(lang);
    // this.translateService.get('primeng').subscribe(res => this.primeng.setTranslation(res));
  }

  ngAfterViewInit() {
    // Ensure picker is initialized and add a small delay
    setTimeout(() => {
      // Make sure the picker doesn't show on load
      if (this.picker && this.picker.overlayVisible) {
        this.picker.hideOverlay();
      }
    }, 100);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openPicker() {
    if (this.disabled || this.control.disabled) {
      return;
    }

    if (this.control.value && (!this.datePickerControl.value ||
        this.formatDateToISOString(this.datePickerControl.value) !== this.control.value)) {
      const dateValue = typeof this.control.value === 'string' ?
        this.parseDate(this.control.value) : this.control.value;
      this.datePickerControl.setValue(dateValue);
    }

    setTimeout(() => {
      if (this.picker) {
        // If the overlay is already visible, don't try to show it again
        if (!this.picker.overlayVisible) {
          // Force focus on the input element first
          const inputEl = this.picker.inputfieldViewChild?.nativeElement;
          if (inputEl) {
            inputEl.focus();
          }
          // Then show the overlay
          this.picker.showOverlay();
        }
      } else {
        console.warn('Picker not initialized yet');
      }
    });
  }

  onCalendarHide() {
    this.control.markAsTouched();
  }

  onDateSelect(event: any) {
  }

  getYearRange(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear - 100}:${currentYear + 20}`;
  }
}
