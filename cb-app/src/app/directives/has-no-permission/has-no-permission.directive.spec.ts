import { HasNoPermissionDirective } from './has-no-permission.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';

describe('HasNoPermissionDirective', () => {
  it('should create an instance', () => {
    const mockTemplateRef = {} as TemplateRef<any>;
    const mockViewContainerRef = {
      clear: jasmine.createSpy('clear'),
      createEmbeddedView: jasmine.createSpy('createEmbeddedView'),
    } as unknown as ViewContainerRef;

    const directive = new HasNoPermissionDirective(
      mockTemplateRef,
      mockViewContainerRef
    );
    expect(directive).toBeTruthy();
  });
});
