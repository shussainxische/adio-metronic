import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FileInputComponent } from '../file-input/file-input.component';
import { AdioButtonComponent } from '../adio-button/adio-button.component';
import { TooltipModule } from 'primeng/tooltip';

interface FileItem {
  file: File | null;
  control: FormControl;
  id: string;
  initialFile?: File; // Add this to track initial file
  existingFile?: any;
}

@Component({
  selector: 'app-multi-file-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FileInputComponent,
    TooltipModule,
  ],
  template: `
    <div>
      <!-- Label -->
      <label class="block text-base text-gray-700 mb-3">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <!-- Hidden file input for add button -->
      <input
        #hiddenFileInput
        type="file"
        [accept]="accept"
        (change)="onHiddenFileChange($event)"
        style="display: none"
        [disabled]="disabled"
      />

      <!-- File Upload Items Container -->
      <div class="flex flex-wrap gap-4">
        <!-- File Upload Items -->
        <div
          *ngFor="
            let fileItem of fileItems;
            let i = index;
            trackBy: trackByFileItem
          "
          class="relative"
        >
          <!-- File Input -->
          <app-file-input
            [class]="'min-w-[400px] max-w-[400px]'"
            [control]="fileItem.control"
            [accept]="accept"
            [ariaLabelTranslateKey]="ariaLabelTranslateKey"
            [maxFileSize]="maxFileSize"
            [existingFileName]="
              fileItem.existingFile?.fileName || fileItem.initialFile?.name
            "
            [existingImageUrl]="fileItem.existingFile?.blobUrl"
            (fileChanged)="onFileChange($event, i)"
            (fileRemoved)="onFileRemove(i)"
            [disabled]="disabled"
          >
          </app-file-input>
        </div>

        <!-- Add More Button (only show if there are files and under max limit) -->
        <div *ngIf="shouldShowAddButton()" class="flex items-center">
          <div
            class="bg-surface-support-info rounded-full flex justify-center items-center p-2 cursor-pointer hover:bg-opacity-80 transition-colors duration-200"
            (click)="triggerFileInput()"
            aria-label="tooltip"
            [pTooltip]="toolTip"
            [class.opacity-50]="disabled"
            [class.cursor-not-allowed]="disabled"
          >
            <span class="material-symbols-outlined">add_2</span>
          </div>
        </div>
      </div>

      <!-- File limit info -->
      <div class="text-xs text-gray-500 mt-2" *ngIf="maxFiles">
        {{ getFilesWithDataCount() }} of {{ maxFiles }} files
      </div>
    </div>
  `,
})
export class MultiFileInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() toolTip: string;
  @Input() required: boolean = false;
  @Input() accept: string = '*';
  @Input() ariaLabelTranslateKey: string = '';
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB
  @Input() maxFiles: number | undefined = 5;
  @Input() disabled: boolean = false;
  @Input() control!: FormControl; // This will receive the FormArray
  @Input() existingFiles: any[] = [];
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() documentsDeleted = new EventEmitter<string[]>();
  private deletedFileNames: string[] = [];

  @ViewChild('hiddenFileInput') hiddenFileInput!: ElementRef<HTMLInputElement>;

  fileItems: FileItem[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.existingFiles && this.existingFiles.length > 0) {
      this.initializeWithExistingFiles();
    } else {
      this.initializeWithOneFileInput();
    }
  }

  ngOnChanges(changes: any) {
    if (
      changes['existingFiles'] &&
      this.existingFiles &&
      this.existingFiles.length > 0
    ) {
      this.fileItems = [];
      this.initializeWithExistingFiles();
    }
  }

  private initializeWithExistingFiles() {
    this.existingFiles.forEach((existingFile) => {
      const fileControl = this.fb.control(existingFile.fileName);
      const fileItem: FileItem = {
        file: null,
        control: fileControl,
        id: this.generateId(),
        existingFile: existingFile,
      };
      this.fileItems.push(fileItem);
    });

    this.updateParentControl();
  }

  private initializeWithOneFileInput() {
    const fileControl = this.fb.control(null);
    const fileItem: FileItem = {
      file: null,
      control: fileControl,
      id: this.generateId(),
    };

    this.fileItems.push(fileItem);
    this.updateParentControl();
  }

  shouldShowAddButton(): boolean {
    if (this.disabled) return false;
    if (this.maxFiles && this.getFilesWithDataCount() >= this.maxFiles)
      return false;

    // Show add button if at least one file exists or has been selected
    return this.fileItems.some(
      (item) => item.file !== null || item.existingFile
    );
  }

  getFilesWithDataCount(): number {
    return this.fileItems.filter(
      (item) => item.file !== null || item.existingFile
    ).length;
  }

  triggerFileInput() {
    if (this.disabled) return;
    if (this.maxFiles && this.getFilesWithDataCount() >= this.maxFiles) return;

    this.hiddenFileInput.nativeElement.click();
  }

  onHiddenFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.isValidFile(file)) {
      this.addFileItemWithFile(file);
    }

    // Clear the input so the same file can be selected again if needed
    input.value = '';
  }

  private isValidFile(file: File): boolean {
    // Check file size
    if (file.size > this.maxFileSize) {
      console.error(
        `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`
      );
      return false;
    }

    // Check file type if accept is specified and not wildcard
    if (this.accept && this.accept !== '*') {
      const acceptedTypes = this.accept.split(',').map((type) => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      const isAccepted = acceptedTypes.some((acceptType) => {
        if (acceptType.startsWith('.')) {
          return acceptType.toLowerCase() === fileExtension;
        } else {
          return mimeType.match(acceptType.replace('*', '.*'));
        }
      });

      if (!isAccepted) {
        console.error(`File type not accepted. Allowed types: ${this.accept}`);
        return false;
      }
    }

    return true;
  }

  private addFileItemWithFile(file: File) {
    const fileControl = this.fb.control(file);
    const fileItem: FileItem = {
      file: file,
      control: fileControl,
      id: this.generateId(),
      initialFile: file, // Set the initial file
    };

    this.fileItems.push(fileItem);
    this.updateParentControl();
    this.emitFilesChanged();
  }

  onFileChange(event: Event, index: number) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.fileItems[index].file = file;
      this.fileItems[index].control.setValue(file);
      this.fileItems[index].initialFile = undefined; // Clear initial file after change
      this.updateParentControl();
      this.emitFilesChanged();
    }
  }

  onFileRemove(index: number) {
    const fileItem = this.fileItems[index];

    // Track deleted existing files by fileName
    if (fileItem.existingFile) {
      this.deletedFileNames.push(fileItem.existingFile.blobUrl);
    }

    const filesWithData = this.getFilesWithDataCount();

    if (filesWithData === 1) {
      this.fileItems[index].file = null;
      this.fileItems[index].control.setValue(null);
      this.fileItems[index].initialFile = undefined;
      this.fileItems[index].existingFile = undefined;
    } else {
      this.fileItems.splice(index, 1);
    }

    this.updateParentControl();
    this.emitFilesChanged();
  }

  private updateParentControl() {
    const files = this.fileItems
      .map((item) => item.file)
      .filter((file) => file !== null) as File[];

    this.control.setValue(files);
    this.control.markAsDirty();
  }

  private emitFilesChanged() {
    const files = this.fileItems
      .map((item) => item.file)
      .filter((file) => file !== null) as File[];

    this.filesChanged.emit(files);
    this.documentsDeleted.emit(this.deletedFileNames);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackByFileItem(index: number, item: FileItem): string {
    return item.id;
  }
}
