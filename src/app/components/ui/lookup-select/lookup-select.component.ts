import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponent } from '../select/select.component';
import { CommonModule } from '@angular/common';
import { LookupsService } from '../../../services/lookups/lookups.service';
import { LoaderComponent } from '../loader/loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-lookup-select',
  imports: [TranslateModule, SelectComponent, CommonModule,LoaderComponent],
  templateUrl: './lookup-select.component.html',
  styleUrl: './lookup-select.component.scss'
})
export class LookupSelectComponent implements OnInit {
  @Input() control: any;
  @Input() entityName: string;
  @Input() fieldName: string;
  @Input() label: string;
  @Input() placeholder: string = "common.select";
  @Input() isOptionSet: boolean = false;
  @Input() isMandatory: boolean = false;
  @Input() useAlternativeLookup: boolean = false;
  options: { value: string, label: string, arabicLabel?: string }[] = [];
  @Input() externalOptions: { value: string, label: string, arabicLabel?: string }[] = [];
  @Input() disabled: boolean = false;
  @Input() dependentValue?: string;
  @Output() change = new EventEmitter<void>();
  @Input() selectedRegion: any;
  isLoading: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() errorMessage: string = '';
  @Input() needHideOptions = false;
  @Input() exludedOptions = [];
  get hasError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  constructor(private lookupService: LookupsService) { }
  ngOnInit(): void {
      if (this.externalOptions?.length) {
        this.options = this.externalOptions;
        this.isLoading = false;
      }
     else
    if (this.useAlternativeLookup) {
      this.fetchAlternativeLookupOptions();
    } else if (this.isOptionSet) {
      this.fetchOptionSetOptions();
    }
    else {
      this.fetchLookupOptions();
    }
  }
  onClick() {
    this.change.emit(this.control.value);
  }
  fetchLookupOptions() {
    this.lookupService.getBatchLookups([this.entityName])
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe(response => {
        const lookupData = response['data'][this.entityName] || [];
        this.mapLookupData(lookupData);
      });
  }

  private mapLookupData(lookupData: any[]) {
    this.options = lookupData.map(item => ({
      value: item.id,
      label: item.name,
      arabicLabel: item.arabicName
    }));
    this.isLoading = false;
  }
  fetchOptionSetOptions() {
    this.lookupService.getOptions(this.entityName, this.fieldName)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (response) => {
        this.options = response.data.map((item: any) => ({
          value: item.value,
          label: item.label
        }));
        if (this.needHideOptions) {
          this.options = this.options.filter(opt => !this.exludedOptions.includes(opt.value));

        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching option set:', error);
        this.isLoading = false;
      }
    });
  }
  fetchAlternativeLookupOptions() {
    this.lookupService.getAlternativeLookup(this.entityName)
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (response) => {
        const lookupData = response.data || [];
        this.options = lookupData.map(item => ({
          value: item.id,
          label: item.name
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching alternative lookup options:', error);
        this.isLoading = false;
      }
    });
  }
}
