import { HasPermissionDirective } from './has-permission.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('HasPermissionDirective', () => {
  it('should create an instance', () => {
    const mockTemplateRef = {} as TemplateRef<any>;
    const mockViewContainerRef = {
      clear: jasmine.createSpy('clear'),
      createEmbeddedView: jasmine.createSpy('createEmbeddedView')
    } as unknown as ViewContainerRef;

    const directive = new HasPermissionDirective(mockTemplateRef, mockViewContainerRef);
    expect(directive).toBeTruthy();
  });
});
