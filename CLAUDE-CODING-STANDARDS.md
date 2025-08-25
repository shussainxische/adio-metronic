# Claude Code Development Standards

## Project Context
- **Framework**: Angular 19.1.0 with standalone components
- **Styling**: Tailwind CSS with custom design system configuration
- **Architecture**: Generic component pattern with content projection
- **Theme**: Metronic theme integration with ADIO branding

## Core Principles

### 1. Component Architecture
- **Generic Components**: Create reusable container components that use `<ng-content>` for content projection
- **Data Handling**: Handle specific data and layouts in pages, not in UI components
- **Minimal Logic**: UI components should have minimal business logic
- **Composition Over Specialization**: Favor component composition over creating specialized components

```typescript
// ✅ Good: Generic container component
@Component({
  selector: 'app-preview-card',
  template: `
    <div class="rounded-2xl border border-stroke-container p-8 h-full" [class]="className">
      <ng-content></ng-content>
    </div>
  `
})
export class PreviewCardComponent {
  @Input() className = '';
  @Input() showShadow = true;
}

// ❌ Bad: Specialized component with business logic
export class SpecializedApplicationCardComponent {
  @Input() application: Application;
  // Lots of specific logic here...
}
```

### 2. Styling Standards

#### Use Tailwind Config Classes ONLY
- **Never** add custom CSS classes or inline styles
- **Always** use predefined Tailwind config tokens
- **Reference** the project's `tailwind.config.js` for available design tokens

```html
<!-- ✅ Good: Using config tokens -->
<div class="text-primary-on-surface bg-status-pending text-2sm">
  {{ content }}
</div>

<!-- ❌ Bad: Custom styling -->
<div class="text-blue-600 bg-yellow-100" style="font-size: 14px;">
  {{ content }}
</div>
```

#### Available Design Tokens
- **Colors**: `text-primary-on-surface`, `bg-status-pending`, `text-gray-600`, etc.
- **Typography**: `text-2sm`, `text-3xs`, `text-1.5xl`, etc.
- **Spacing**: Use standard Tailwind spacing (`mb-4`, `p-6`, etc.)
- **Borders**: `border-stroke-container`, `rounded-xl` (preferred over `rounded-2xl`)
- **Shadows**: `shadow-0-1` (from config)
- **Surfaces**: `bg-surface-active-status`, `border-stroke-container`

#### Spacing & Border Radius Guidelines
- **Card Padding**: Use `p-6` for balanced spacing (avoid overly spacious `p-8`)
- **Border Radius**: Use `rounded-xl` for subtle roundedness (avoid excessive `rounded-2xl`)
- **Consistent Spacing**: Apply same padding/radius patterns across similar components

### 3. File Naming & Structure

#### Component Naming
```
✅ Good:
- top-card.component.ts (matches functionality)
- preview-card.component.ts (generic, reusable)
- status-badge.component.ts (specific utility)

❌ Bad:
- card-row.component.ts (unclear purpose)
- application-specific-card.component.ts (too specialized)
```

#### Directory Structure
```
src/app/components/ui/
├── top-card/
│   ├── top-card.component.ts
│   ├── top-card.component.html
│   ├── top-card.component.scss (minimal/empty)
│   └── top-card.component.spec.ts
├── preview-card/
└── status-badge/
```

### 4. TypeScript Standards

#### Interface Definitions
```typescript
// ✅ Clear, descriptive interfaces
interface Application {
  id: string;
  companyName: string;
  companyType?: string;
  type: string;
  status: 'Pending' | 'Completed';
  progress: number;
  date: string;
  deadline?: string;
  category?: string;
  certifyingBody?: string;
}

// ✅ Union types for variants
type StatusBadgeVariant = 'active' | 'success' | 'warning' | 'pending' | 'archived' | 'complete';
```

#### Component Properties
```typescript
// ✅ Generic component inputs
@Input() className = '';
@Input() showShadow = true;
@Input() titleMode: 'primary' | 'secondary' = 'primary';

// ❌ Specific business inputs in generic components
@Input() applicationData: Application;
@Input() showApplicationStatus = true;
```

### 5. Template Standards

#### Content Projection Pattern
```html
<!-- ✅ Generic container with projection -->
<div class="card-container" [class]="className">
  <div *ngIf="!!title" class="title">{{ title | translate }}</div>
  <ng-content></ng-content>
</div>
```

#### Dynamic Component Usage
```html
<!-- ✅ Page handles data, components handle display -->
<app-preview-card 
  *ngFor="let app of filteredApplications"
  [className]="'h-full group'"
  [showShadow]="true">
  
  <app-status-badge
    [text]="getBadgeText(app.type, app.status)"
    [variant]="getStatusVariant(app.status)"
    size="xs">
  </app-status-badge>
  
  <h3 class="text-1.5xl font-bold text-primary-on-surface">{{ app.id }}</h3>
  <!-- More content... -->
</app-preview-card>
```

### 6. State Management

#### Component Methods
```typescript
// ✅ Pure mapping functions
getStatusVariant(status: string): StatusBadgeVariant {
  const statusMap: { [key: string]: StatusBadgeVariant } = {
    'Pending': 'pending',
    'Completed': 'complete',
    'Active': 'active'
  };
  return statusMap[status] || 'pending';
}

// ✅ Clear filter logic
filterApplications(type: string) {
  this.selectedFilter = type;
  this.filteredApplications = type === 'All' 
    ? this.applications 
    : this.applications.filter(app => app.type === type);
}
```

### 7. Import Standards

#### Component Imports
```typescript
// ✅ Organized imports
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TopCardComponent } from '../../components/ui/top-card/top-card.component';
import { StatusBadgeComponent, StatusBadgeVariant } from '../../components/ui/status-badge/status-badge.component';
```

#### Standalone Component Pattern
```typescript
@Component({
  selector: 'app-esp',
  standalone: true,
  imports: [CommonModule, TranslateModule, TopCardComponent, PreviewCardComponent, StatusBadgeComponent],
  templateUrl: './esp.component.html',
  styleUrl: './esp.component.scss'
})
```

### 8. Code Comments & Documentation

#### NO Comments Unless Required
- Code should be self-documenting
- Only add comments for complex business logic
- Never add decorative comments

```typescript
// ❌ Unnecessary comments
// This method filters applications
filterApplications(type: string) { ... }

// ✅ Useful comment (when needed)
// Map application status to badge variant using design system tokens
getStatusVariant(status: string): StatusBadgeVariant { ... }
```

### 9. Git Commit Standards

#### Commit Message Format
```
Brief descriptive title

- Specific change 1
- Specific change 2  
- Specific change 3

🤖 Generated with [Claude Code](https://claude.ai/code)
```

#### Examples
```
Implement dynamic badge rendering with StatusBadgeComponent integration

- Replace hardcoded badge spans with dynamic StatusBadgeComponent usage
- Add status and type mapping methods for consistent badge variants
- Update ESP component to use existing design system badge patterns
- Maintain lean Tailwind config styling approach
```

### 10. Testing Standards

#### Component Testing
- Keep existing test structure
- Update imports when refactoring
- Test component inputs/outputs, not implementation details

### 11. Performance Considerations

#### Bundle Optimization
- Use standalone components for better tree-shaking
- Import only what's needed
- Leverage Angular's built-in optimizations

#### Template Optimization
- Use `*ngFor` with `trackBy` for large lists (when needed)
- Avoid complex expressions in templates
- Use pure pipes when possible

## Key Learnings from ESP Implementation

1. **Always check existing components** before creating new ones
2. **Design system first** - use predefined tokens and components
3. **Generic over specific** - create reusable containers, handle data in pages
4. **Minimal styling** - rely on Tailwind config, avoid custom CSS
5. **Content projection** - use `<ng-content>` for flexible component composition

## Tools & Commands

#### Development
```bash
npm start                    # Start dev server
npm run lint                 # Run linting
npm run typecheck           # Type checking
```

#### Git Workflow
```bash
git status                   # Check status
git add .                    # Stage changes
git commit -m "message"      # Commit with message
git push origin NK           # Push to NK branch
```

---

*This document should be referenced for all future development work to maintain consistency and code quality.*