---
description: Rules for writing code during the TypeScript migration (MANDATORY)
---
// turbo-all

1. **New Files must be TypeScript**:
   - When creating a new file, ALWAYS use `.ts` (logic) or `.tsx` (React components).
   - NEVER create new `.js` or `.jsx` files.

2. **The Boy Scout Rule**:
   - If you edit an existing `.js` file to add a feature or make a significant change:
     a. Rename it to `.ts` or `.tsx`.
     b. Add type annotations for props, state, and functions.
     c. Ensure it compiles.

3. **Type Safety**:
   - Avoid `any` whenever possible.
   - Define interfaces for props and complex objects.

4. **Exceptions**:
   - Small, tactical bug fixes can remain in `.js` if necessary for speed, but migration is preferred.
