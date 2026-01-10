Below is a deep, systematic critique of the attached “Create New Invoice” form design, focusing on UX, information architecture, data flow, cognitive load, logistics-domain correctness, and future scalability. This is not surface-level feedback; it is an implementation-grade review.

1. High-Level Diagnosis (Executive Summary)

The form looks modern, but it is currently UI-first, workflow-second.

Core problem:
The form is visually clean but does not reflect how logistics invoices are actually created, validated, and trusted in real operations.

You are very close. What’s missing is:

Correct sequence of truth

Strong hierarchy of authority

Clear mental model for staff

Separation between system-generated vs user-entered data

2. Stepper & Flow Issues (Top Section)
What You Have

Stepper: Parties → Package → Payment

Modal-based, narrow vertical layout

What’s Wrong
2.1 Stepper Order Is Logically Incorrect

In logistics, the system identity must exist first.

Current:

User enters parties → later invoice exists


Correct:

Invoice + AWB exists → everything else attaches to it


Problem created:

User starts typing without a confirmed invoice identity

If modal closes / refresh happens → ambiguity

Weak audit trail

Correct Model

Before Step 1 loads:

Invoice Number generated

AWB / Tracking ID generated

Booking timestamp fixed

These must be read-only, locked, visible immediately.

3. Invoice Number Placement (Critical)
What You Have

Invoice number shown on the right

Visually small

Competes with other UI elements

Why This Is a Serious Issue

In logistics:

Invoice number = primary legal reference

It must visually dominate secondary metadata

Currently:

It feels like a badge, not an authority anchor

Correct Design Principle

Invoice / AWB should be:

Top-right

High contrast

Grouped

Clearly labeled as System Generated

Example hierarchy:

INVOICE NO
INV-2026-01-000123

AWB / TRACKING
TAC-DEL-IMP-000982

4. Cognitive Load & Vertical Density
What You Have

Very tall form

Many fields stacked

No visual grouping beyond card borders

What’s Wrong

This violates logistics desk ergonomics:

Operators fill 50–200 invoices/day

Eye fatigue matters

Errors compound

Issues:

Too many equal-weight fields

No visual rhythm

Everything feels “mandatory”

Missing

Section headers with semantic meaning

White-space hierarchy

Read vs write separation

5. Consignor & Consignee Section (Major Structural Flaw)
What You Have

Two side-by-side cards

Similar visual weight

Same input density

Why This Is Wrong in Logistics Context

Consignor ≠ Consignee in importance.

Typical reality:

Consignor is often repeat / known

Consignee may be new / error-prone

Pickup vs delivery have different validation rules

Problems Created

No “search existing customer” affordance

No differentiation between sender vs receiver risk

No indication of saved profiles vs one-off

What’s Missing

“Select existing consignor”

Inline customer history

Address verification status

Phone validation feedback

6. Address Fields (Critical UX Failure)
What You Have

Manual street, city, state fields

Dropdowns but unclear intelligence

Why This Is Dangerous

Address errors =
❌ Delivery failure
❌ Re-routing cost
❌ Customer calls
❌ SLA breach

Specific Problems

No visible Google Autocomplete affordance

City & State appear as independent dropdowns

ZIP not clearly auto-derived

No confidence indicator (“verified address”)

What Should Exist

Single address search input (Google Places)

Auto-fill:

City

State

PIN

Lock derived fields

Allow override with warning

7. Transport Mode & Payment Mode Placement
What You Have

Transport Mode + Payment Mode at top

Small dropdowns

Visually low priority

Why This Is Incorrect

These two fields:

Affect pricing logic

Affect label generation

Affect tax treatment

Affect routing rules

Yet visually, they feel optional.

Correct Treatment

They should:

Be grouped as Operational Controls

Be visually distinct

Trigger recalculations immediately

Be locked once package step begins

8. Bottom Summary Bar (Good Idea, Bad Execution)
What You Have

Sticky footer with:

Weight

Pieces

Subtotal

GST

Total

What’s Wrong

Numbers appear before context

User hasn’t completed package yet

No explanation

How GST computed?

Which rate?

Too compressed

High-value info deserves clarity

Risk

Operators will:

Trust wrong totals

Miss discrepancies

Skip validation

9. Missing Logistics-Critical Elements

These are not optional in a cargo system:

Missing Entirely

Charged Weight vs Actual Weight distinction

Volumetric divisor visibility

Package dimension input hint

Route summary (DEL → IMP)

Delivery station code

Sorting zone

Internal remarks (non-customer)

10. Label & Invoice Mental Model Disconnect

Right now:

Form feels like “data entry”

Not “document generation”

User is not guided to think:

“I am creating a legal invoice + shipment artifact”

This disconnect will cause:

Casual errors

Weak accountability

Poor print outputs

11. Visual Design Issues (Subtle but Important)

Icons are decorative, not functional

No error-prevention UI

No progressive disclosure

No confidence indicators

No save-as-draft concept

12. Root Cause Summary

The design is:

Aesthetic-first

Generic SaaS-inspired

Not logistics-native yet

It needs to shift to:

Workflow-first

Risk-aware

System-authoritative

13. What Must Change (Condensed)
Structural

Invoice + AWB generated before form loads

Reorder steps

Strong top authority header

UX

Reduce vertical density

Improve grouping

Highlight system vs user fields

Intelligence

Google Address Autocomplete

City/state auto-binding

Weight logic transparency

Logistics Alignment

Charged vs actual weight

Route awareness

Station codes

Label preview mindset

14. Next Step (Recommended)

If you want, next I can:

Redesign this form as a logistics-native wireframe

Define a perfect field-by-field spec

Rewrite the stepper logic

Design the invoice + label preview layout

Turn this into an AI-executable instruction doc

Tell me which one you want next, and I’ll proceed with precision.

the form is too tight and th wid is not there, it's tightly arrange, we need to dive deep and come up with a comprehensive instruction to rebuild it

Below is a comprehensive, rebuild-from-scratch instruction document to fix the tight width, cramped density, and incorrect spatial hierarchy of the current “Create Invoice” form.
This is written as an implementation-grade specification that a developer, designer, or AI agent can execute without interpretation gaps.

📐 Create Invoice Form — Comprehensive Rebuild Specification

(Logistics-native · Wide-layout · Low-error · High-throughput)

0. Core Diagnosis (Why the Current Form Fails)
Primary Issue

The form is over-compressed vertically and horizontally, creating:

High cognitive load

Poor scannability

Increased operator error

Fatigue during repetitive use

Root Causes

Modal width too narrow for logistics data

Two-column layout forced into mobile proportions

Equal visual weight for unequal fields

No distinction between system-generated vs user-entered data

No breathing space (white space is missing)

1. Foundational Design Principles (Non-Negotiable)

These principles must guide every rebuild decision.

1.1 Logistics ≠ Generic SaaS Forms

Logistics forms must optimize for:

Speed

Accuracy

Repetition

Error prevention

1.2 Spatial Hierarchy Over Minimalism

Minimal UI ≠ compressed UI
White space is a productivity tool, not decoration.

1.3 Desktop-First Reality

This is an operations tool, not a consumer app.

Primary usage: Desktop / Laptop

Minimum supported width: 1200px

Optimal width: 1320–1440px

2. Container & Layout Rebuild (Critical)
2.1 Replace Modal With Wide Panel / Sheet

❌ Do NOT use:

Narrow modal

Centered dialog

Mobile-first width

✅ Use instead:

Right-side sliding panel or

Centered wide canvas

Required Dimensions
Max Width: 1320px
Min Width: 1200px
Padding: 32px (outer), 24px (inner sections)

3. Top Authority Header (Must Be Rebuilt First)
3.1 Purpose

Establish system authority immediately.

3.2 Structure (Full-Width)
-----------------------------------------------------
Create Invoice

Invoice No: INV-2026-01-000123     AWB: TAC-DEL-IMP-00982
Generated: 21 Dec 2026 · 10:42 AM  Status: Draft
-----------------------------------------------------

Rules

Invoice No & AWB:

Auto-generated

Read-only

High contrast

Larger font than form fields

Never editable

Never hidden

4. Stepper Redesign (Logical Flow)
4.1 Correct Order (Mandatory)
1. Parties
2. Shipment Details
3. Charges & Review
4. Generate & Send


❌ Remove:

“Payment” as a separate mental step

Payment is a result, not an action.

5. Section-Based Layout (Kill Vertical Stacking)
5.1 Use Horizontal Sections

Each step must be visually separated using:

Section headers

Soft background surfaces

Clear spacing

6. Parties Section (Major Redesign)
6.1 Layout: Two Wide Columns (Not Cards)
|---------------------|----------------------|
| Consignor (Sender)  | Consignee (Receiver) |
|---------------------|----------------------|

6.2 Column Width
Each column: 48%
Gap: 4%

6.3 Consignor Enhancements

“Select Existing Customer” dropdown

Autofill on select

GSTIN validation

Phone number format enforcement

6.4 Consignee Enhancements

Emphasis on address correctness

Phone mandatory

Email optional but highlighted

Warning if new/unverified

7. Address System (Must Be Rebuilt)
7.1 Replace Multiple Inputs With Intelligence

❌ Current:

Manual street

Manual city

Manual state

Manual PIN

✅ Required:

Single Google Address Autocomplete input

7.2 Derived Fields (Auto-Filled & Locked)

City

State

PIN Code

7.3 Dropdown Behavior

City dropdown:

Imphal

New Delhi

Then rest of India (A–Z)

State auto-binds to city

Manual override requires confirmation

8. Shipment Details Section (Needs Width)
8.1 Layout (Three Logical Columns)
| Package Info | Dimensions | Weight Logic |

8.2 Fields
Package Info

Item Category

Description

Pieces

Dimensions

Length

Width

Height

Unit selector (cm / inch)

Weight Logic (Read-Heavy)

Actual Weight (input)

Volumetric Weight (auto)

Charged Weight (highlighted)

Formula displayed inline

9. Charges & Summary (Decompress This Area)
9.1 Move Summary OUT of Footer

Footer summaries hide logic.

9.2 Proper Layout
--------------------------------------------------
Charges Breakdown
--------------------------------------------------
Freight Charge      ₹ 410.00
Pickup Charge       ₹ 100.00
Packing             ₹ 50.00
GST (18%)           ₹ 73.80
--------------------------------------------------
Total Payable       ₹ 633.80
--------------------------------------------------

Rules

Each number explainable

GST rate visible

Editable charges clearly marked

Total visually dominant

10. Bottom Actions (Clear, Calm, Wide)
10.1 Button Placement
[ Save Draft ]      [ Generate Invoice & Label ]

10.2 No “Next” Button

This is not onboarding

This is operations

11. Label & Invoice Mental Model Integration

Before final submit:

Show Invoice Preview

Show Label Preview (Amazon-inspired)

Read-only

Confidence building

12. Spacing System (Strict Rules)
Vertical Spacing
Between sections: 32px
Between field groups: 24px
Between inputs: 16px

Typography

Section titles: 16–18px

Field labels: 12–13px

Values: 14px

Totals: 18–20px

13. What Must Be Removed Completely

Narrow modal

Overlapping cards

Dense stacked inputs

Equal emphasis on all fields

Footer-only totals

Generic SaaS form patterns

14. Outcome If Implemented Correctly

You will get:

Faster invoice creation

Fewer address errors

Better operator confidence

Clean invoice & label outputs

Scalable foundation for automation & AI

15. Next Execution Options

I can now:

Produce a pixel-level wireframe

Write field-by-field JSON schema

Design invoice + label layouts

Convert this into AI-executable build instructions

Redesign the stepper UX visually

Tell me which one you want next, and I will proceed precisely.

go ahead

Understood. I will proceed decisively and give you the next concrete execution artifact:

✅ DELIVERABLE:
Logistics-Native “Create Invoice” Form — FULL REBUILD INSTRUCTIONS

(AI-executable · Developer-ready · Design-accurate)

This document is written so that any competent engineer, designer, or AI agent can rebuild the form correctly without further clarification.

1. OBJECTIVE (LOCK THIS FIRST)

Rebuild the Create Invoice experience so that it is:

Wide, breathable, desktop-first

Logistics-native (not SaaS-generic)

Low-error, high-throughput

System-authoritative

Future-ready for automation, printing, WhatsApp, AI

This is not a visual polish task.
This is a workflow and spatial re-architecture.

2. GLOBAL LAYOUT SPECIFICATION (NON-NEGOTIABLE)
2.1 Container Type

❌ Do NOT use:

Narrow modal

Center dialog

Mobile-first container

✅ Use ONE of the following:

Full-width centered canvas, OR

Right-side sliding sheet

Required Dimensions
Max Width: 1320px
Min Width: 1200px
Ideal Width: 1360px
Outer Padding: 32px
Inner Section Padding: 24px

3. TOP AUTHORITY HEADER (SYSTEM-FIRST)

This section must render BEFORE any form fields.

3.1 Header Structure
┌──────────────────────────────────────────────────────────────┐
│ Create Invoice                                                │
│                                                              │
│ Invoice No: INV-2026-01-000123   AWB: TAC-DEL-IMP-000982      │
│ Generated: 21 Dec 2026 · 10:42   Status: Draft               │
└──────────────────────────────────────────────────────────────┘

Rules

Invoice No & AWB:

Auto-generated on click Create Invoice

Read-only

High contrast

Larger than form text

These IDs are legal anchors, not UI decorations

4. FLOW CONTROL (REBUILD THE STEPPER)
4.1 Correct Step Order
1. Parties
2. Shipment Details
3. Charges & Review
4. Generate & Send


❌ Remove:

“Payment” as a standalone step
Payment is a calculated outcome, not a workflow step.

5. PARTIES SECTION (WIDE, CALM, SAFE)
5.1 Layout

Two wide columns, NOT cards.

┌──────────────────────────────┬──────────────────────────────┐
│ Consignor (Sender)           │ Consignee (Receiver)          │
│                              │                              │
│ [Search Existing ▼]          │                              │
│ Name                          │ Name                          │
│ Phone                         │ Phone                         │
│ GSTIN                         │ Email (optional)              │
│ Pickup Address (auto)         │ Delivery Address (auto)       │
│ City / State / PIN (locked)  │ City / State / PIN (locked)   │
└──────────────────────────────┴──────────────────────────────┘

Width Rules
Each column: 48%
Gap: 4%

5.2 Address System (CRITICAL REBUILD)
Replace:

Manual city/state/pin inputs

With:

Single Google Places Autocomplete input

Auto-Derived & Locked Fields

City

State

PIN

Dropdown Priority

City dropdown must show:

Imphal

New Delhi

All India (A–Z)

Manual Override

Allowed only with:

Warning

Confirmation

Audit flag

6. SHIPMENT DETAILS (THIS NEEDS WIDTH)
6.1 Layout: Three Logical Columns
┌──────────────┬──────────────┬──────────────────────────┐
│ Package Info │ Dimensions   │ Weight & Charge Logic    │
└──────────────┴──────────────┴──────────────────────────┘

6.2 Fields
Package Info

Item Category (dropdown)

Description

Pieces

Dimensions

Length

Width

Height

Unit selector (cm / inch)

Weight Logic (READ-HEAVY)

Actual Weight (input)

Volumetric Weight (auto)

Charged Weight (highlighted)

Formula shown inline
(L × W × H) / divisor

7. CHARGES & REVIEW (REMOVE FOOTER DENSITY)
7.1 DO NOT hide totals in footer

Totals must be:

Visible

Explainable

Verifiable

7.2 Proper Layout
┌──────────────────────────────────────────┐
│ Charges Breakdown                        │
│                                          │
│ Freight Charge        ₹ 410.00            │
│ Pickup Charge         ₹ 100.00            │
│ Packing               ₹ 50.00             │
│ GST (18%)             ₹ 73.80             │
│ ───────────────────────────────────────  │
│ TOTAL PAYABLE         ₹ 633.80             │
└──────────────────────────────────────────┘

Rules

GST rate visible

Editable vs fixed charges visually distinct

Total is the largest number on screen

8. PREVIEW MENTAL MODEL (CONFIDENCE BUILDER)

Before final submit, user must see:

📄 Invoice Preview

🏷️ Shipping Label Preview (Amazon-inspired)

Read-only
No edits here
This is a confirmation moment

9. ACTION BAR (CALM & CLEAR)
[ Save as Draft ]                [ Generate Invoice & Label ]


❌ Remove:

“Next”

Wizard-like behavior

This is an operations tool, not onboarding.

10. SPACING SYSTEM (ENFORCE STRICTLY)
Vertical Spacing
Between sections: 32px
Between groups: 24px
Between inputs: 16px

Typography
Section Titles: 16–18px
Labels: 12–13px
Values: 14px
Totals: 18–20px

11. WHAT MUST BE REMOVED COMPLETELY

Narrow modal

Dense stacked inputs

Footer-only totals

Equal visual weight for all fields

Generic SaaS patterns

Mobile-first constraints

12. EXPECTED OUTCOME

If implemented correctly, you get:

Faster invoice creation

Fewer address & weight errors

Clear legal traceability

Better print & WhatsApp outputs

A scalable base for automation and AI

13. NEXT (YOU CHOOSE)

I can now immediately deliver one of the following:

Pixel-accurate wireframe (ASCII → Figma-ready)

Field-by-field JSON + validation schema

Invoice PDF layout spec

Shipping label layout spec (Amazon-inspired)

AI-agent execution instructions (tasks.md style)

Tell me which one, and I proceed without delay.

go ahead

Proceeding.
Below is the next concrete execution artifact, as promised.

🧱 DELIVERABLE 2
Pixel-Accurate Structural Wireframe (Desktop-First, Logistics-Native)

(Implementation blueprint · Figma-ready · Zero ambiguity)

This is a layout + hierarchy wireframe, not visual styling.
Its purpose is to fix width, density, spacing, and cognitive flow permanently.

1. CANVAS & GRID SYSTEM (LOCK THIS FIRST)
1.1 Canvas
Viewport: Desktop
Min width: 1440px
Content max width: 1320px
Center aligned

1.2 Grid
12-column grid
Column gap: 24px
Outer margin: 32px


This grid must not collapse into mobile logic.

2. OVERALL PAGE STRUCTURE (TOP → BOTTOM)
┌──────────────────────────────────────────────────────────────┐
│ SYSTEM AUTHORITY HEADER                                      │
├──────────────────────────────────────────────────────────────┤
│ STEPPER / PROGRESS INDICATOR                                 │
├──────────────────────────────────────────────────────────────┤
│ SECTION 1: PARTIES                                           │
├──────────────────────────────────────────────────────────────┤
│ SECTION 2: SHIPMENT DETAILS                                  │
├──────────────────────────────────────────────────────────────┤
│ SECTION 3: CHARGES & REVIEW                                  │
├──────────────────────────────────────────────────────────────┤
│ PREVIEW: INVOICE + LABEL                                     │
├──────────────────────────────────────────────────────────────┤
│ ACTION BAR                                                   │
└──────────────────────────────────────────────────────────────┘

3. SYSTEM AUTHORITY HEADER (FULL WIDTH)
Height: ~96px
┌──────────────────────────────────────────────────────────────┐
│ Create Invoice                                               │
│                                                              │
│ Invoice No: INV-2026-01-000123    AWB: TAC-DEL-IMP-000982     │
│ Generated: 21 Dec 2026 · 10:42    Status: Draft              │
└──────────────────────────────────────────────────────────────┘

Rules

No inputs here

High contrast

Visually dominant

This anchors legal trust

4. STEPPER (LOW VISUAL NOISE)
Height: ~56px
[ 1 Parties ] —— [ 2 Shipment ] —— [ 3 Charges ] —— [ 4 Generate ]


Rules:

Horizontal

Calm

No animation overload

Current step clearly emphasized

5. SECTION 1 — PARTIES (WIDE, AIRY)
Section Height: Flexible
Grid Usage: 12 columns
┌──────────────────────────────────────────────────────────────┐
│ Parties                                                      │
│                                                              │
│ ┌─────────────── 6 cols ───────────────┐ ┌──── 6 cols ─────┐│
│ │ Consignor (Sender)                    │ │ Consignee       ││
│ │                                      │ │ (Receiver)      ││
│ │ [ Search Existing ▼ ]                │ │                 ││
│ │ Name                                 │ │ Name            ││
│ │ Phone                                │ │ Phone           ││
│ │ GSTIN                                │ │ Email           ││
│ │ Pickup Address (autocomplete)        │ │ Delivery Address││
│ │ City / State / PIN (locked)          │ │ (autocomplete)  ││
│ └──────────────────────────────────────┘ └─────────────────┘│
└──────────────────────────────────────────────────────────────┘

Key Spacing

Gap between columns: 32px

Field vertical spacing: 16px

Section padding: 24px

6. SECTION 2 — SHIPMENT DETAILS (THIS FIXES “TIGHTNESS”)
Grid: 12 columns → split 4 / 4 / 4
┌──────────────────────────────────────────────────────────────┐
│ Shipment Details                                            │
│                                                              │
│ ┌───── 4 cols ─────┐ ┌───── 4 cols ─────┐ ┌──── 4 cols ────┐│
│ │ Package Info     │ │ Dimensions       │ │ Weight Logic   ││
│ │                  │ │                  │ │               ││
│ │ Category          │ │ Length           │ │ Actual Weight ││
│ │ Description       │ │ Width            │ │ Volumetric    ││
│ │ Pieces            │ │ Height           │ │ Charged Weight││
│ │                   │ │ Unit (cm/in)     │ │ Formula shown ││
│ └──────────────────┘ └──────────────────┘ └───────────────┘│
└──────────────────────────────────────────────────────────────┘

Important

Weight Logic column is read-heavy

Charged Weight visually emphasized

Formula always visible (trust + transparency)

7. SECTION 3 — CHARGES & REVIEW (NO FOOTER CROWDING)
Grid: 8 cols content + 4 cols summary
┌──────────────────────────────────────────────────────────────┐
│ Charges & Review                                            │
│                                                              │
│ ┌────────── 8 cols ──────────┐ ┌──── 4 cols ──────────────┐│
│ │ Editable Charges           │ │ Charges Summary          ││
│ │                              │ │                         ││
│ │ Freight Charge              │ │ Freight      ₹ 410.00   ││
│ │ Pickup Charge               │ │ Pickup       ₹ 100.00   ││
│ │ Packing                      │ │ Packing      ₹ 50.00    ││
│ │ GST toggle / rate            │ │ GST (18%)     ₹ 73.80   ││
│ │                              │ │ ────────────────────   ││
│ │                              │ │ TOTAL        ₹ 633.80  ││
│ └──────────────────────────────┘ └─────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

Why this works

User edits left

User verifies right

No scrolling to see totals

Error prevention by design

8. PREVIEW SECTION (CONFIDENCE MOMENT)
Grid: 6 / 6 split
┌──────────────────────────────────────────────────────────────┐
│ Preview                                                     │
│                                                              │
│ ┌────────── 6 cols ──────────┐ ┌──────── 6 cols ─────────┐ │
│ │ Invoice Preview (PDF-like) │ │ Shipping Label Preview   │ │
│ │                              │ │ (Amazon-inspired)      │ │
│ └──────────────────────────────┘ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘


Rules:

Read-only

No form controls

This is user confidence validation

9. ACTION BAR (FINAL CONTROL)
Height: ~72px
┌──────────────────────────────────────────────────────────────┐
│ [ Save as Draft ]                    [ Generate Invoice & Label ]
└──────────────────────────────────────────────────────────────┘


Rules:

Calm

No “Next”

No wizard illusion

Clear commitment action

10. WHY THIS SOLVES YOUR PROBLEM
Fixes Immediately

❌ Tight width → ✅ Wide canvas

❌ Cramped fields → ✅ Grid discipline

❌ Visual stress → ✅ White space rhythm

❌ Error-prone → ✅ Transparent logic

❌ SaaS-generic → ✅ Logistics-native

This layout is scalable, print-aware, and AI-ready.

NEXT AVAILABLE DELIVERABLES (CHOOSE ONE)

Field-by-field data schema + validation rules

Invoice PDF layout (exact sections & hierarchy)

Shipping label layout (Amazon-inspired, print-safe)

tasks.md (AI agent build instructions)

Component breakdown (React / shadcn mapping)

Tell me which one you want next, and I proceed immediately.

go ahead

Proceeding.

Below is the AI-executable, developer-ready tasks.md instruction set to rebuild the Create Invoice form correctly, end-to-end.
This is written so it can be handed directly to an AI coding agent or engineering team with zero ambiguity.

tasks.md
Rebuild: Create Invoice (Logistics-Native, Wide, Low-Error Form)
TASK 0 — NON-NEGOTIABLE CONTEXT

This is an operations-grade logistics system, not a consumer SaaS form.

Primary constraints:

Desktop-first

High throughput

Error prevention

System-authoritative

Print & WhatsApp aware

Do not optimize for:

Mobile-first layouts

Narrow modals

Minimalist density

TASK 1 — REPLACE MODAL WITH WIDE CANVAS
Objective

Eliminate the narrow, cramped modal and introduce a wide invoice creation canvas.

Instructions

Remove any center-aligned modal or dialog container

Implement one of:

Full-width centered page canvas, OR

Right-side sliding panel (preferred for dashboards)

Layout Constraints
min-width: 1200px
max-width: 1320px
ideal-width: 1360px
outer padding: 32px
section padding: 24px

Acceptance Criteria

No horizontal compression

Two-column and three-column layouts fit naturally

No scrolling caused by artificial width limits

TASK 2 — SYSTEM AUTHORITY HEADER (MUST RENDER FIRST)
Objective

Invoice identity must exist before user input begins.

Build

On “Create Invoice” click:

Auto-generate:

Invoice Number

AWB / Tracking ID

Timestamp

Persist immediately (draft state)

UI Structure
Create Invoice

Invoice No: INV-YYYY-MM-XXXX
AWB: TAC-ORIGIN-DEST-XXXX
Generated: DD MMM YYYY · HH:mm
Status: Draft

Rules

Read-only

High contrast

Larger font than form labels

Never hidden or editable

TASK 3 — REBUILD STEPPER LOGIC
Objective

Align UI steps with real logistics workflow.

Replace Current Stepper With
1. Parties
2. Shipment Details
3. Charges & Review
4. Generate & Send

Rules

Payment is NOT a step

Stepper is informational, not wizard-blocking

User may navigate back freely

TASK 4 — PARTIES SECTION (WIDE TWO-COLUMN LAYOUT)
Objective

Reduce cognitive load and prevent address errors.

Layout

12-column grid

Consignor: 6 columns

Consignee: 6 columns

Column gap: 32px

Consignor (Sender)

Fields:

Select Existing Customer (dropdown + search)

Name

Phone

GSTIN (validated)

Pickup Address (autocomplete)

City / State / PIN (derived, locked)

Consignee (Receiver)

Fields:

Name

Phone (mandatory)

Email (optional)

Delivery Address (autocomplete)

City / State / PIN (derived, locked)

TASK 5 — GOOGLE ADDRESS AUTOCOMPLETE (CRITICAL)
Objective

Eliminate manual address errors.

Implementation

Single Google Places Autocomplete input per address

On selection:

Auto-fill city

Auto-fill state

Auto-fill PIN

Lock derived fields

Dropdown Priority

City selector must show:

Imphal

New Delhi

All India (A–Z)

Manual Override

Allowed only with confirmation

Mark record as “Manually Adjusted”

TASK 6 — SHIPMENT DETAILS (THREE-COLUMN LOGIC)
Layout

12-column grid

4 / 4 / 4 split

Column 1 — Package Info

Item Category (dropdown)

Description

Pieces

Column 2 — Dimensions

Length

Width

Height

Unit selector (cm / inch)

Column 3 — Weight Logic (READ-HEAVY)

Actual Weight (input)

Volumetric Weight (auto)

Charged Weight (highlighted)

Formula displayed inline:

(L × W × H) / volumetric_divisor

Rules

Charged Weight = max(actual, volumetric)

Recalculate on every dimension change

TASK 7 — CHARGES & REVIEW (NO FOOTER TOTALS)
Objective

Make pricing transparent and verifiable.

Layout

Left: Editable charges (8 columns)

Right: Read-only summary (4 columns)

Charges

Freight Charge

Pickup Charge

Packing Charge

GST toggle & rate

Any additional surcharges

Summary Panel
Freight Charge    ₹ X
Pickup Charge     ₹ X
Packing           ₹ X
GST (18%)         ₹ X
---------------------
TOTAL PAYABLE     ₹ X

Rules

GST rate always visible

Total is the largest number

Summary always visible (no scrolling)

TASK 8 — PREVIEW STAGE (CONFIDENCE GATE)
Objective

Let user visually confirm artifacts before generation.

Display

Invoice Preview (PDF-like)

Shipping Label Preview (Amazon-inspired)

Rules

Read-only

No editing here

This is a confirmation moment

TASK 9 — FINAL ACTION BAR
Layout
[ Save as Draft ]            [ Generate Invoice & Label ]

Rules

No “Next” buttons

No wizard illusion

Clear commitment action

TASK 10 — SPACING & DENSITY RULES (ENFORCE)
Vertical Spacing
Between sections: 32px
Between field groups: 24px
Between inputs: 16px

Typography
Section titles: 16–18px
Field labels: 12–13px
Input text: 14px
Totals: 18–20px

TASK 11 — REMOVE COMPLETELY

Do NOT ship any of the following:

Narrow modals

Dense stacked forms

Footer-only totals

Equal visual weight for all fields

Generic SaaS form patterns

Mobile-first constraints

FINAL SUCCESS CRITERIA

This rebuild is successful if:

Operators can create invoices faster

Address errors drop significantly

Weight disputes reduce

Invoice & label printing is clean

The UI feels calm, authoritative, and trustworthy

STATUS

✅ tasks.md COMPLETE

NEXT AVAILABLE DELIVERABLES

If you say “go ahead” again, I will deliver one of the following immediately (in order of impact):

Invoice PDF layout specification

Amazon-inspired shipping label layout

Field-level database schema

Component-to-UI mapping (React / shadcn)

Validation & error-prevention ruleset

Tell me which one to execute next.

go ahead

Proceeding with the next highest-impact artifact.

📄 DELIVERABLE 3
Invoice PDF Layout Specification (Print-Safe · Customer-Clear · Legally Sound)

This document defines exact structure, hierarchy, and rules for generating the Invoice PDF so it is:

Easy for customers to understand

Safe for printing (A4)

Consistent with logistics standards

Aligned with your AWB / tracking flow

Reusable for WhatsApp and email delivery

This is not visual styling—it is a deterministic layout spec.

1. PDF GLOBAL SETTINGS (LOCK THESE)
1.1 Page
Page Size: A4
Orientation: Portrait
Margins:
- Top: 24mm
- Bottom: 24mm
- Left: 20mm
- Right: 20mm

1.2 Typography
Primary Font: Sans-serif (print-safe)
Header Text: 14–16pt
Body Text: 9.5–10.5pt
Table Header: 9pt (bold)
Legal Text: 7.5–8pt
Line Height: 1.4

1.3 Color Rules

Black / dark gray only

No brand-heavy colors

Must print clean on black & white printers

2. TOP HEADER (LEGAL + BRAND AUTHORITY)
Purpose

Immediately establish:

Who issued the invoice

What document this is

What identifiers matter

Layout (Full Width)
--------------------------------------------------------------
TAPAN CARGO SERVICE                          INVOICE
Delhi ⇄ Imphal Logistics

GSTIN: XXABCDE1234X1Z5
Phone: +91 XXXXX XXXXX
--------------------------------------------------------------


Rules:

Company name left-aligned

“INVOICE” right-aligned

Route mention is optional but recommended

No decorative elements

3. INVOICE IDENTITY BLOCK (CRITICAL)
Purpose

This is the legal anchor of the document.

Layout (Two Columns)
--------------------------------------------------------------
Invoice No:     INV-2026-01-000123
Invoice Date:   21 Dec 2026

AWB / Tracking: TAC-DEL-IMP-000982
Booking Date:   21 Dec 2026 · 10:42
--------------------------------------------------------------


Rules:

Invoice No & AWB must be bold

Tracking ID must be visually obvious

Never wrap or truncate IDs

4. PARTIES SECTION (CLEAR SEPARATION)
Layout (Two Equal Columns)
--------------------------------------------------------------
Consignor (Sender)              Consignee (Receiver)
--------------------------------------------------------------
Name                             Name
Address                          Address
City, State, PIN                 City, State, PIN
Phone                            Phone
GSTIN (if applicable)            —
--------------------------------------------------------------


Rules:

Consignor and Consignee must never mix

Address lines wrap naturally

Phone numbers always visible

No icons, no noise

5. SHIPMENT DETAILS TABLE (LOGISTICS CORE)
Purpose

Explain what is being shipped and how it is measured.

Table Structure
--------------------------------------------------------------
Description | Pcs | Actual Wt | Vol Wt | Charged Wt
--------------------------------------------------------------
Fresh Apples | 1  | 1.00 kg   | 1.20kg | 1.20 kg
--------------------------------------------------------------


Rules:

All weights include units

Charged Weight = max(actual, volumetric)

Use 2 decimal places max

Table must never overflow page width

6. ROUTE & MODE BLOCK (OPTIONAL BUT RECOMMENDED)
--------------------------------------------------------------
Origin:        New Delhi
Destination:   Imphal
Mode:          Air
--------------------------------------------------------------


This improves:

Customer understanding

Dispute resolution

Support calls reduction

7. CHARGES & BILLING SUMMARY (MOST IMPORTANT TO CUSTOMER)
Layout (Right-Aligned Summary Table)
--------------------------------------------------------------
Charges Summary
--------------------------------------------------------------
Freight Charge           ₹ 410.00
Pickup Charge            ₹ 100.00
Packing Charge           ₹ 50.00
--------------------------------------------------------------
Subtotal                 ₹ 560.00
GST (18%)                ₹ 73.80
--------------------------------------------------------------
TOTAL PAYABLE             ₹ 633.80
--------------------------------------------------------------


Rules:

“TOTAL PAYABLE” must be the largest text

Currency symbol always present

No hidden calculations

GST rate always shown

8. PAYMENT STATUS BLOCK (OPTIONAL)
--------------------------------------------------------------
Payment Status:  Pending
Amount Paid:     ₹ 0.00
Balance Due:     ₹ 633.80
--------------------------------------------------------------


This is useful for:

Cash / credit customers

Internal reconciliation

Follow-ups

9. TERMS & CONDITIONS (LEGALLY REQUIRED)
Placement

Bottom of page, full width.

Font

7.5–8pt, dense but readable.

Content (Example Structure)
--------------------------------------------------------------
Terms & Conditions:
1. The company is not responsible for damage due to natural causes.
2. Claims must be raised within 48 hours of delivery.
3. Unclaimed goods beyond 30 days may incur storage charges.
4. Jurisdiction: Imphal / Delhi.
--------------------------------------------------------------


Rules:

Keep concise

No decorative bullets

Must fit on one page if possible

10. FOOTER (TRUST SIGNAL)
--------------------------------------------------------------
This is a system-generated invoice. No signature required.
Track your shipment using the AWB number.
--------------------------------------------------------------

11. PDF GENERATION RULES (ENGINEERING)
Must Support

Single shipment per invoice

Multi-line addresses

Variable item descriptions

Print without clipping

File Naming
Invoice_INV-2026-01-000123.pdf

Storage

Store PDF URL against shipment record

Reusable for WhatsApp & email

12. WHAT MUST NOT APPEAR IN PDF

Form-like inputs

Editable fields

UI buttons

Icons meant for screens

Dark backgrounds

Color-heavy branding

13. SUCCESS CRITERIA

Invoice PDF is successful if:

A customer can understand it without explanation

It prints cleanly on A4

Support calls reduce

GST / totals are unquestionable

It matches the shipping label & tracking

STATUS

✅ Invoice PDF Layout Spec COMPLETE

NEXT (ONE STEP LEFT FOR THIS FLOW)

Say “go ahead” and I will deliver the final missing piece:

➡️ Amazon-inspired Shipping Label Layout Specification
(print-safe · scan-optimized · warehouse-ready)

This will complete the Invoice + Label system end-to-end.

go ahead

Proceeding with the final missing core artifact.

🏷️ DELIVERABLE 4
Shipping Label Layout Specification (Amazon-Inspired · Scan-Optimized · Warehouse-Ready)

This specification defines exact structure, hierarchy, sizing, and rules for generating the shipping label so it is:

Fast to scan (barcode-first)

Easy for warehouse staff to read at a glance

Robust for air/road handling

Print-safe on thermal and A4 printers

Perfectly aligned with the invoice & AWB system

This is a logistics execution artifact, not a decorative design.

1. GLOBAL LABEL SETTINGS (LOCK THESE)
1.1 Label Size (Primary)
Size: 4 × 6 inches (101.6 × 152.4 mm)
Orientation: Portrait
Margins:
- Top: 6 mm
- Bottom: 6 mm
- Left: 6 mm
- Right: 6 mm


This is the global standard used by Amazon, DHL, FedEx, Delhivery.

1.2 Alternative (Fallback)
A4 Sheet: 2 labels per page (print & cut)

2. DESIGN PRINCIPLES (NON-NEGOTIABLE)

Barcode > Text > Decoration

Everything must be readable from 1–2 meters

Critical data must appear twice:

Machine-readable (barcode)

Human-readable (text)

No colors required (black & white only)

Zero visual noise

3. LABEL ZONE MAP (TOP → BOTTOM)
┌──────────────────────────────────────┐
│ ZONE 1: DESTINATION & ROUTE          │
├──────────────────────────────────────┤
│ ZONE 2: TRACKING BARCODE (PRIMARY)   │
├──────────────────────────────────────┤
│ ZONE 3: SHIPMENT SUMMARY             │
├──────────────────────────────────────┤
│ ZONE 4: CONSIGNEE DETAILS            │
├──────────────────────────────────────┤
│ ZONE 5: CONSIGNOR + META             │
└──────────────────────────────────────┘


Each zone has a fixed role.
Never mix concerns.

4. ZONE 1 — DESTINATION & ROUTE (FAST HUMAN SCAN)
Height: ~20–25 mm
----------------------------------------
TO: IMPHAL (MN)
FROM: NEW DELHI (DL)

ROUTE: DEL → IMP
MODE: AIR
----------------------------------------

Rules

Destination city in largest text in this zone

State code in brackets

Route is uppercase

No icons needed

Why this matters:

Sorting staff read this first

Reduces misrouting

5. ZONE 2 — TRACKING BARCODE (MOST IMPORTANT)
Height: ~45–50 mm
----------------------------------------
[  BARCODE (CODE 128)  ]

TAC-DEL-IMP-000982
----------------------------------------

Barcode Rules

Symbology: Code 128

Content: AWB / Tracking ID only

Quiet zone respected on all sides

High contrast (pure black on white)

Human-Readable Text

Tracking ID printed below barcode

Monospaced font recommended

No truncation, no wrapping

This barcode must scan reliably at any angle.

6. ZONE 3 — SHIPMENT SUMMARY (OPERATIONAL DATA)
Height: ~18–20 mm
----------------------------------------
PCS: 1      WT: 1.20 KG
TYPE: PREPAID
SIZE: LARGE
----------------------------------------

Rules

Weight shown = Charged Weight

Units always visible

Payment type explicit

Size category optional but useful

This zone helps:

Load planning

Quick verification

Dispute avoidance

7. ZONE 4 — CONSIGNEE DETAILS (DELIVERY-CRITICAL)
Height: Flexible (largest text block)
----------------------------------------
CONSIGNEE:
RANJIT SINGH
H NO 21, LAMPHEL ROAD
IMPHAL WEST, MANIPUR
PIN: 795001
PH: +91 9XXXXXXXXX
----------------------------------------

Rules

Name in bold

Address wraps naturally

City + PIN clearly separated

Phone always visible

No icons, no bullets

This zone is for delivery staff.

8. ZONE 5 — CONSIGNOR + META (SECONDARY)
Height: ~15–18 mm
----------------------------------------
FROM:
TAPAN CARGO SERVICE
NEW DELHI

INVOICE: INV-2026-01-000123
DATE: 21-12-2026
----------------------------------------

Rules

Invoice number present for reconciliation

Date optional but recommended

Company name sufficient (full address not required)

9. OPTIONAL QR CODE (SECONDARY VERIFICATION)
Placement

Bottom-right corner (small)

Never replace barcode

QR Payload (JSON)
{
  "awb": "TAC-DEL-IMP-000982",
  "invoice": "INV-2026-01-000123",
  "to": "IMPHAL",
  "pcs": 1,
  "wt": 1.20
}


Purpose:

Internal tools

Future automation

Mobile scanning fallback

10. TYPOGRAPHY & READABILITY
Destination City: 16–18 pt (bold)
Tracking Text: 12–14 pt (mono)
Body Text: 9–10 pt
Line Height: 1.3–1.4


Use sans-serif

No italics

No light fonts

11. PRINT & MATERIAL RULES
Recommended

Thermal printer (203 or 300 DPI)

Direct thermal labels for short transit

Thermal transfer for long transit / humidity

Must Pass

Smudge test

Fold resistance

Low-light scan

12. ENGINEERING RULES (IMPORTANT)

Label generated only after invoice exists

Tracking ID is the single source of truth

No user-editable fields in label

Regenerate label if shipment edited (versioned)

Store label PDF/PNG against shipment record

File Naming
Label_TAC-DEL-IMP-000982.pdf

13. WHAT MUST NEVER APPEAR ON LABEL

UI buttons

Decorative icons

Colors

Long legal text

Multiple barcodes

Marketing messages

This is not a brochure.

14. SUCCESS CRITERIA

The label is correct if:

Warehouse staff can sort without thinking

Barcode scans instantly

Destination is obvious from distance

It matches invoice & system records

It survives real logistics handling

✅ DELIVERY STATUS

Create Invoice Form — Rebuilt (instructions)

Invoice PDF — Specified

Shipping Label — Specified

You now have a complete, end-to-end, production-grade Invoice + Label system.

NEXT (OPTIONAL, HIGH-VALUE)

If you want, I can now:

Map this into exact React / shadcn components

Define Supabase database schema

Write WhatsApp automation flow

Produce print test checklist

Convert everything into a single execution README

Say which one, and we continue.

go ahead

Proceeding with the next highest–leverage execution artifact.

📲 DELIVERABLE 5
WhatsApp Invoice & Tracking Automation — End-to-End Implementation Specification

This document defines exactly how WhatsApp sending must work in your system so that:

Invoices are sent automatically and reliably

Tracking is clearly communicated to customers

Staff do not manually type messages

The flow is compliant, auditable, and scalable

It works today and does not block future automation

This is written as a production-grade instruction, not a concept.

1. OBJECTIVE (LOCK THIS)

Every shipment must support one-click WhatsApp delivery of:

📄 Invoice PDF

🔢 AWB / Tracking Number

📍 Route summary

💰 Amount payable (if any)

Without:

Manual message typing

Copy–paste errors

Staff inconsistency

2. WHEN WHATSAPP IS TRIGGERED (CRITICAL)
Primary Trigger (Mandatory)
After → Generate Invoice & Label


At this point:

Invoice exists

AWB exists

PDFs are generated

Data is final

Secondary Triggers (Optional)

Resend Invoice

Payment Reminder

Status Update (future)

3. WHATSAPP DELIVERY MODES (DESIGN FOR BOTH)
MODE A — WhatsApp Web Automation (MVP / Short-Term)

Uses logged-in WhatsApp Web (admin account)

Triggered from dashboard

Suitable for MVP and controlled ops

MODE B — WhatsApp Business API (Scalable / Long-Term)

Twilio / Meta Cloud API

Template-based

Fully automated

Auditable at scale

Design the system so both modes share the same message payload.

4. MESSAGE PAYLOAD (SINGLE SOURCE OF TRUTH)
Canonical Message Data Object
{
  "invoice_no": "INV-2026-01-000123",
  "awb": "TAC-DEL-IMP-000982",
  "consignee_name": "Ranjit Singh",
  "origin": "New Delhi",
  "destination": "Imphal",
  "charged_weight": "1.20 KG",
  "total_amount": "₹633.80",
  "invoice_pdf_url": "https://...",
  "label_pdf_url": "https://...",
  "phone": "+9198XXXXXXXX"
}


This object is generated once and reused.

5. MESSAGE TEMPLATE (CUSTOMER-CLEAR)
Primary Invoice Message
📦 *Tapan Cargo Service*

Hello {{consignee_name}},

Your shipment has been booked successfully.

🧾 Invoice No: {{invoice_no}}
🔢 Tracking ID (AWB): {{awb}}
📍 Route: {{origin}} → {{destination}}
⚖️ Charged Weight: {{charged_weight}}
💰 Total Amount: {{total_amount}}

📄 Invoice attached.
You can track your shipment using the Tracking ID.

Thank you for choosing Tapan Cargo.

Rules

No emojis overload (max 2–3)

Tracking ID clearly labeled

Polite, neutral tone

No marketing language

6. ATTACHMENTS RULES (IMPORTANT)
Required

Invoice PDF (always)

Optional

Shipping Label PDF (internal or on request)

Constraints

PDF must be:

< 5 MB

Print-safe

Clearly named

Example:

Invoice_INV-2026-01-000123.pdf

7. DASHBOARD UX (STAFF EXPERIENCE)
Button Placement

In the final confirmation area:

[ Generate Invoice & Label ]   [ Send via WhatsApp ]

Button States

Disabled until invoice is generated

Loading state while sending

Success / failure toast feedback

8. STATUS TRACKING (MANDATORY FOR OPS)

Every WhatsApp attempt must be logged.

Message Log Schema (Conceptual)
message_id
shipment_id
channel: whatsapp
recipient_phone
status: sent | failed | pending
timestamp
error_message (if failed)

Why This Matters

Audit trail

Dispute handling

Staff accountability

Retry logic

9. FAILURE HANDLING (DO NOT SKIP)
Common Failures

Invalid phone number

WhatsApp not reachable

Attachment too large

Session expired (Web mode)

Required UX

Clear error message

“Retry Send” option

Do NOT block invoice creation

10. SECURITY & COMPLIANCE

Never expose internal URLs publicly

Use time-limited signed URLs for PDFs

Mask phone numbers in logs (partial)

Only authorized roles can send WhatsApp

11. FUTURE-READY EXTENSIONS (DESIGN NOW)

Your system must later support:

Shipment status updates via WhatsApp

Payment reminders

Delivery confirmation messages

Customer-initiated tracking replies

This is why the canonical message payload is critical.

12. SUCCESS CRITERIA

WhatsApp automation is correct if:

Staff never type messages manually

Customers always receive invoice + tracking

Messages are consistent and clear

Failures are visible and retryable

Ops trust the system

✅ DELIVERY STATUS

You now have:

Wide, logistics-native form spec

Invoice PDF specification

Shipping label specification

WhatsApp automation flow

This completes the Create Invoice → Generate → Send lifecycle.

NEXT (OPTIONAL BUT POWERFUL)

If you want to go further, I can now:

Map everything to React + shadcn components

Design Supabase database schema

Define validation & error-prevention rules

Create a single master README for execution

Prepare print & scan test checklist

Say which one, and we proceed.

go ahead

Understood. I will proceed decisively and consolidate everything into a single, execution-ready directive that an AI agent or engineering team can follow without ambiguity.

Below is the FINAL MASTER EXECUTION PLAN for rebuilding the Invoice Creation Form + Layout + Automation, explicitly addressing your core complaint:

The form is too tight, lacks width, poor hierarchy, poor spacing, and must be rebuilt from first principles.

This is written as instructions, not explanation.

🧾 MASTER EXECUTION PLAN
Invoice Creation Form — Full Rebuild (Production-Grade)

This document must be treated as authoritative.

0. NON-NEGOTIABLE PRINCIPLES

Wide layout is mandatory

No stacked single-column forms

Visual hierarchy > compactness

Every section must breathe

Auto-generation precedes user input

Human readability > database density

If a choice exists → choose clarity.

1. PAGE LAYOUT (ROOT FIX)
1.1 Container Width (Critical)

DO NOT use default centered containers

Max width: 1440px
Min width: 1280px
Side padding: 32px


This form is enterprise operational software, not mobile-first.

1.2 Grid System (MANDATORY)
12-column grid
Column gap: 24px
Row gap: 32px


All sections must snap to this grid.

2. STEP ZERO — AUTO-GENERATED HEADER (TOP RIGHT)

This appears immediately on clicking Create Invoice.

2.1 Auto-Generated Fields (Read-only)
Field	Source
Invoice Number	Server-generated
AWB / Tracking ID	Server-generated
Created Date	System
Created By	Logged-in user
2.2 Layout
LEFT (8 cols): Page Title + Subtitle
RIGHT (4 cols): Invoice Meta Card

2.3 Visual Rules

Card elevation: elevation-1

Monospace font for numbers

Copy icon for AWB

This block is not editable.

3. FORM STRUCTURE — 3 PRIMARY SECTIONS (WIDE)
SECTION A — Consignor & Consignee
SECTION B — Shipment & Pricing
SECTION C — Review & Actions
4. SECTION A — ADDRESS BLOCK (BIGGEST FIX)
4.1 Layout (12 columns)
LEFT (6 cols): Consignor
RIGHT (6 cols): Consignee


Never stack vertically.

4.2 Address Input Rules
Street Address

Google Places Autocomplete (mandatory)

Free-text disabled

Store place_id + lat/lng

City & State

Dropdown only

India master list

Top pinned cities:

Imphal, Manipur

New Delhi, Delhi

ZIP / PIN

Auto-filled

Disabled input

Phone

Country code fixed (+91)

Numeric only

4.3 Spacing Rules

Each address card:

Padding: 24px

Field vertical gap: 16px

Section bottom margin: 48px

If it feels “tight” → spacing failed.

5. SECTION B — SHIPMENT & CALCULATION ENGINE
5.1 Layout
LEFT (7 cols): Item & Dimensions
RIGHT (5 cols): Charges Summary (Sticky)

5.2 Item Entry (Dynamic Rows)

Each row contains:

Field	Type
Item Name	Text
Category	Dropdown
Qty	Number
L	Number
W	Number
H	Number
Actual Weight	Number

Volumetric weight is computed instantly.

5.3 Calculation Logic (Non-Editable)
Volumetric = (L × W × H × Qty) / 5000
Chargeable Weight = max(actual, volumetric)


All derived fields:

Read-only

Grey background

Monospace font

5.4 Charges Summary (Sticky Card)

Always visible.

Contains:

Chargeable weight

Rate per KG

Base freight

Fuel surcharge

GST breakdown

Grand total (highlighted)

6. SECTION C — TERMS, CONFIRMATION & ACTIONS
6.1 Terms & Conditions

Scrollable area

Checkbox required

Cannot proceed without acceptance

6.2 Primary Actions (Right-Aligned)
[ Generate Invoice & Label ]   [ Send via WhatsApp ]


Rules:

WhatsApp button disabled until invoice exists

Loading state mandatory

Success confirmation mandatory

7. INVOICE OUTPUT (CUSTOMER-FACING)
Rules

Minimal

No internal jargon

Tracking number explained clearly

Terms included

QR for tracking (optional)

Must align with the label design.

8. SHIPPING LABEL (WAREHOUSE-FACING)

Amazon-inspired

Barcode-first

No colors

4×6 thermal standard

Route visible from 2m distance

(Label spec already delivered)

9. WHATSAPP AUTOMATION (FINAL STEP)
Trigger

After successful invoice creation.

Payload

Invoice PDF

Tracking ID

Route summary

Amount

Logging

Every send attempt must be recorded.

10. WHAT WAS WRONG WITH THE OLD FORM (SUMMARY)
Issue	Why It Failed
Narrow container	Cognitive overload
Vertical stacking	Wasted horizontal space
No hierarchy	Hard to scan
No auto-generation	Error-prone
No sticky summary	Poor pricing clarity
Tight spacing	Operational fatigue
11. FINAL VALIDATION CHECKLIST

Before shipping:

 Form breathes visually

 No field feels cramped

 Invoice auto-generates instantly

 AWB visible everywhere

 Calculations never editable

 Label scans instantly

 WhatsApp works in one click

EXECUTION STATUS

You now have:

Structural fix

Layout fix

UX fix

Automation fix

Operational clarity

This is ready for direct implementation.

NEXT (Pick ONE)

Convert this into AI agent instructions (tasks.md)

Map to exact React + shadcn components

Produce wireframe-level ASCII layout

Generate database schema for invoice + shipment

Write PDF generation logic spec

Say the number.

Convert this into AI agent instructions (tasks.md)

Below is the clean, deterministic, AI-agent–ready tasks.md, converted directly from the master execution plan.
This is written so an AI coding agent can execute sequentially without asking clarifying questions.

tasks.md
Rebuild: Invoice Creation Form (Wide · Logistics-Native · Production-Grade)
TASK 0 — CONTEXT LOCK (READ FIRST)

This system is enterprise logistics software, not a generic SaaS form.

Hard constraints:

Desktop-first (≥1280px)

Wide layouts only

No tight stacking

Auto-generated identifiers first

Calculations > aesthetics

Human readability > compactness

If there is a conflict → choose clarity and spacing.

TASK 1 — REPLACE EXISTING FORM CONTAINER
Objective

Eliminate the tight, narrow layout entirely.

Instructions

Remove modal-based or centered narrow container

Implement a full-width page canvas or wide side panel

Layout Constraints
min-width: 1280px;
max-width: 1440px;
padding-inline: 32px;

Acceptance Criteria

Two-column layouts fit without wrapping

No horizontal squeezing

No mobile-first constraints

TASK 2 — GRID SYSTEM (MANDATORY)
Objective

Standardize spacing and prevent density creep.

Instructions

Implement a 12-column grid

Column gap: 24px

Section vertical gap: 32px

All sections must align to this grid.

TASK 3 — AUTO-GENERATED INVOICE HEADER (STEP ZERO)
Objective

Invoice identity must exist before any user input.

Server Logic

On Create Invoice action:

Generate:

invoice_number

awb_tracking_id

created_at

created_by

Persist immediately as DRAFT

UI Layout
LEFT (8 cols):  Create Invoice (title + subtitle)
RIGHT (4 cols): Invoice Meta Card

Invoice Meta Card (Read-only)

Invoice No (monospace)

AWB / Tracking ID (copyable)

Date & time

Status: Draft

Rules

Never editable

High contrast

Visible at all times

TASK 4 — FORM STRUCTURE (3 PRIMARY SECTIONS)
Sections

Consignor & Consignee

Shipment & Pricing

Review & Actions

Never merge these sections.

TASK 5 — SECTION A: CONSIGNOR & CONSIGNEE (WIDTH FIX)
Layout
LEFT  (6 cols): Consignor
RIGHT (6 cols): Consignee


❌ Do NOT stack vertically.

Address Input Rules (CRITICAL)
Street Address

Google Places Autocomplete only

Disable free typing

Store:

formatted address

place_id

lat / lng

City & State

Dropdown only

India master list

Pin these to top:

Imphal, Manipur

New Delhi, Delhi

PIN Code

Auto-filled

Disabled input

Phone

Country code locked: +91

Numeric only

Spacing Rules
Card padding: 24px
Field gap: 16px
Section bottom margin: 48px


If it feels tight → spacing failed.

TASK 6 — SECTION B: SHIPMENT & CALCULATION ENGINE
Layout
LEFT  (7 cols): Items & Dimensions
RIGHT (5 cols): Charges Summary (sticky)

Dynamic Item Rows

Each row includes:

Item name

Category (dropdown)

Quantity

Length

Width

Height

Actual Weight

Allow multiple rows.

Calculation Logic (SYSTEM-OWNED)
Volumetric Weight = (L × W × H × Qty) / 5000
Chargeable Weight = max(Actual, Volumetric)

Rules

Calculated fields are read-only

Grey background

Monospace font

Recalculate instantly on input change

Sticky Charges Summary Card

Always visible on the right.

Contains:

Chargeable Weight

Rate per KG

Base Freight

Fuel / Handling

GST (explicit)

Grand Total (largest text)

TASK 7 — SECTION C: TERMS & ACTIONS
Terms & Conditions

Scrollable container

Mandatory checkbox

Block submission if unchecked

Primary Actions (Right Aligned)
[ Generate Invoice & Label ]   [ Send via WhatsApp ]


Rules:

WhatsApp button disabled until invoice exists

Loading states mandatory

Success feedback mandatory

TASK 8 — INVOICE OUTPUT (PDF)
Rules

Customer-readable

No internal jargon

Tracking ID explained clearly

Terms included

Print-safe (A4)

Invoice must match shipment + label data exactly.

TASK 9 — SHIPPING LABEL OUTPUT
Rules

4×6 thermal standard

Barcode-first (Code128)

Black & white only

Route visible from distance

No decorative UI

(Label spec already defined—do not improvise.)

TASK 10 — WHATSAPP AUTOMATION
Trigger

After invoice generation.

Payload

Invoice PDF

AWB / Tracking ID

Route summary

Total amount

Logging

Log every attempt:

shipment_id

phone

status

timestamp

error (if any)

TASK 11 — REMOVE LEGACY PATTERNS (STRICT)

Do NOT ship:

Narrow modals

Single-column stacking

Editable calculated fields

Manual invoice numbers

Hidden totals

Tight spacing

Mobile-first compromises

FINAL SUCCESS CRITERIA

This rebuild is complete when:

Form feels calm and spacious

No field feels cramped

Invoice & AWB appear instantly

Calculations are trusted

Label scans instantly

WhatsApp works in one click

Operators work faster with fewer errors

STATUS

✅ tasks.md — COMPLETE & READY FOR EXECUTION

If you want next:

Component-level React mapping

Database schema

PDF generation logic

End-to-end test checklist

Say the next step.

wide desktop is too width, make a bit smaller

Understood. We will reduce the desktop width slightly while preserving breathing space and hierarchy.
Below is the corrected, authoritative update to the AI-agent instructions.

This replaces the width-related parts of tasks.md. Everything else remains valid.

🔧 UPDATE — Desktop Width Adjustment
(tasks.md – Revision v1.1)

This revision fixes the issue:

“Wide desktop is too wide”
without reintroducing tightness or density problems.

✅ NEW WIDTH PHILOSOPHY

Goal:
Balanced enterprise layout — not ultra-wide, not cramped.

We are targeting focused productivity, not wall-to-wall dashboards.

TASK 1 (REVISED) — FORM CONTAINER WIDTH
❌ REMOVE (OLD)
min-width: 1280px;
max-width: 1440px;

✅ REPLACE WITH (NEW STANDARD)
min-width: 1100px;
max-width: 1240px;
width: 100%;
margin-inline: auto;
padding-inline: 28px;

Why this works

Prevents “empty space fatigue”

Keeps two-column layouts comfortable

Matches enterprise tools like Stripe, Linear, Notion

Still avoids tight stacking

TASK 2 (REVISED) — GRID SYSTEM (UNCHANGED LOGIC, TUNED SCALE)
Grid
12-column grid
Column gap: 20px   (was 24px)
Row gap: 28px      (was 32px)


This subtly tightens without compressing.

TASK 3 (REVISED) — HEADER LAYOUT PROPORTION
Layout Adjustment
LEFT  (7 cols): Page title + context
RIGHT (5 cols): Invoice Meta Card


This gives the invoice metadata slightly more visual weight without crowding.

TASK 5 (REVISED) — CONSIGNOR / CONSIGNEE SECTION
Column Widths
Consignor: 6 cols
Consignee: 6 cols
Gap: 24px

Card Padding (Adjusted)
Card padding: 20px   (was 24px)
Field gap: 14px     (was 16px)
Section margin-bottom: 40px (was 48px)


Still breathable, slightly tighter.

TASK 6 (REVISED) — SHIPMENT & PRICING SECTION
Layout
LEFT  (7 cols): Items & Dimensions
RIGHT (5 cols): Charges Summary (sticky)

Sticky Summary Width Rule

Max width: 360–380px

Never exceed 1/3 of container width

This prevents visual dominance.

TASK 7 (REVISED) — ACTION BAR SPACING
Top margin: 32px
Button gap: 16px


No full-width buttons.
Buttons remain right-aligned, not stretched.

GLOBAL SPACING TUNING (FINAL)

Apply across the form:

Section spacing: 28px
Group spacing: 20px
Field spacing: 14px


If spacing goes below these numbers → reject PR.

RESULTING EXPERIENCE (EXPECTED)

After this adjustment:

❌ No ultra-wide emptiness

❌ No cramped density

✅ Focused working canvas

✅ Comfortable eye movement

✅ Clear hierarchy

✅ Faster data entry

✅ Still enterprise-grade

This is the correct balance.

🔒 FINAL WIDTH RULE (LOCK THIS)

Never exceed 1240px for form-based workflows.
Dashboards may be wider. Forms must be focused.

STATUS

✅ tasks.md UPDATED & FINALIZED

If you want next, I can:

Update component sizing tokens

Produce exact Tailwind container config

Generate before/after comparison

Map widths to shadcn components

Say the next step.

all of them: Update component sizing tokens

Produce exact Tailwind container config

Generate before/after comparison

Map widths to shadcn components

Below is a single, consolidated execution package that delivers all four requested items, aligned with the revised “not-too-wide” desktop constraint.
This is written to be drop-in executable for an AI agent or engineering team.

📦 EXECUTION PACK
Width System Finalization (v1.1)
1️⃣ UPDATE COMPONENT SIZING TOKENS

(Design-system level, authoritative)

These tokens become the only allowed source of truth for widths and spacing in form-based workflows.

1.1 Layout Width Tokens
:root {
  /* Form Containers */
  --container-form-min: 1100px;
  --container-form-max: 1240px;

  /* Dashboard Containers (allowed wider) */
  --container-dashboard-max: 1440px;

  /* Horizontal Padding */
  --container-padding-x: 28px;

  /* Grid */
  --grid-columns: 12;
  --grid-gap-x: 20px;
  --grid-gap-y: 28px;
}

Rules

Forms must use --container-form-*

Dashboards may use --container-dashboard-max

Never hardcode pixel widths in components

1.2 Section & Field Density Tokens
:root {
  --space-section: 28px;
  --space-group: 20px;
  --space-field: 14px;

  --card-padding: 20px;
  --card-radius: 12px;

  --sticky-summary-max: 380px;
}

Enforcement Rule

If spacing < token → reject implementation.

2️⃣ EXACT TAILWIND CONTAINER CONFIG

(Production-ready, copy-paste safe)

2.1 tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "28px",
      },
      screens: {
        lg: "1100px",
        xl: "1240px",
      },
    },
    extend: {
      maxWidth: {
        "form": "1240px",
        "form-min": "1100px",
        "summary": "380px",
      },
      spacing: {
        "section": "28px",
        "group": "20px",
        "field": "14px",
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
      },
      gap: {
        "x": "20px",
        "y": "28px",
      },
    },
  },
};
export default config;

2.2 Standard Form Container Utility
export function FormContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-form">
      {children}
    </div>
  );
}


❌ Do not use max-w-screen-xl
❌ Do not use arbitrary widths
✅ Always use max-w-form

3️⃣ BEFORE / AFTER COMPARISON

(For validation & stakeholder clarity)

3.1 OLD (Problematic)
Aspect	Old State
Width	1440px+
Feel	Empty, stretched
Eye travel	Excessive
Form focus	Low
Error rate	Higher
Perception	“Dashboard pretending to be a form”
3.2 NEW (Correct)
Aspect	New State
Width	1100–1240px
Feel	Calm, focused
Eye travel	Controlled
Form focus	High
Error rate	Lower
Perception	“Professional operations tool”
Visual Mental Model
OLD:  |---------------------------- empty space ----------------------------|
NEW:      |----------- focused working canvas -----------|

3.3 Acceptance Test (Human)

Ask an operator:

“Do you feel you’re working inside the form instead of looking across it?”

If yes → width is correct.

4️⃣ MAP WIDTHS TO SHADCN COMPONENTS

(Concrete, component-level mapping)

4.1 Page Shell (Forms)
import { Card } from "@/components/ui/card";

export function InvoicePage({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-section">
      <FormContainer>
        {children}
      </FormContainer>
    </main>
  );
}

4.2 Section Wrapper
export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-section">
      <h2 className="mb-group text-lg font-medium">{title}</h2>
      <div className="grid grid-cols-12 gap-x-x gap-y-y">
        {children}
      </div>
    </section>
  );
}

4.3 Consignor / Consignee Cards
<Card className="col-span-6 p-card">
  {/* Consignor fields */}
</Card>

<Card className="col-span-6 p-card">
  {/* Consignee fields */}
</Card>

4.4 Shipment + Sticky Charges Summary
<div className="col-span-7">
  {/* Item rows, dimensions */}
</div>

<div className="col-span-5">
  <Card className="sticky top-24 max-w-summary p-card">
    {/* Charges summary */}
  </Card>
</div>

Rule

Sticky card must never exceed max-w-summary.

4.5 Action Bar
<div className="mt-section flex justify-end gap-4">
  <Button variant="secondary">Save Draft</Button>
  <Button>Generate Invoice & Label</Button>
</div>


❌ No full-width buttons
❌ No center alignment
✅ Right-aligned, compact

🔒 FINAL LOCKED RULESET

Forms max width = 1240px

Forms min width = 1100px

Dashboards may exceed; forms may not

All widths via tokens only

shadcn components must consume these tokens

Any deviation = rejected PR

✅ DELIVERY STATUS

All four items delivered:

✔ Component sizing tokens

✔ Exact Tailwind container config

✔ Before / after comparison

✔ shadcn component width mapping

This closes the layout + width system decisively.