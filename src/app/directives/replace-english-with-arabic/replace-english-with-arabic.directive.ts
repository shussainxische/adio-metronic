import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appReplaceEnglishWithArabic]'
})
export class ReplaceEnglishWithArabicDirective {
  
  @Input() forceMode: 'english-to-arabic' | 'arabic-to-english' = 'english-to-arabic';

  // English to Arabic mapping (lowercase English keys)
  private englishToArabicMap: { [key: string]: string } = {
    'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف',
    'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح',
    '[': 'ج', ']': 'د', 'a': 'ش', 's': 'س', 'd': 'ي',
    'f': 'ب', 'g': 'ل', 'h': 'ا', 'j': 'ت', 'k': 'ن',
    'l': 'م', ';': 'ك', '\'': 'ط', 'z': 'ئ', 'x': 'ء',
    'c': 'ؤ', 'v': 'ر', 'b': 'ﻻ', 'n': 'ى', 'm': 'ة',
    ',': 'و', '.': 'ز', '/': 'ظ', '`': 'ذ',
  };

  // English Shift combinations to Arabic
  private shiftMap: { [key: string]: string } = {
    'q': 'َ', 'w': 'ً', 'e': 'ُ', 'r': 'ٌ', 't': 'ﻹ',
    'y': 'إ', 'u': '`', 'i': '÷', 'o': '×', 'p': '؛',
    '{': '<', '}': '>', 'a': 'ِ', 's': 'ٍ', 'd': ']',
    'f': '[', 'g': 'ﻷ', 'h': 'أ', 'j': 'ـ', 'k': '،',
    'l': '/', ':': ':', '"': '"', 'z': '~', 'x': 'ْ',
    'c': '}', 'v': '{', 'b': 'ﻵ', 'n': 'آ', 'm': '\'',
    '<': ',', '>': '.', '?': '؟', '~': 'ّ',
  };

  // Arabic to English mapping (reverse of englishToArabicMap)
  private arabicToEnglishMap: { [key: string]: string } = {
    'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't',
    'غ': 'y', 'ع': 'u', 'ه': 'i', 'خ': 'o', 'ح': 'p',
    'ج': '[', 'د': ']', 'ش': 'a', 'س': 's', 'ي': 'd',
    'ب': 'f', 'ل': 'g', 'ا': 'h', 'ت': 'j', 'ن': 'k',
    'م': 'l', 'ك': ';', 'ط': '\'', 'ئ': 'z', 'ء': 'x',
    'ؤ': 'c', 'ر': 'v', 'ﻻ': 'b', 'ى': 'n', 'ة': 'm',
    'و': ',', 'ز': '.', 'ظ': '/', 'ذ': '`',
  };

  // Arabic shift characters to English (reverse of shiftMap)
  private arabicShiftMap: { [key: string]: string } = {
    'َ': 'q', 'ً': 'w', 'ُ': 'e', 'ٌ': 'r', 'ﻹ': 't',
    'إ': 'y', '`': 'u', '÷': 'i', '×': 'o', '؛': 'p',
    '<': '{', '>': '}', 'ِ': 'a', 'ٍ': 's', ']': 'd',
    '[': 'f', 'ﻷ': 'g', 'أ': 'h', 'ـ': 'j', '،': 'k',
    '/': 'l', ':': ':', '"': '"', '~': 'z', 'ْ': 'x',
    '}': 'c', '{': 'v', 'ﻵ': 'b', 'آ': 'n', '\'': 'm',
    ',': '<', '.': '>', '؟': '?', 'ّ': '~',
  };

  // English lowercase to uppercase mapping
  private englishUppercaseMap: { [key: string]: string } = {
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E',
    'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J',
    'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O',
    'p': 'P', 'q': 'Q', 'r': 'R', 's': 'S', 't': 'T',
    'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y',
    'z': 'Z'
  };

  // English uppercase to lowercase mapping
  private englishLowercaseMap: { [key: string]: string } = {
    'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e',
    'F': 'f', 'G': 'g', 'H': 'h', 'I': 'i', 'J': 'j',
    'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o',
    'P': 'p', 'Q': 'q', 'R': 'r', 'S': 's', 'T': 't',
    'U': 'u', 'V': 'v', 'W': 'w', 'X': 'x', 'Y': 'y',
    'Z': 'z'
  };

  // Non-character keys to ignore
  private nonCharacterKeys = new Set([
    'Backspace', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Control', 'Alt', 'Shift', 'Meta', 'Tab', 'CapsLock', 'Escape', 'Delete',
    'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'F1', 'F2', 'F3', 'F4',
    'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
  ]);

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Ignore special keys
    if (this.nonCharacterKeys.has(event.key)) return;
    
    // Ignore Ctrl and Alt combinations
    if (event.ctrlKey || event.altKey) return;

    let key = event.key;
    let isShift = event.shiftKey;
    let isCapsLock = event.getModifierState && event.getModifierState('CapsLock');
    let mappedKey: string | undefined;

    if (this.forceMode === 'arabic-to-english') {
      // Arabic to English conversion
      mappedKey = this.convertArabicToEnglish(key, isShift, isCapsLock);
    } else {
      // English to Arabic conversion (default)
      mappedKey = this.convertEnglishToArabic(key, isShift, isCapsLock);
    }

    if (!mappedKey) {
      return; // If not a mapped key, allow default behavior
    }

    // Prevent default behavior and insert mapped character
    event.preventDefault();
    this.insertMappedCharacter(mappedKey);
  }

  private convertEnglishToArabic(key: string, isShift: boolean, isCapsLock: boolean): string | undefined {
    let lowerKey = key.toLowerCase();
    
    if (isShift) {
      // Handle shift combinations first
      if (this.shiftMap[lowerKey]) {
        return this.shiftMap[lowerKey];
      }
      // Handle uppercase letters with shift
      if (this.englishLowercaseMap[key] && this.englishToArabicMap[this.englishLowercaseMap[key]]) {
        return this.englishToArabicMap[this.englishLowercaseMap[key]];
      }
    }
    
    // Handle regular character mapping
    if (this.englishToArabicMap[lowerKey]) {
      return this.englishToArabicMap[lowerKey];
    }

    // Handle uppercase letters without shift (caps lock only)
    if (isCapsLock && !isShift && this.englishLowercaseMap[key]) {
      return this.englishToArabicMap[this.englishLowercaseMap[key]];
    }

    return undefined;
  }

  private convertArabicToEnglish(key: string, isShift: boolean, isCapsLock: boolean): string | undefined {
    let mappedKey: string | undefined;

    // Check if it's a shift character first
    if (this.arabicShiftMap[key]) {
      mappedKey = this.arabicShiftMap[key];
      
      // Apply case logic for converted English character
      if (isCapsLock && !isShift) {
        // Caps lock on, shift not pressed - uppercase
        return this.englishUppercaseMap[mappedKey] || mappedKey.toUpperCase();
      } else if (isCapsLock && isShift) {
        // Caps lock on, shift pressed - lowercase (inverted)
        return mappedKey.toLowerCase();
      } else if (!isCapsLock && isShift) {
        // Caps lock off, shift pressed - uppercase
        return this.englishUppercaseMap[mappedKey] || mappedKey.toUpperCase();
      } else {
        // Caps lock off, shift not pressed - lowercase
        return mappedKey.toLowerCase();
      }
    }

    // Check regular Arabic characters
    if (this.arabicToEnglishMap[key]) {
      mappedKey = this.arabicToEnglishMap[key];
      
      // Apply case logic
      if (isCapsLock && !isShift) {
        // Caps lock on, shift not pressed - uppercase
        return this.englishUppercaseMap[mappedKey] || mappedKey.toUpperCase();
      } else if (isCapsLock && isShift) {
        // Caps lock on, shift pressed - lowercase (inverted)
        return mappedKey.toLowerCase();
      } else if (!isCapsLock && isShift) {
        // Caps lock off, shift pressed - uppercase
        return this.englishUppercaseMap[mappedKey] || mappedKey.toUpperCase();
      } else {
        // Caps lock off, shift not pressed - lowercase
        return mappedKey.toLowerCase();
      }
    }

    return undefined;
  }

  private insertMappedCharacter(mappedKey: string): void {
    const input = this.el.nativeElement as HTMLTextAreaElement | HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const value = input.value;
    
    // Create new value with the mapped character
    const newValue = value.slice(0, start) + mappedKey + value.slice(end);
    
    // Update the input value
    input.value = newValue;
    
    // Update the form control if it exists
    if (this.control && this.control.control) {
      this.control.control.setValue(newValue, { emitEvent: true });
    }
    
    // Set cursor position after the inserted character
    const newPosition = start + mappedKey.length;
    input.setSelectionRange(newPosition, newPosition);
  }
}