# Codegen / AI Review Rules

## Purpose
This document defines the contract between AI code generators/reviewers and the TAC Cargo codebase. All AI-generated code must comply with these rules.

## Authority Level

### AI is AUTHORIZED to:
1. **Refactor color usage** - Replace hardcoded colors with semantic tokens
2. **Fix accessibility violations** - Add ARIA attributes, improve contrast
3. **Improve type safety** - Add TypeScript types, remove `any`
4. **Extract repeated logic** - Create utilities, hooks, or components
5. **Optimize performance** - Lazy load, code split, optimize images
6. **Fix known issues** - Address items in `docs/known-issues.md`
7. **Update documentation** - Keep docs synchronized with code changes
8. **Add error handling** - Implement try-catch, error boundaries
9. **Implement responsive design** - Add mobile breakpoints
10. **Enforce style consistency** - Apply Tailwind conventions

### AI MUST NEVER:
1. **Remove authentication** - Never bypass or disable auth checks
2. **Expose secrets** - Never hardcode API keys or tokens
3. **Delete data** - Never remove database records without explicit instruction
4. **Disable RLS** - Never turn off Row-Level Security policies
5. **Remove error boundaries** - Never delete error handling
6. **Break navigation** - Never introduce broken routes or links
7. **Introduce hardcoded colors** - Never use hex/rgb/hsl values
8. **Skip validation** - Never accept unvalidated user input
9. **Disable accessibility** - Never remove ARIA attributes or keyboard support
10. **Modify Supabase schema** - Never alter database structure without migration

### AI SHOULD ASK BEFORE:
1. **Major architectural changes** - Switching libraries, patterns
2. **Breaking API changes** - Changing request/response formats
3. **New dependencies** - Adding packages to package.json
4. **Database migrations** - Schema alterations
5. **Authentication flow changes** - OAuth, MFA, session management
6. **Deployment configuration** - Vercel settings, environment variables

## Codebase Constraints

### File Structure Rules
```
✅ ALLOWED:
- Create new components in appropriate directories
- Add new utilities to lib/
- Create new API routes in app/api/
- Add new Server Actions to app/actions/
- Expand type definitions in types/

❌ FORBIDDEN:
- Reorganize entire directory structure
- Create barrel exports (index.ts files)
- Mix server and client code in same file
- Create files outside established patterns
```

### Naming Conventions
```typescript
✅ REQUIRED:
- Components: PascalCase (UserProfile.tsx)
- Files: kebab-case (user-profile.tsx)
- Functions: camelCase (getUserProfile)
- Types: PascalCase (UserProfile)
- Constants: SCREAMING_SNAKE_CASE (API_ENDPOINT)
- CSS classes: kebab-case (user-profile)

❌ FORBIDDEN:
- snake_case for functions
- camelCase for files
- Abbreviations (usrProf, getUsr)
```

### Import Organization
```typescript
✅ REQUIRED ORDER:
1. React imports
2. Next.js imports
3. Third-party libraries
4. Absolute imports (@/...)
5. Relative imports (../, ./)
6. Type imports (import type)
7. CSS imports

// Example:
import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { formatDate } from '../utils'
import type { User } from '@/types'
import './styles.css'
```

## Color System Enforcement

### CRITICAL: Zero Tolerance for Hardcoded Colors

```tsx
❌ NEVER GENERATE:
className="bg-[#1a1a1a]"
className="text-white"
className="bg-slate-900"
style={{ backgroundColor: '#1a1a1a' }}

✅ ALWAYS USE:
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
className="border border-border/40"
className="bg-destructive text-destructive-foreground"
```

### Semantic Token Reference
```typescript
// Available tokens (see docs/tailwind-colors.md)
background, foreground
card, card-foreground
primary, primary-foreground
secondary, secondary-foreground
muted, muted-foreground
accent, accent-foreground
destructive, destructive-foreground
border, input, ring
success, warning, info
```

### Opacity Usage
```tsx
✅ CORRECT:
border-border/20   // Subtle dividers
border-border/30   // Interactive elements
border-border/40   // Section headers
bg-card/80         // Translucent backgrounds

❌ INCORRECT:
border-opacity-20  // Use slash notation
bg-black/20        // Use semantic tokens
```

## Component Architecture Rules

### Server vs Client Components
```typescript
✅ DEFAULT: Server Component (no directive)
export async function DataDisplay() {
  const data = await fetchData()
  return <div>{data}</div>
}

✅ CLIENT: Only when necessary
'use client'
export function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

❌ INCORRECT: Unnecessary client component
'use client'
export function StaticDisplay({ data }: { data: string }) {
  return <div>{data}</div> // No interactivity, should be Server Component
}
```

### Component Size Limits
```typescript
✅ ALLOWED:
- UI primitives: <100 lines
- Feature components: <300 lines
- Page components: <200 lines (extract to features)

❌ TOO LARGE:
- Any component >300 lines
- Components with multiple responsibilities
```

### Props Interface Pattern
```typescript
✅ REQUIRED:
interface ComponentProps {
  title: string
  count: number
  onAction?: () => void
  children?: React.ReactNode
}

export function Component({ title, count, onAction, children }: ComponentProps) {
  // ...
}

❌ FORBIDDEN:
export function Component(props: any) { } // No 'any'
export function Component(props) { }       // No implicit types
```

## Data Fetching Patterns

### Server Components (Preferred)
```typescript
✅ CORRECT:
export default async function Page() {
  const supabase = createClient()
  const { data } = await supabase.from('shipments').select('*')
  return <List data={data} />
}

❌ INCORRECT:
'use client'
export default function Page() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/shipments').then(res => res.json()).then(setData)
  }, [])
  return <List data={data} />
}
```

### TanStack Query (Client Components)
```typescript
✅ CORRECT:
'use client'
export function LiveTracker() {
  const { data, isLoading } = useQuery({
    queryKey: ['tracking', id],
    queryFn: () => fetchTracking(id),
    refetchInterval: 30000,
  })
  
  if (isLoading) return <Skeleton />
  return <Display data={data} />
}
```

## API Route Standards

### Request Validation
```typescript
✅ REQUIRED:
import { z } from 'zod'

const QuerySchema = z.object({
  id: z.string().uuid(),
  includeHistory: z.boolean().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const parsed = QuerySchema.safeParse({
    id: searchParams.get('id'),
    includeHistory: searchParams.get('includeHistory') === 'true',
  })
  
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', parsed.error.message)
  }
  
  const { id, includeHistory } = parsed.data
  // ...
}

❌ FORBIDDEN:
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id') // No validation
  const data = await fetchData(id) // Unsafe
  return Response.json(data)
}
```

### Response Format
```typescript
✅ REQUIRED:
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const data = await fetchData()
    return successResponse(data)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', error.message)
  }
}

❌ FORBIDDEN:
export async function GET() {
  const data = await fetchData()
  return new Response(JSON.stringify(data)) // No error handling
}
```

## Authentication Enforcement

### Route Protection
```typescript
✅ REQUIRED:
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  return <Dashboard user={user} />
}

❌ FORBIDDEN:
export default async function ProtectedPage() {
  // No auth check - NEVER do this
  return <Dashboard />
}
```

### Server Actions
```typescript
✅ REQUIRED:
'use server'
export async function updateData(id: string) {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }
  }
  
  // Proceed with authenticated action
}

❌ FORBIDDEN:
'use server'
export async function updateData(id: string) {
  // No auth check - NEVER do this
  await supabase.from('data').update({ ... })
}
```

## Type Safety Standards

### Strict TypeScript
```typescript
✅ REQUIRED:
interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

function processUser(user: User): string {
  return user.email
}

❌ FORBIDDEN:
function processUser(user: any): any {
  return user.email
}
```

### Zod Validation
```typescript
✅ REQUIRED for user input:
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
})

type User = z.infer<typeof UserSchema>
```

## Error Handling Requirements

### Try-Catch Blocks
```typescript
✅ REQUIRED:
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}

❌ FORBIDDEN:
async function fetchData() {
  const response = await fetch('/api/data') // No error handling
  return await response.json()
}
```

### Error Boundaries
```tsx
✅ REQUIRED for data-heavy components:
import { ErrorBoundary } from '@/components/error-boundary'

<ErrorBoundary fallback={<ErrorState />}>
  <HeavyComponent />
</ErrorBoundary>

❌ FORBIDDEN:
<HeavyComponent /> // No error boundary
```

## Performance Standards

### Image Optimization
```tsx
✅ REQUIRED:
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority={false}
/>

❌ FORBIDDEN:
<img src="/hero.jpg" alt="Description" /> // No optimization
```

### Code Splitting
```tsx
✅ REQUIRED for heavy components:
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <Skeleton />,
  ssr: false,
})

❌ FORBIDDEN:
import { HeavyChart } from './heavy-chart' // No lazy loading
```

## Accessibility Requirements

### Semantic HTML
```tsx
✅ REQUIRED:
<button onClick={handleClick}>Action</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>

❌ FORBIDDEN:
<div onClick={handleClick}>Action</div> // Use <button>
<div className="nav">...</div>          // Use <nav>
```

### ARIA Attributes
```tsx
✅ REQUIRED:
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
  <X className="h-4 w-4" />
</button>

❌ FORBIDDEN:
<button>
  <X className="h-4 w-4" /> // No label for icon-only button
</button>
```

## Output Format Expectations

### Code Generation
```typescript
✅ EXPECTED OUTPUT:
// 1. Imports organized
// 2. TypeScript types defined
// 3. Component/function implementation
// 4. Proper error handling
// 5. Accessibility attributes
// 6. Comments for complex logic only

❌ UNEXPECTED OUTPUT:
// Over-commented obvious code
// Inline styles
// Console.logs in production code
// Commented-out code blocks
// TODO comments without tickets
```

### Explanation Format
```markdown
✅ EXPECTED:
## Changes Made
- Added TypeScript types for User interface
- Implemented error boundary around data table
- Replaced hardcoded colors with semantic tokens
- Added ARIA labels to icon buttons

## Files Modified
- components/user-table.tsx
- types/user.ts

## Testing
- Verified in both light and dark themes
- Tested keyboard navigation
- Checked accessibility with axe DevTools

❌ UNEXPECTED:
Made some changes to improve the code quality and fix bugs.
```

## Review Depth Requirements

### Shallow Review (Syntax/Style)
- Check naming conventions
- Verify import organization
- Ensure no hardcoded colors
- Validate file structure

### Medium Review (Logic/Patterns)
- Verify component architecture (server vs client)
- Check data fetching patterns
- Validate error handling
- Review type safety

### Deep Review (Security/Performance)
- Audit authentication enforcement
- Check for SQL injection risks
- Validate input sanitization
- Review performance optimizations
- Verify accessibility compliance

## Refactoring Permissions

### Automatic (No Approval Needed)
1. Color system fixes (hardcoded → semantic tokens)
2. Type safety improvements (any → typed)
3. Import organization
4. Extract repeated code to utilities
5. Add missing error handling
6. Accessibility fixes (ARIA, semantic HTML)
7. Performance optimizations (lazy loading, code splitting)
8. Documentation updates

### Requires Context (Clarify Intent)
1. Component extraction
2. State management changes
3. API route modifications
4. Database query optimization
5. Cache strategy changes

### Requires Approval (Breaking Changes)
1. Dependency additions/removals
2. Authentication flow changes
3. API contract changes
4. Database schema changes
5. Deployment configuration
6. Major refactoring (>5 files)

## AI-Generated Code as First Draft

### Assumption
**All AI-generated code is a first draft** and must be:
1. Reviewed by human developer
2. Tested in development environment
3. Validated against these rules
4. Integrated incrementally

### Human Review Checklist
- [ ] Follows file naming conventions
- [ ] Uses semantic color tokens only
- [ ] Implements proper error handling
- [ ] Includes TypeScript types
- [ ] Handles authentication correctly
- [ ] Follows component architecture rules
- [ ] Maintains accessibility standards
- [ ] Includes necessary documentation
- [ ] Passes linting (ESLint)
- [ ] Passes type checking (tsc)

## Enforcement Mechanism

### Linting
```bash
npm run lint # ESLint checks
npx tsc --noEmit # TypeScript checks
```

### Pre-commit Hooks (Future)
```bash
npm install --save-dev husky lint-staged
```

### CI/CD Checks (Future)
- TypeScript compilation
- ESLint validation
- Test suite execution
- Bundle size analysis
- Accessibility audit

## Summary

### Golden Rules
1. **Colors**: Semantic tokens only, never hardcoded
2. **Types**: Strict TypeScript, no `any`
3. **Auth**: Always validate, never bypass
4. **Errors**: Handle explicitly, never ignore
5. **Performance**: Optimize by default
6. **Accessibility**: WCAG AA minimum
7. **Security**: Validate input, sanitize output

### When in Doubt
- **Check documentation** (`docs/`)
- **Follow existing patterns** (grep codebase)
- **Ask for clarification** (don't guess)
- **Prefer safety over convenience**
- **Document your reasoning** (comments for "why", not "what")
