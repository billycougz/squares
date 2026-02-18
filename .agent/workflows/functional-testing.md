---
description: Test the application through the browser
---

1. Navigate to the landing page (`http://localhost:3000`).
2. Enter a **Board Name** (e.g., "Test Board").
3. **Phone Number Step**:
   - The phone number field is **OPTIONAL**. 
   - You can skip it entirely.
   - If you do verify it, use a 10-digit number (e.g., `5555555555`).
   - If automation fails on this input, verify the flow by skipping this field.
4. Click **Create Board**.
5. Wait for the redirect to the board page (URL containing `/squares`).
6. Verify the board grid renders.
7. Click on a square to verifying claiming functionality.