---
trigger: always_on
---

1. **New Files**:
   - MUST use `.ts` or `.tsx`.
   - NEVER create new `.js` or `.jsx` files.

2. **Legacy Code (Boy Scout Rule)**:
   - If you modify a significant part of a `.js` file, you MUST migrate it to `.ts`/`.tsx`.
   - Add type annotations. Avoid `any`.

3. **Strictness**:
   - Treat `any` as a temporary escape hatch, not a default.