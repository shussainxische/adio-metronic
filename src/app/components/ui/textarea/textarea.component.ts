import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReplaceEnglishWithArabicDirective } from '../../../directives/replace-english-with-arabic/replace-english-with-arabic.directive';
import { Language, TranslateModule } from '@ngx-translate/core';
import { Editor, EditorModule } from 'primeng/editor';
import { requiredWithTrim } from '../../../validators';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ReplaceEnglishWithArabicDirective,
    EditorModule,
    TranslateModule,
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextAreaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() language: Language = null;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() richText: boolean = false;
  @Input() listMode: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  private previousLanguage: Language = null;
  private placeholderUpdateTimeout: any;

  @ViewChild(Editor) editor: Editor;

  private quillInstance: any;
  private englishToArabicMap: { [key: string]: string } = {
    q: 'ض',
    w: 'ص',
    e: 'ث',
    r: 'ق',
    t: 'ف',
    y: 'غ',
    u: 'ع',
    i: 'ه',
    o: 'خ',
    p: 'ح',
    '[': 'ج',
    ']': 'د',
    a: 'ش',
    s: 'س',
    d: 'ي',
    f: 'ب',
    g: 'ل',
    h: 'ا',
    j: 'ت',
    k: 'ن',
    l: 'م',
    ';': 'ك',
    "'": 'ط',
    z: 'ئ',
    x: 'ء',
    c: 'ؤ',
    v: 'ر',
    b: 'ﻻ',
    n: 'ى',
    m: 'ة',
    ',': 'و',
    '.': 'ز',
    '/': 'ظ',
    '`': 'ذ',
  };

  private shiftMap: { [key: string]: string } = {
    q: 'َ',
    w: 'ً',
    e: 'ُ',
    r: 'ٌ',
    t: 'ﻹ',
    y: 'إ',
    u: '`',
    i: '÷',
    o: '×',
    p: '؛',
    '{': '<',
    '}': '>',
    a: 'ِ',
    s: 'ٍ',
    d: ']',
    f: '[',
    g: 'ﻷ',
    h: 'أ',
    j: 'ـ',
    k: '،',
    l: '/',
    ':': ':',
    '"': '"',
    z: '~',
    x: 'ْ',
    c: '}',
    v: '{',
    b: 'ﻵ',
    n: 'آ',
    m: "'",
    '<': ',',
    '>': '.',
    '?': '؟',
    '~': 'ّ',
  };

  private nonCharacterKeys = new Set([
    'Backspace',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Control',
    'Alt',
    'Shift',
    'Meta',
    'Tab',
    'CapsLock',
    'Escape',
  ]);

  get isRtl(): boolean {
    return this.language === 'ar';
  }

  get hasError(): boolean {
    return this.control && this.control?.invalid && this.control?.touched;
  }

  ngOnInit() {
    if (this.disabled) {
      this.control?.disable();
    }

    if (this.richText) {
      this.control?.valueChanges.subscribe((value) => {
        const isEmpty = this.isContentEmpty(value);
        if (isEmpty && this.required) {
          this.control?.setErrors({ required: true });
        }
      });

      setTimeout(() => {
        const value = this.control?.value;
        const isEmpty = this.isContentEmpty(value);
        if (isEmpty && this.required) {
          this.control?.setErrors({ required: true });
        }
      }, 0);
    }
  }

  private isContentEmpty(value: string): boolean {
    if (!value) return true;

    if (this.listMode) {
      const textContent = value
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/\s+/g, '')
        .trim();
      return textContent.length === 0;
    }

    return (
      value === '<p></p>' ||
      value === '<p><br></p>' ||
      value === '<p> </p>' ||
      value === '<p>&nbsp;</p>' ||
      value
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/\s+/g, '').length === 0
    );
  }

  ngAfterViewInit() {
    if (this.richText) {
      setTimeout(() => {
        if (this.editor) {
          this.quillInstance = this.editor.getQuill();

          if (this.listMode) {
            this.initializeListMode();
          }

          if (this.isRtl) {
            this.setupRtlMode();
          } else {
            this.setupNormalMode();
          }
        }
        this.updateRichTextPlaceholder();
      }, 1000);
    }
  }

  private initializeListMode() {
    if (!this.quillInstance) return;

    const currentContent = this.quillInstance.getText().trim();
    if (!currentContent || currentContent === '') {
      this.quillInstance.setText('');
      this.quillInstance.formatLine(0, 1, 'list', 'bullet');
      // this.quillInstance.focus();
    } else {
      const length = this.quillInstance.getLength();
      this.quillInstance.formatText(0, length, 'list', 'bullet');
    }

    this.quillInstance.on(
      'text-change',
      (delta: any, oldDelta: any, source: string) => {
        if (source === 'user') {
          setTimeout(() => this.enforceListFormat(), 10);
        }
      }
    );

    const editorElement =
      this.editor.el.nativeElement.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.dir = 'rtl';
      editorElement.addEventListener('keydown', (event: KeyboardEvent) => {
        this.handleListModeKeydown(event);
      });

      editorElement.addEventListener('paste', (event: ClipboardEvent) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain') || '';
        if (text) {
          const selection = this.quillInstance.getSelection();
          if (selection) {
            this.quillInstance.insertText(selection.index, text);
            setTimeout(() => this.enforceListFormat(), 10);
          }
        }
      });
    }
  }

  private enforceListFormat() {
    if (!this.quillInstance) return;

    const length = this.quillInstance.getLength();
    const text = this.quillInstance.getText();

    if (length <= 1 || text.trim() === '') {
      this.quillInstance.setText('');
      this.quillInstance.formatLine(0, 1, 'list', 'bullet');
      return;
    }

    let currentIndex = 0;
    while (currentIndex < length - 1) {
      const format = this.quillInstance.getFormat(currentIndex, 1);
      if (!format.list) {
        this.quillInstance.formatLine(currentIndex, 1, 'list', 'bullet');
      }

      const remainingText = this.quillInstance.getText(
        currentIndex,
        length - currentIndex
      );
      const nextNewline = remainingText.indexOf('\n');
      if (nextNewline === -1) break;
      currentIndex += nextNewline + 1;
    }

    const lines = text.split('\n').filter((line) => line !== '');
    if (lines.length === 0) {
      this.quillInstance.formatLine(0, 1, 'list', 'bullet');
    }

    requestAnimationFrame(() => {
      const htmlValue = this.quillInstance.root.innerHTML;
      this.control?.setValue(htmlValue, {
        emitEvent: true,
        emitModelToViewChange: false,
      });
    });
  }

  private handleListModeKeydown(event: KeyboardEvent) {
    const selection = this.quillInstance.getSelection();
    if (!selection) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      const currentLine = this.quillInstance.getLine(selection.index);
      const lineText = currentLine[0].domNode.textContent || '';

      if (lineText.trim() === '') {
        return;
      }

      this.quillInstance.insertText(selection.index, '\n');
      this.quillInstance.formatLine(selection.index + 1, 1, 'list', 'bullet');
      this.quillInstance.setSelection(selection.index + 1, 0);
      return;
    }

    if (event.key === 'Backspace') {
      const lineStart = this.getLineStart(selection.index);
      const format = this.quillInstance.getFormat(selection.index, 1);

      if (selection.index === lineStart) {
        const allText = this.quillInstance.getText();
        const lines = allText.split('\n').filter((line) => line.trim() !== '');
        const currentLineText = this.getLineText(selection.index).trim();

        if (lines.length <= 1 && currentLineText === '') {
          event.preventDefault();
          return;
        }

        if (lines.length === 1 && currentLineText !== '') {
          event.preventDefault();
          return;
        }

        if (format.list) {
          event.preventDefault();
          return;
        }
      }
    }

    if (event.key === 'Delete') {
      const lineStart = this.getLineStart(selection.index);
      const format = this.quillInstance.getFormat(selection.index, 1);

      if (selection.index === lineStart && format.list) {
        event.preventDefault();
        return;
      }
    }
  }

  private getLineStart(index: number): number {
    const text = this.quillInstance.getText(0, index);
    const lastNewline = text.lastIndexOf('\n');
    return lastNewline === -1 ? 0 : lastNewline + 1;
  }

  private getLineText(index: number): string {
    const lineStart = this.getLineStart(index);
    const text = this.quillInstance.getText();
    const nextNewline = text.indexOf('\n', lineStart);
    const lineEnd = nextNewline === -1 ? text.length : nextNewline;
    return text.substring(lineStart, lineEnd);
  }

  private setupRtlMode() {
    const editorElement =
      this.editor.el.nativeElement.querySelector('.ql-editor');
    if (editorElement) {
      this.quillInstance.on('text-change', () => {
        requestAnimationFrame(() => {
          const htmlValue = this.quillInstance.root.innerHTML;
          this.control?.setValue(htmlValue, {
            emitEvent: true,
            emitModelToViewChange: false,
          });
        });
      });

      if (!this.listMode) {
        editorElement.addEventListener('keydown', (event: KeyboardEvent) => {
          this.handleArabicKeyMapping(event);
        });
      }

      editorElement.addEventListener('blur', () => {
        this.handleBlurValidation();
      });
    }
  }

  private setupNormalMode() {
    const editorElement =
      this.editor.el.nativeElement.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.addEventListener('blur', () => {
        this.handleBlurValidation();
      });
    }
  }

  private handleArabicKeyMapping(event: KeyboardEvent) {
    if (
      this.nonCharacterKeys.has(event.key) ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    const char = event.key.toLowerCase();
    let arabicChar = '';

    if (event.shiftKey) {
      arabicChar = this.shiftMap[char] || '';
    } else {
      arabicChar = this.englishToArabicMap[char] || '';
    }

    if (arabicChar) {
      event.preventDefault();
      const range = this.quillInstance.getSelection(true);
      if (range) {
        if (range.length > 0) {
          this.quillInstance.deleteText(range.index, range.length);
        }
        this.quillInstance.insertText(range.index, arabicChar);
        this.quillInstance.setSelection(range.index + 1, 0);
      }
    }
  }

  private handleBlurValidation() {
    const value = this.control?.value;
    const isEmpty = this.isContentEmpty(value);

    if (isEmpty && this.required) {
      this.control?.setErrors({ required: true });
      this.control?.markAsTouched();
    }
  }

  convertSelection() {
    if (!this.quillInstance) return;

    const range = this.quillInstance.getSelection();
    if (!range) return;

    let text = this.quillInstance.getText(range.index, range.length);
    let convertedText = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (this.englishToArabicMap[char]) {
        convertedText += this.englishToArabicMap[char];
      } else {
        convertedText += text[i];
      }
    }

    if (convertedText) {
      this.quillInstance.deleteText(range.index, range.length);
      this.quillInstance.insertText(range.index, convertedText);
      this.quillInstance.setSelection(range.index + convertedText.length, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['placeholder'] || changes['language']) &&
      this.richText &&
      this.quillInstance
    ) {
      this.updateRichTextPlaceholder();
    }

    if (changes['listMode'] && this.quillInstance) {
      if (this.listMode) {
        this.initializeListMode();
      }
    }
  }

  ngOnDestroy() {
    if (this.placeholderUpdateTimeout) {
      clearTimeout(this.placeholderUpdateTimeout);
    }
  }

  private updateRichTextPlaceholder() {
    if (this.placeholderUpdateTimeout) {
      clearTimeout(this.placeholderUpdateTimeout);
    }

    this.placeholderUpdateTimeout = setTimeout(() => {
      if (this.editor && this.quillInstance) {
        const editorElement =
          this.editor.el.nativeElement.querySelector('.ql-editor');
        if (editorElement) {
          editorElement.setAttribute('data-placeholder', this.placeholder);
          editorElement.style.setProperty(
            '--placeholder-content',
            `"${this.placeholder}"`
          );
        }
      }
    }, 100);
  }
}
