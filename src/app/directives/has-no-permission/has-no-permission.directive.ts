import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Directive({
  selector: '[appHasNoPermission]',
})
export class HasNoPermissionDirective implements OnInit {
  @Input('appHasNoPermission') permission: string | string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.checkPermission();
  }

  private checkPermission(): void {
    // If permission is empty, undefined, or empty array, never show the content
    // (because if no permission is specified, user technically "has" access to everything)
    if (
      !this.permission ||
      (Array.isArray(this.permission) && this.permission.length === 0) ||
      this.permission === ''
    ) {
      this.viewContainer.clear();
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // No token means no permissions, so show the content
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    try {
      // Decode token
      const decodedToken = jwtDecode<any>(token);
      // Check permissions
      const permissions = decodedToken.permission || [];

      // Check for multiple permissions - if ANY permission matches, HIDE content
      if (Array.isArray(this.permission)) {
        const hasAnyPermission = this.permission.some((perm) =>
          Array.isArray(permissions)
            ? permissions.includes(perm)
            : permissions === perm
        );

        if (hasAnyPermission) {
          this.viewContainer.clear(); // Has permission, so HIDE
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef); // No permission, so SHOW
        }
      } else {
        // Check for single permission
        const hasPermission = Array.isArray(permissions)
          ? permissions.includes(this.permission)
          : permissions === this.permission;

        if (hasPermission) {
          this.viewContainer.clear(); // Has permission, so HIDE
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef); // No permission, so SHOW
        }
      }
    } catch (error) {
      // Token decode error means no valid permissions, so show the content
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
