import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdioButtonComponent } from '../adio-button/adio-button.component';
import Swal from 'sweetalert2';
// import { SweetAlertService } from '../../../services/sweet-alert.service';
// import { ImagePreviewComponent } from '../../image-preview/image-preview.component';
import { IconWrapperComponent } from '../icon-wrapper/icon-wrapper.component';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    AdioButtonComponent,
    // ImagePreviewComponent,
    IconWrapperComponent,
  ],
  templateUrl: './file-input.component.html',
})
export class FileInputComponent implements OnDestroy {
  @Input() ariaLabelTranslateKey: string = '';
  @Input() accept: string = 'image/*';
  @Input() class = '';
  @Output() fileChanged = new EventEmitter<Event>();
  @Output() fileRemoved = new EventEmitter<void>();
  @Input() control!: FormControl;
  @Input() disabled: boolean = false;
  @Input() existingImageUrl: string | null = null;
  @Input() existingFileName: string | null = null;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() errorMessage: string = '';
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB in bytes

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  getAcceptedFormatsText(): string {
    // if (!this.accept || this.accept === '*') {
    //   return this.translate.instant('forms.all_file_types');
    // }

    const formats = this.accept.split(',').map((format) => format.trim());
    const formattedTypes: string[] = [];

    // formats.forEach((format) => {
    //   if (format === 'application/pdf' || format === '.pdf') {
    //     formattedTypes.push(this.translate.instant('popup.pdf'));
    //   } else if (format.startsWith('.')) {
    //     // File extensions - convert to uppercase and remove dot
    //     formattedTypes.push(format.substring(1).toUpperCase());
    //   } else if (format === 'image/*') {
    //     formattedTypes.push(this.translate.instant('forms.image_files'));
    //   } else if (format === 'video/*') {
    //     formattedTypes.push(this.translate.instant('forms.video_files'));
    //   } else if (format === 'audio/*') {
    //     formattedTypes.push(this.translate.instant('forms.audio_files'));
    //   }
    // });

    return formattedTypes.join(', ');
  }
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragOver: boolean = false;
  private dragCounter: number = 0;
  private dragLeaveTimeout: any;
  fileSizeError: string = '';

  constructor(
    // private sweetAlertService: SweetAlertService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    // private translate: TranslateService
  ) {}

  get hasError(): boolean {
    return (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  get hasSizeError(): boolean {
    return !!this.fileSizeError;
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.processFile(file, event);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['existingImageUrl'] &&
      changes['existingImageUrl'].currentValue
    ) {
      this.previewUrl = changes['existingImageUrl'].currentValue;
    }
  }

  /**
   * Process a selected or dropped file
   */
  private processFile(file: File, originalEvent?: Event): void {
    // Clear previous errors
    this.fileSizeError = '';

    // Validate file size
    // if (!this.isValidFileSize(file)) {
    //   this.fileSizeError = this.translate.instant('forms.file_size', {
    //     maxSize: this.formatFileSize(this.maxFileSize),
    //   });
    //   this.control.setErrors({ fileSizeExceeded: true });
    //   return;
    // }

    // Validate file type if accept attribute is specified
    if (this.accept && !this.isValidFileType(file)) {
      console.warn('Invalid file type');
      return;
    }

    // Clear existing image properties when user selects new file
    this.existingImageUrl = null;
    this.existingFileName = null;

    this.selectedFile = file;

    // Only create image preview for image files
    if (file.type.includes('image')) {
      this.createImagePreview(file);
    } else {
      // For non-image files (like PDFs), clear the preview URL
      this.previewUrl = null;
    }

    this.control.setValue(file);
    this.control.markAsDirty();

    // Create a proper change event that mimics the file input change event
    const mockEvent = new Event('change', { bubbles: true });
    Object.defineProperty(mockEvent, 'target', {
      value: {
        files: [file],
      },
      enumerable: true,
    });

    this.fileChanged.emit(mockEvent);
  }

  /**
   * Validate if the file size is within the allowed limit
   */
  private isValidFileSize(file: File): boolean {
    return file.size <= this.maxFileSize;
  }

  /**
   * Validate if the file type matches the accept attribute
   */
  private isValidFileType(file: File): boolean {
    if (!this.accept || this.accept === '*') return true;

    const acceptTypes = this.accept.split(',').map((type) => type.trim());

    return acceptTypes.some((acceptType) => {
      if (acceptType.startsWith('.')) {
        // File extension check
        return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
      } else if (acceptType.includes('*')) {
        // MIME type wildcard check (e.g., 'image/*')
        const baseType = acceptType.split('/')[0];
        return file.type.startsWith(baseType);
      } else {
        // Exact MIME type check
        return file.type === acceptType;
      }
    });
  }

  createImagePreview(file: File): void {
    if (!file.type.includes('image')) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  showImagePreview(): void {
    if (!this.previewUrl) return;

    const fileName =
      this.selectedFile?.name || this.existingFileName || 'Image Preview';

    // this.sweetAlertService.openWithComponent(
    //   ImagePreviewComponent,
    //   {
    //     imageUrl: this.previewUrl,
    //     fileName: fileName,
    //   },
    //   {
    //     showCancelButton: false,
    //     showConfirmButton: false,
    //     customClass: {
    //       popup:
    //         'swal2-popup-custom rounded-2xl bg-surface-dropdown-popups shadow-0-2 border border-stroke-dropdown-popups border-solid',
    //     },
    //     showCloseButton: false,
    //     icon: null,
    //     backdrop: `rgba(0, 0, 0, 0.5)`,
    //     didOpen: (modalElement) => {
    //       const componentInstance =
    //         this.sweetAlertService.getComponentInstance<ImagePreviewComponent>();
    //       if (componentInstance) {
    //         componentInstance.close.subscribe(() => {
    //           Swal.close();
    //         });
    //       }
    //     },
    //   }
    // );
  }

  /**
   * Removes the currently selected file
   * @param event The click event (to prevent propagation)
   */
  removeFile(event: Event): void {
    // Prevent the click from triggering the image preview
    event.stopPropagation();

    // Clear existing image properties when user removes file
    this.existingImageUrl = null;
    this.existingFileName = null;

    // Clear the file input
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }

    // Reset state
    this.selectedFile = null;
    this.previewUrl = null;
    this.fileSizeError = '';

    // Reset form control
    this.control.setValue(null);
    this.control.markAsDirty();

    // Emit event for parent components
    this.fileRemoved.emit();
  }

  // Drag and Drop Event Handlers
  onDragOver(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    if (!this.isDragOver) {
      this.ngZone.run(() => {
        this.isDragOver = true;
        this.cdr.detectChanges();
      });
    }

    // Clear any pending drag leave timeout
    if (this.dragLeaveTimeout) {
      clearTimeout(this.dragLeaveTimeout);
      this.dragLeaveTimeout = null;
    }
  }

  onDragEnter(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragCounter++;

    if (!this.isDragOver) {
      this.ngZone.run(() => {
        this.isDragOver = true;
        this.cdr.detectChanges();
      });
    }
  }

  onDragLeave(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragCounter--;

    // Only reset isDragOver when we've left all elements (dragCounter reaches 0)
    if (this.dragCounter <= 0) {
      this.dragCounter = 0;

      // Use a small timeout to prevent flickering
      this.dragLeaveTimeout = setTimeout(() => {
        this.ngZone.run(() => {
          this.isDragOver = false;
          this.cdr.detectChanges();
        });
      }, 50);
    }
  }

  onDrop(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    // Reset drag state immediately
    this.resetDragState();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0]; // Take only the first file
      this.processFile(file);
    }
  }

  /**
   * Reset drag state and counters
   */
  private resetDragState(): void {
    this.dragCounter = 0;
    if (this.dragLeaveTimeout) {
      clearTimeout(this.dragLeaveTimeout);
      this.dragLeaveTimeout = null;
    }

    this.ngZone.run(() => {
      this.isDragOver = false;
      this.cdr.detectChanges();
    });
  }

  // formatFileSize(bytes: number): string {
  //   if (bytes === 0) return '0 ' + this.translate.instant('forms.bytes');

  //   const k = 1024;
  //   const sizes = [
  //     this.translate.instant('forms.bytes'),
  //     this.translate.instant('forms.kb'),
  //     this.translate.instant('forms.mb'),
  //     this.translate.instant('forms.gb'),
  //   ];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));

  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  // }

  get currentFileSize(): string {
    if (this.selectedFile) {
      return  '5mb'; //this.formatFileSize(this.selectedFile.size);
    }
    return '';
  }

  ngOnInit() {
    if (this.disabled) {
      this.control.disable();
    }

    // Handle existing image URL
    if (this.existingImageUrl) {
      this.previewUrl = this.existingImageUrl;
    }

    // Handle initial file from control value
    if (this.control?.value && this.control.value instanceof File) {
      this.selectedFile = this.control.value;
      this.existingFileName = this.selectedFile.name;

      // Create preview for image files
      if (this.selectedFile.type.includes('image')) {
        this.createImagePreview(this.selectedFile);
      }
    }

    // Add global event listeners to handle edge cases
    document.addEventListener('dragend', () => this.resetDragState());
    document.addEventListener('dragleave', (event) => {
      // If drag leaves the window entirely
      if (!event.relatedTarget) {
        this.resetDragState();
      }
    });
  }

  ngOnDestroy() {
    // Clean up event listeners
    document.removeEventListener('dragend', () => this.resetDragState());
    document.removeEventListener('dragleave', () => this.resetDragState());

    // Clear any pending timeouts
    if (this.dragLeaveTimeout) {
      clearTimeout(this.dragLeaveTimeout);
    }
  }
  get isPdfFile(): boolean {
    return (
      this.selectedFile?.type === 'application/pdf' ||
      this.existingFileName?.toLowerCase().endsWith('.pdf')
    );
  }
  get shouldShowImagePreview(): boolean {
    return !!this.previewUrl && !this.isPdfFile;
  }
}
