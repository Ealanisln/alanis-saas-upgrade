# TypeScript Strict Mode Migration Issues

TypeScript strict mode has been enabled in `tsconfig.json` (line 11: `"strict": true`).

## Summary

- **Total Errors**: ~60
- **Files Affected**: 15
- **Critical**: 8 files
- **Non-Critical**: 7 files (migrations, demo pages)

## Issues by Priority

### 🔴 Critical Production Code (8 files)

#### 1. `src/app/[locale]/blog/[slug]/page.tsx` (11 errors)
**Issue**: Possibly null values not handled
- `post` can be null - need null checks before accessing properties
- `post.author` type mismatch in structured data

**Fix Needed**:
```typescript
// Before
const post = await getData(params.slug, locale);
return { title: post.title, ... }

// After
const post = await getData(params.slug, locale);
if (!post) return notFound();
return { title: post.title, ... }
```

#### 2. `src/components/Blog/Posts.tsx` (2 errors)
**Issue**: Possibly undefined values
- `post.slug` can be undefined
- `post.mainImage` can be undefined

**Fix Needed**: Add optional chaining and null checks

#### 3. `src/components/Contact/index.tsx` (6 errors)
**Issue**: Form state type issues
- State object has incorrect type definition
- Error handling needs proper typing

**Fix Needed**: Define proper FormState interface

#### 4. `src/hooks/useQuotes.ts` (6 errors)
**Issue**: Type mismatches with API response
- Accessing non-existent properties on QuoteResponse
- Should use ApiResponse<QuoteResponse> wrapper type

**Fix Needed**:
```typescript
// The response is wrapped in ApiResponse
const response = await createQuote(request);
// Access: response.data instead of response directly
```

#### 5. `src/i18n/request.ts` (1 error)
**Issue**: Locale can be undefined
**Fix Needed**: Add fallback for undefined locale

#### 6. `src/components/Header/index.tsx` (1 error)
**Issue**: Implicit 'any' in map callback
**Fix Needed**: Type the index parameter

#### 7. `src/components/Pricing/PricingFAQ.tsx` (1 error)
**Issue**: Implicit 'any' in filter callback
**Fix Needed**: Type the id parameter

#### 8. `src/components/Stripe/StripeButton.tsx` (1 error)
**Issue**: Passing undefined to function expecting string
**Fix Needed**: Add null check before function call

### 🟡 Non-Critical Files (7 files)

#### 9. `migrations/*` (7 errors)
- Migration scripts - acceptable to have relaxed types
- Can add `// @ts-nocheck` if needed

#### 10. `src/app/new-ui/page.tsx` (29 errors)
- Demo/prototype page - not production code
- Can be excluded from strict checks

#### 11. `src/components/Video/index.tsx` (1 error)
- Missing type package: `react-modal-video`
- Install: `pnpm add -D @types/react-modal-video`

## Recommended Migration Strategy

### Phase 1: Quick Wins (1-2 hours)
1. Fix i18n/request.ts (simple null check)
2. Fix Header index parameter type
3. Fix PricingFAQ id parameter type
4. Fix StripeButton undefined check

### Phase 2: Type System Updates (2-3 hours)
5. Create FormState interface for Contact component
6. Update useQuotes to use ApiResponse wrapper correctly
7. Add @types/react-modal-video package

### Phase 3: Null Safety (2-3 hours)
8. Add null checks to blog/[slug]/page.tsx
9. Add optional chaining to Blog/Posts.tsx

### Phase 4: Non-Critical (Optional)
10. Exclude new-ui page from type checking
11. Add @ts-nocheck to migration files if needed

## Current Status

- ✅ Strict mode enabled
- ✅ @portabletext/types installed
- ⏳ Critical issues documented
- ⏳ Migration path defined

## For PR Reviewers

Strict mode has been intentionally enabled to improve type safety. Some files still require updates to be fully compliant. This is a standard incremental migration approach:

1. Enable strict mode
2. Fix critical paths
3. Gradually fix remaining files
4. Remove ESLint bypass once complete

See individual file sections above for specific fix recommendations.

## Testing

Current test suite (12 tests) passes with strict mode enabled:
```bash
pnpm test
✓ src/lib/utils/__tests__/utils.test.ts (5 tests)
✓ src/store/cart/__tests__/cart-store.test.ts (7 tests)
```

## Follow-up Tasks

Create separate issues/tasks for each Phase above to track incremental fixes.
