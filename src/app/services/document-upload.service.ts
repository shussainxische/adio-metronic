import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for document upload response
export interface DocumentUploadResponse {
  data: {
    documentId?: string;
    fileName?: string;
    fileSize?: number;
    uploadedAt?: string;
    documentUrl?: string;
  };
  errors: any[];
  responseTime: string;
  isSuccess: boolean;
}

// Interface for upload progress tracking
export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  private baseApiUrl = '/api/Application/cb-post-upload-document';

  constructor(private http: HttpClient) {}

  /**
   * Upload a document file for a specific application
   * @param appId - Application ID (integer)
   * @param file - File to upload
   * @param reportProgress - Whether to report upload progress (default: true)
   * @returns Observable<HttpEvent<DocumentUploadResponse>> for progress tracking or DocumentUploadResponse
   */
  uploadDocument(
    appId: number, 
    file: File, 
    reportProgress: boolean = true
  ): Observable<HttpEvent<DocumentUploadResponse>> {
    const url = `${this.baseApiUrl}/${appId}`;
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    // Create HTTP request with progress reporting
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: reportProgress,
      responseType: 'json'
    });

    return this.http.request<DocumentUploadResponse>(req);
  }

  /**
   * Upload a document without progress tracking (simpler response)
   * @param appId - Application ID (integer)
   * @param file - File to upload
   * @returns Observable<DocumentUploadResponse>
   */
  uploadDocumentSimple(appId: number, file: File): Observable<DocumentUploadResponse> {
    const url = `${this.baseApiUrl}/${appId}`;
    
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    return this.http.post<DocumentUploadResponse>(url, formData);
  }

  /**
   * Upload multiple documents for a specific application
   * @param appId - Application ID (integer)
   * @param files - Array of files to upload
   * @returns Observable<DocumentUploadResponse>[]
   */
  uploadMultipleDocuments(appId: number, files: File[]): Observable<DocumentUploadResponse>[] {
    return files.map(file => this.uploadDocumentSimple(appId, file));
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @param maxSizeBytes - Maximum file size in bytes (default: 10MB)
   * @param allowedTypes - Array of allowed MIME types (default: common document types)
   * @returns Validation result with success flag and error message
   */
  validateFile(
    file: File, 
    maxSizeBytes: number = 10 * 1024 * 1024, // 10MB default
    allowedTypes: string[] = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ]
  ): { isValid: boolean; errorMessage?: string } {
    // Check file size
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        errorMessage: `File size exceeds maximum allowed size of ${this.formatFileSize(maxSizeBytes)}`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        isValid: false,
        errorMessage: 'File is empty'
      };
    }

    return { isValid: true };
  }

  /**
   * Format file size in human readable format
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Extract upload progress information from HttpEvent
   * @param event - HTTP Event from upload request
   * @param fileName - Name of the file being uploaded
   * @returns UploadProgress object or null
   */
  getUploadProgress(event: HttpEvent<any>, fileName: string): UploadProgress | null {
    if (event.type === 1 && event.total) { // HttpEventType.UploadProgress
      const progress = Math.round(100 * event.loaded / event.total);
      return {
        progress,
        loaded: event.loaded,
        total: event.total,
        fileName
      };
    }
    return null;
  }
}