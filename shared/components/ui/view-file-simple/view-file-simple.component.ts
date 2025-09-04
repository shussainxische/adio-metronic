import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SimpleDocument {
  id: string;
  fileName: string;
  blobUrl?: string;
}

@Component({
  selector: 'app-view-file-simple',
  imports: [CommonModule],
  templateUrl: './view-file-simple.component.html',
  styleUrl: './view-file-simple.component.scss',
})
export class ViewFileSimpleComponent {
  @Input() document?: SimpleDocument;
  @Input() placeholder: string = 'No file uploaded';
  @Input() className: string = '';

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

  get canDownload(): boolean {
    return !!this.document?.id;
  }

  downloadFile(): void {
    if (!this.canDownload) {
      console.error('Cannot download file - no document ID');
      return;
    }

    // Mock download - in real app this would call API
    console.log('Downloading file:', this.document!.fileName);
    alert(`Would download: ${this.document!.fileName}`);
  }
}