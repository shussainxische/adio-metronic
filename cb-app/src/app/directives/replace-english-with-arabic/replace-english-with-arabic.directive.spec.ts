import { ReplaceEnglishWithArabicDirective } from './replace-english-with-arabic.directive';
import { NgControl } from '@angular/forms';
import { ElementRef } from '@angular/core';

describe('ReplaceEnglishWithArabicDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: {} } as ElementRef; // Mock ElementRef
    const mockNgControl = {
      control: {
        setValue: jasmine.createSpy('setValue')
      }
    } as unknown as NgControl;
    const directive = new ReplaceEnglishWithArabicDirective(mockElementRef, mockNgControl); // Inject the mock ElementRef
    expect(directive).toBeTruthy();
  });
});
