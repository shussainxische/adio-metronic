import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() helperText: string = '';
  @Input() accept: string = '.pdf,.doc,.docx';
  @Input() maxSize: number = 10 * 1024 * 1024; // 10MB default
  @Input() multiple: boolean = true;
  @Input() allowedTypes: string[] = ['.pdf', '.doc', '.docx'];
  @Input() disabled: boolean = false;

  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() fileAdded = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<File>();

  uploadedFiles: File[] = [];
  
  private onChange = (files: File[]) => {};
  private onTouched = () => {};

  writeValue(files: File[]): void {
    this.uploadedFiles = files || [];
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDragOver(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.addFiles(files);
    }
  }

  onFileSelect(event: Event): void {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
  }

  private addFiles(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!this.allowedTypes.includes(fileExtension)) {
        alert(`File type not supported: ${file.name}. Please upload ${this.allowedTypes.join(', ')} files.`);
        continue;
      }
      
      // Validate file size
      if (file.size > this.maxSize) {
        const maxSizeMB = this.maxSize / (1024 * 1024);
        alert(`File too large: ${file.name}. Please upload files under ${maxSizeMB}MB.`);
        continue;
      }
      
      // Check if file already exists
      if (this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        alert(`File already uploaded: ${file.name}`);
        continue;
      }
      
      this.uploadedFiles.push(file);
      this.fileAdded.emit(file);
    }
    
    this.onChange(this.uploadedFiles);
    this.filesChanged.emit(this.uploadedFiles);
    this.onTouched();
  }

  removeFile(file: File): void {
    if (this.disabled) return;
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.onChange(this.uploadedFiles);
      this.filesChanged.emit(this.uploadedFiles);
      this.fileRemoved.emit(file);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}