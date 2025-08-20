import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentDto } from '../../../api/models';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-file',
  imports: [CommonModule, TranslateModule],
  templateUrl: './view-file.component.html',
  styleUrl: './view-file.component.scss',
})
export class ViewFileComponent {
  @Input() document?: DocumentDto;
  @Input() placeholder: string = 'No file uploaded';
  @Input() className: string = '';

  // Track only image error state
  hasImageError = false;
  isShowingFallback = false; // Track if we're showing fallback image

  get fileExtension(): string {
    if (!this.document?.fileName) return '';
    return this.document.fileName.split('.').pop()?.toLowerCase() || '';
  }

  get isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    return imageExtensions.includes(this.fileExtension);
  }

  get isPdf(): boolean {
    return this.fileExtension === 'pdf';
  }

  get fileIcon(): string {
    if (this.isPdf) {
      return 'assets/file/pdf.svg';
    } else {
      return 'assets/media/file-types/doc.svg';
    }
  }

  get displayFileName(): string {
    return this.document?.fileName || this.placeholder;
  }

  // Check if download should be enabled
  get canDownload(): boolean {
    return !!(this.document?.id && !this.hasImageError);
  }

  // Handle image success - only reset error state if not showing fallback
  onImageLoad(event: Event): void {
    if (!this.isShowingFallback) {
      this.hasImageError = false;
    }
  }

  // Handle image errors
  onImageError(event: Event): void {
    console.error(
      'Image failed to load:',
      this.document?.fileName,
      this.document?.blobUrl
    );
    this.hasImageError = true;
    this.isShowingFallback = true;
    const target = event.target as HTMLImageElement;
    target.src = this.fileIcon; // Use existing working icon instead
  }

  downloadFile(): void {
    if (!this.canDownload) {
      console.error(
        'Cannot download file - either no document ID or file has errors'
      );
      return;
    }

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `${environment.apiBaseUrl}/api/document/${this.document!.id}/download`
    );
    element.setAttribute('download', this.document!.fileName || 'download');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
