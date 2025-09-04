import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit {
  @Input('appHasPermission') permission: string | string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.checkPermission();
  }

  private checkPermission(): void {
    // If permission is empty, undefined, or empty array, always show the content
    if (!this.permission ||
        (Array.isArray(this.permission) && this.permission.length === 0) ||
        this.permission === '') {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      this.viewContainer.clear();
      return;
    }

    try {
      // Decode token
      const decodedToken = jwtDecode<any>(token);
      // Check permissions
      const permissions = decodedToken.permission || [];

      // Check for multiple permissions - if ANY permission matches, show content
      if (Array.isArray(this.permission)) {
        const hasAnyPermission = this.permission.some(perm =>
          Array.isArray(permissions)
            ? permissions.includes(perm)
            : permissions === perm
        );
        if (hasAnyPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      } else {
        // Check for single permission
        const hasPermission = Array.isArray(permissions)
          ? permissions.includes(this.permission)
          : permissions === this.permission;
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    } catch (error) {
      this.viewContainer.clear();
    }
  }
}
