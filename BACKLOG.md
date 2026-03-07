# Squares Backlog

Architectural notes, tech debt, and future optimization opportunities.

---

## DynamoDB: Migrate to Atomic Update Expressions
**Priority**: Medium &nbsp; **Effort**: Large &nbsp; **Added**: 2026-03-05

`BoardModel.update()` does a full-item DynamoDB `put` (read → modify in memory → write entire object). This creates a read-modify-write race condition for all concurrent writes — two simultaneous square selections can cause one to silently overwrite the other.

**Current impact:**
- Square-vs-square race: the "loser" is notified their square was taken, so it's recoverable
- Name registration is bundled into `selectSquare` specifically to avoid amplifying this race (see `BoardService.selectSquare` comment). A separate `register-player` endpoint would double the write surface and risk silently reverting square selections

**Proposed fix:**
Use DynamoDB `UpdateExpression` + `ConditionExpression` for atomic, field-level writes:
```
UpdateExpression: 'SET gridData[#row][#col] = :value, players.#sym = :name'
ConditionExpression: 'attribute_not_exists(gridData[#row][#col])'
```

**Unlocks:**
- Separating name registration from square selection → better UX (immediate validation on save in dialog, not deferred to square click)
- Eliminates all read-modify-write races across the board
- Could also benefit `generateNumbers`, `setResult`, and `updateSettings`

---

## Result SMS: Winner Name Displays as `[object Object]`
**Priority**: Low &nbsp; **Effort**: Small &nbsp; **Added**: 2026-03-05

`setResult()` in `BoardService.ts` now includes the winner's name from `board.players` in the SMS notification. During testing, `board.players[winner]` returned a non-string value, causing `[object Object]` in the message. A type guard was added to fall back to symbol-only display, but the root cause is unknown.

**To investigate:**
- Check what `board.players` actually stores in DynamoDB for the affected board (could be a marshalling issue or legacy data shape)
- Determine whether the `[object Object]` was from the winner name or the team names (`board.teams.horizontal.name`)
- Once root cause is found, remove the type guard and fix the underlying data issue
