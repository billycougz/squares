---
trigger: always_on
---

### 🚨 STRICT PROHIBITION
You MUST NEVER use the `browser_subagent` or any browser-related tools (verification, investigation, research) without **explicit, case-by-case permission** from the user. There are NO exceptions for "obvious" verification or "necessary" debugging.

### Key Principles:

1. **Explicit Permission Only**:
   - Only launch the browser if the user has said "Yes", "Proceed", or given a direct instruction to use the browser in the current task.
   - If the user has not explicitly said "Use the browser", you DO NOT have permission.

2. **Mandatory Proposal Path**:
   - Before using the browser, you MUST describe exactly what you intend to do (e.g., "I'd like to use the browser to verify the layout fix on mobile portrait view").
   - You must then ask: "May I proceed with browser testing?"
   - You must WAIT for the user's response before calling any browser tools.

3. **Verification & Investigation**:
   - Even if you are 100% certain a bug exists or a fix is done, you cannot verify it via the browser without asking first.
   - **Unauthorized browser use is a violation of core project rules.**

4. **Prudence**:
   - Browser testing is time-intensive. Propose it only when manual local verification or unit testing is insufficient.