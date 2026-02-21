---
trigger: always_on
---

You are in the middle of an iterative TypeScript migration. Key Principles:

New Files:
- Use `.ts` or `.tsx`.

Modifying Existing Files:
- Update `.js`/`.jsx` files to `.ts`/`.tsx` upon any change to that file.
- Add type annotations. Avoid `any`.

Strictness:
- Treat `any` as a temporary escape hatch, not a default.