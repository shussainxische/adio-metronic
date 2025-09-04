# ADIO View Instructions UX 1.1

This document provides file paths and locations for developers to find styling, interactions, and state management implementations.

## Implementation Guide
- **HTML Templates**: Find structure and Angular directives
- **SCSS Files**: Extract styling patterns and CSS classes
- **TypeScript Components**: Copy state management logic and interaction methods
- **Reusable Patterns**: Identify common UI patterns across components

## STAGE 1: Quotation

### Location
- **URL Route**: `/adio/applications/ESP003?stage=Quotation&step=0`

### File Paths
- **HTML Template**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.html` (lines 14-121)
- **TypeScript Component**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.ts`
- **Styles**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.scss`

### Related Components
- **Quotation Status**: `src/app/pages/application-detail/stages/rfq/quotation-status/`
- **Rejected Quotations**: `src/app/pages/application-detail/stages/rfq/rejected-quotations/`

### Component Structure
```
src/app/pages/application-detail/stages/rfq/
├── rfq-stage.component.html      # Main table template
├── rfq-stage.component.ts        # Component logic
├── rfq-stage.component.scss      # Component styles
├── quotation-status/             # Status display component
└── rejected-quotations/          # Rejected quotations component
```

### Implementation Files

#### Styling and CSS Classes
- **SCSS File**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.scss`
  - Contains AED currency styling (lines 10-26)
  - Input padding adjustments for currency display
  - ::ng-deep styles for component integration

#### Table Structure and Status Badges
- **HTML Template**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.html` (lines 14-121)
  - Table headers: flex layout with gap-4 spacing (lines 15-23)
  - Status badge classes: bg-green-100/blue-100/gray-100 with corresponding text colors (lines 47-74)
  - Action buttons: Download/Remind with SVG icons (lines 98-115)

#### State Management Logic
- **TypeScript Component**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.ts`
  - Find conditional rendering patterns (*ngIf logic)
  - Button click handlers: viewProposal(), sendReminder()
  - Status evaluation methods for badge display

---

## STAGE 2: Evaluation

### Update 2.1: Quotation Table - Evaluation Stage (In Progress)

#### Location
- **URL Route**: `/adio/applications/ESP005?stage=Quotation&step=0`
- **Application Stage**: Evaluation (Status: In Progress)

#### File Paths
- **HTML Template**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.html` (lines 2-121)
- **TypeScript Component**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.ts`
- **Styles**: `src/app/pages/application-detail/stages/rfq/rfq-stage.component.scss`

#### Template Logic
```html
<!-- Conditional rendering for Evaluation stage -->
<div *ngIf="isAdioView && (application?.stage === 'Quotation' || 
           (application?.stage === 'Evaluation' && 
            (application?.status === 'In Progress' || application?.status === 'Returned')))">
```

#### Key Differences from Regular Quotation View
- **Title**: Shows "Quotation" instead of "Certifying Body Quotations" (line 6)
- **Subtitle**: Shows "Awarded on 15 Dec 2024" (lines 9-11)
- **Status Logic**: Different status badge logic for Evaluation stage (lines 47-59)
  - "Awarded" status for selected CB
  - "Not Awarded" for non-selected CBs
  - "Not Submitted" for pending quotations
- **Actions**: No "Send Reminder" button during Evaluation stage (lines 107-115)

#### Component Structure
Same as regular quotation table but with conditional rendering based on:
- `application?.stage === 'Evaluation'`
- `application?.status === 'In Progress'`

#### Table Features (Evaluation Mode)
- Headers: Certifying Body, Amount, Status, Submitted On, Actions
- Shows awarded quotation with special highlighting
- Download action available for submitted quotations
- No reminder functionality during evaluation
- Historical view of quotation process

---

### Update 2.2: Evaluation Tab

#### Location
- **URL Route**: `/adio/applications/ESP005?stage=Evaluation&step=0`
- **Application Stage**: Evaluation (Status: In Progress)

#### File Paths
- **HTML Template**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.html`
- **TypeScript Component**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.ts`
- **Styles**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.scss`

#### Component Structure
```
src/app/pages/application-detail/stages/evaluation/
├── evaluation-stage.component.html    # Main evaluation template
├── evaluation-stage.component.ts      # Component logic
├── evaluation-stage.component.scss    # Component styles
└── sub-stages/                        # CB sub-components
    ├── general/
    ├── economic-impact/
    ├── productivity/
    ├── ems-dms/
    ├── summary/
    └── review-submit/
```

#### View Logic
Two different views based on user type:

**ADIO View** (`isAdioView = true`):
- Simple alert-based interface (lines 2-53)
- Shows evaluation status messages
- "Send Reminder" button for In Progress/Returned status

**CB View** (`isAdioView = false`):
- Detailed sub-stage components (lines 56-62)
- 6 evaluation steps with navigation
- Form-based evaluation process

#### Status-Based Alerts

**In Progress Status** (lines 11-24):
- Blue alert with info icon
- Message: "Al Tamimi Certification is currently reviewing..."

**Returned Status** (lines 27-40):
- Orange alert with warning icon  
- Message: "The application has been returned..."

#### Sub-Stages (CB View Only)
1. **General** (`currentStep === 0`)
2. **Economic Impact** (`currentStep === 1`) 
3. **Productivity** (`currentStep === 2`)
4. **EMS/DMS** (`currentStep === 3`)
5. **Summary** (`currentStep === 4`)
6. **Review & Submit** (`currentStep === 5`)

### Implementation Files

#### Alert Component Styling
- **HTML Template**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.html` (lines 11-50)
  - In Progress alert: bg-blue-50 border-blue-200 (lines 11-24)
  - Returned alert: bg-orange-50 border-orange-200 (lines 27-40)
  - Send Reminder button: bg-white border-gray-300 with SVG icon (lines 44-49)

#### Component Styling
- **SCSS File**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.scss`
  - Look for alert styling patterns and button hover states
  - Icon and flex layout classes

#### State Management and View Logic
- **TypeScript Component**: `src/app/pages/application-detail/stages/evaluation/evaluation-stage.component.ts`
  - Find isAdioView flag logic
  - currentStep navigation for CB sub-stages
  - Status-based conditional rendering methods

---

## STAGE 3: Review

### Update 3.2: Initial Review Tab

#### Location
- **URL Route**: `/adio/applications/ESP009?stage=Review&step=0`
- **Application Stage**: Review (Status: Initial Review)

#### File Paths
- **HTML Template**: `src/app/pages/application-detail/stages/review/review-stage.component.html`
- **TypeScript Component**: `src/app/pages/application-detail/stages/review/review-stage.component.ts`
- **Styles**: `src/app/pages/application-detail/stages/review/review-stage.component.scss`

#### Related Components
- **Certificate Preview**: `src/app/pages/application-detail/stages/review/certificate-preview/`
- **Review Status**: `src/app/pages/application-detail/stages/review/review-status/`

#### Component Structure
```
src/app/pages/application-detail/stages/review/
├── review-stage.component.html       # Main review template
├── review-stage.component.ts         # Component logic
├── review-stage.component.scss       # Component styles
├── certificate-preview/             # Certificate preview component
└── review-status/                    # Review status component
```

#### View Logic
Two different views based on user type:

**ADIO View** (`!isCBView`):
- Tab-based interface with 3 review stages (lines 28-585)
- Interactive forms with accept/return actions
- Status-based content rendering

**CB View** (`isCBView`):
- Accordion-based interface (lines 587-828)
- Read-only review content display
- Request resubmission functionality

#### Initial Review Tab States

**Pending State** (`initialReviewStatus === 'pending'`) - Lines 47-74:
- Interactive comment textarea
- Two action buttons: "Return For Re-Submission" & "Accept Submission"
- Form is fully editable

**Submitted State** (`initialReviewStatus === 'submitted'`) - Lines 76-110:
- Shows submission date (Aug 8, 2025)
- Interactive comment textarea
- Same action buttons as pending state
- Form remains editable

**Accepted State** (`initialReviewStatus === 'accepted'`) - Lines 112-135:
- Read-only view with submission and acceptance dates
- Displays entered comments in gray box
- Green success alert: "Submission has been accepted and approved"
- No action buttons (state is final)

**Returned State** (`initialReviewStatus === 'returned'`) - Lines 137-160:
- Shows submission and return dates
- Displays comments in read-only format
- Blue info alert: "Application has been returned to the Certifying body"
- No action buttons (awaiting resubmission)

**Rejected State** (`initialReviewStatus === 'rejected'`) - Lines 162-185:
- Shows submission and rejection dates
- Displays rejection comments
- Red error alert: "Submission has been rejected"
- No action buttons (final state)

### Implementation Files

#### Component Styling and Structure
- **SCSS File**: `src/app/pages/application-detail/stages/review/review-stage.component.scss`
  - Review form classes: .review-stage-container, .section-card (lines 1-35)
  - Tab navigation styling: .review-subtabs with hover effects (lines 5-13)
  - Action button styles: .action-buttons grid layout (lines 94-96)

#### State-Based Form Rendering
- **HTML Template**: `src/app/pages/application-detail/stages/review/review-stage.component.html`
  - Interactive states: Pending/Submitted forms (lines 47-110)
    - Comment textarea with focus:border-blue-500
    - Action buttons: Return/Accept with #845E2B brand color
  - Final states: Accepted/Returned/Rejected alerts (lines 112-185)
    - Green alert: bg-green-50 border-green-200 (lines 132-134)
    - Blue alert: bg-blue-50 border-blue-200 (lines 157-159)
    - Red alert: bg-red-50 border-red-200 (lines 182-184)

#### State Management Logic
- **TypeScript Component**: `src/app/pages/application-detail/stages/review/review-stage.component.ts`
  - Find initialReviewStatus property and state transitions
  - Action methods: returnInitialForReEvaluation(), acceptInitialEvaluation()
  - Status-based conditional rendering patterns

---

### Update 3.3: External Review Tab

#### Location
- **URL Route**: `/adio/applications/ESP010?stage=Review&step=0`
- **Application Stage**: Review (Status: External Review)

#### File Paths
Same as Update 3.2 - Uses the same review-stage.component files with different tab (`currentStep === 1`)

#### External Review Structure
Two accordion sections for external entity reviews (lines 191-468):

1. **TAQA Review** (lines 198-339)
2. **AD Ports Review** (lines 341-467)

#### TAQA Review Accordion States

**Submitted State** (`taqaStatus === 'submitted'`) - Lines 226-298:
- **Data Display** (lines 228-272):
  - Submission date: "Aug 10, 2025"
  - Premise ID: "PRM-2025-4315434" (with green checkmark)
  - Account Number: "ACC-789456123" (with green checkmark)
  - Connected Load: "2,500 kW" (with green checkmark)
  - Connectivity Type: "Medium Voltage (11kV)" (with green checkmark)
- **Interactive Elements**:
  - Comments textarea (lines 274-282)
  - Two action buttons (lines 284-298):
    - "Return for Re-submission" (`returnTaqaForReEvaluation()`)
    - "Accept Submission" (`acceptTaqaEvaluation()`)

**Accepted State** (`taqaStatus === 'accepted'`) - Lines 226-310:
- Same data display as submitted state
- **Additional Elements**:
  - Accepted date display (lines 233-236)
  - Read-only comments display (lines 301-306)
  - Green success alert: "TAQA submission has been accepted and approved" (lines 308-310)
- **No Action Buttons** - Form becomes read-only

**Returned State** (`taqaStatus === 'returned'`) - Lines 314-336:
- Shows submission and return dates (lines 315-324)
- Read-only comments display (lines 326-331)
- Blue info alert: "Application has been returned to TAQA for re-submission" (lines 333-335)
- **No Action Buttons** - Awaiting resubmission

#### AD Ports Review Accordion States

**Submitted State** (`adPortsStatus === 'submitted'`) - Lines 369-426:
- **Data Display** (lines 371-400):
  - Submission date: "Aug 12, 2025"
  - Gas Provider Info: "Emirates Gas LLC" (with green checkmark)
  - Gas Meter Numbers: List of 3 meters (GMT-001-789123, GMT-002-890234, GMT-003-901345)
- **Interactive Elements**:
  - Comments textarea (lines 402-410)
  - Two action buttons (lines 412-426):
    - "Return for Re-submission" (`returnAdPortsForReEvaluation()`)
    - "Accept Submission" (`acceptAdPortsEvaluation()`)

**Accepted State** (`adPortsStatus === 'accepted'`) - Lines 369-438:
- Same data display as submitted state
- **Additional Elements**:
  - Accepted date display (lines 376-379)
  - Read-only comments display (lines 429-434)
  - Green success alert: "AD Ports submission has been accepted and approved" (lines 436-438)
- **No Action Buttons** - Form becomes read-only

**Returned State** (`adPortsStatus === 'returned'`) - Lines 442-464:
- Shows submission and return dates (lines 443-452)
- Read-only comments display (lines 454-459)
- Blue info alert: "Application has been returned to AD Ports for re-submission" (lines 461-463)
- **No Action Buttons** - Awaiting resubmission

#### Accordion Interaction
- **Toggle Methods**: `toggleTaqaAccordion()` and `toggleAdPortsAccordion()`
- **Expansion States**: `taqaAccordionExpanded` and `adPortsAccordionExpanded`
- **Chevron Icons**: Dynamic up/down based on expansion state
- **Status Badges**: Dynamic color/text based on entity status

#### State-Based UI Behavior

**Interactive States** (submitted):
- Show all data fields with green checkmarks
- Editable comment textarea
- Two action buttons visible
- Form controls enabled

**Final States** (accepted, returned):
- Read-only data display
- Comments shown in gray boxes
- Color-coded status alerts (green for accepted, blue for returned)
- No action buttons
- Date stamps for state transitions

### Implementation Files

#### Accordion Component Structure
- **SCSS File**: `src/app/pages/application-detail/stages/review/review-stage.component.scss`
  - Accordion classes: .accordion-cards, .accordion-card (lines 49-74)
  - Header styling: .accordion-header with hover:bg-gray-50 (lines 56-73)
  - Content styling: .accordion-content with border-t (lines 76-77)

#### External Review Template Structure
- **HTML Template**: `src/app/pages/application-detail/stages/review/review-stage.component.html`
  - TAQA Review Accordion (lines 198-339)
    - Data validation checkmarks: bg-green-100 text-green-600 (lines 244, 252, etc.)
    - Submitted/Accepted/Returned states with conditional rendering
  - AD Ports Review Accordion (lines 341-467)
    - Gas meter list styling: .meter-list space-y-1 (lines 394-398)
    - Same state management pattern as TAQA

#### Accordion Interaction Logic
- **TypeScript Component**: `src/app/pages/application-detail/stages/review/review-stage.component.ts`
  - Find accordion expansion properties: taqaAccordionExpanded, adPortsAccordionExpanded
  - Toggle methods: toggleTaqaAccordion(), toggleAdPortsAccordion()
  - Entity-specific action methods: returnTaqaForReEvaluation(), acceptTaqaEvaluation()

#### Reusable Alert Patterns
- **HTML Template**: Same file as above
  - Success alerts: bg-green-50 border-green-200 (lines 308-310, 436-438)
  - Return alerts: bg-blue-50 border-blue-200 (lines 333-335, 461-463)
  - Action button grid: grid-cols-2 gap-3 with #845E2B brand styling

---

### Update 3.4: Final Review Tab

#### Location
- **URL Route**: `/adio/applications/ESP012?stage=Review&step=0`
- **Application Stage**: Review (Status: Final Review)

#### File Paths
Same as Update 3.2 - Uses the same review-stage.component files with different tab (`currentStep === 2`)

#### Final Review Structure
Two main sections for completion review and certificate issuance (lines 471-584):

1. **Review Completion Status Table** (lines 477-538)
2. **Certificate Issuance Section** (lines 540-583)

#### Review Completion Status Table

**Table Structure** (lines 478-537):
- **Header**: "Review Completion Status" (lines 479-481)
- **Columns**: Review Stage, Status, Completed Date (lines 487-490)
- **Data Rows** (lines 493-535):

  **Initial Review Row** (lines 493-506):
  - Stage: "Initial Review"
  - Status: Dynamic badge based on `initialReviewStatus`
  - Completed Date: "Aug 8, 2025"

  **TAQA Review Row** (lines 507-520):
  - Stage: "TAQA Review"
  - Status: Dynamic badge based on `taqaStatus`
  - Completed Date: "Aug 10, 2025"

  **AD Ports Review Row** (lines 521-534):
  - Stage: "AD Ports Review"
  - Status: Dynamic badge based on `adPortsStatus`
  - Completed Date: "Aug 12, 2025"

#### Certificate Issuance Section

**Section Header** (lines 542-545):
- Title: "Certificate Issuance"
- Description: "Select the certificate issue date to generate the official certificate"

**Date Selection Form** (lines 547-564):
- **Certificate Issue Date** (lines 548-554):
  - Date input field
  - Two-way binding: `[(ngModel)]="certificateIssueDate"`
  - Manual selection required

- **Certificate Expiry Date** (lines 555-563):
  - Read-only calculated field
  - Value: `getCertificateExpiryDate()` method
  - Auto-calculated: 1 year from issue date
  - Gray background indicating read-only state

**Action Buttons** (lines 566-582):
- **Preview Certificate** (lines 567-572):
  - White button with border
  - Eye icon + "Preview Certificate" text
  - Method: `previewCertificate()`
  - Always enabled

- **Issue Certificate** (lines 574-581):
  - Primary brown button (`#845E2B`)
  - Award icon + "Issue Certificate" text
  - Method: `proceedToCertification()`
  - **Disabled state**: `[disabled]="!certificateIssueDate"`
  - Requires issue date to be selected

#### Key Features

**Review Summary**:
- Consolidated status view of all review stages
- Dynamic status badges reflect current state
- Historical completion dates for tracking
- Responsive table layout

**Certificate Management**:
- Manual issue date selection
- Automatic expiry calculation (1 year)
- Preview functionality before issuance
- Validation: Issue button disabled until date selected
- Visual feedback for disabled state (opacity + cursor)

**UI States**:
- **Initial State**: Issue button disabled, no date selected
- **Date Selected**: Issue button enabled, expiry auto-calculated
- **Preview Available**: Can preview before final issuance

#### Action Methods
- `previewCertificate()` - Opens certificate preview modal/dialog
- `proceedToCertification()` - Initiates final certificate issuance
- `getCertificateExpiryDate()` - Calculates expiry date (issue date + 1 year)

#### Validation Rules
- Issue date must be selected before certificate can be issued
- Expiry date automatically calculated (no manual input)
- All review stages should be completed before reaching this tab

---

*Add additional sections below as needed*