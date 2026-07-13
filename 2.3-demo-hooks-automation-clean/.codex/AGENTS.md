# Hooks Automation Commands (Codex Conversion)

This file converts the three command workflows from `.claude/commands` into Codex project instructions.

## Command: review

When asked to review the project for quality:

1. Read all source files under `src/`.
2. Check security risks:
- unsanitized inputs
- missing auth checks
- exposed secrets
3. Check performance risks:
- N+1 query patterns
- missing indexes where relevant
- unbounded loops
- memory leaks
4. Check code style and maintainability:
- inconsistent naming
- missing error handling
- dead code
- missing types
5. Return this exact structure:

```markdown
## Code Review Summary

### Security
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Performance
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Code Style
| Severity | File | Issue | Suggestion |
|----------|------|-------|------------|
| ...      | ...  | ...   | ...        |

### Overall: PASS / NEEDS ATTENTION
```

Review rules:
- Severity levels: HIGH, MEDIUM, LOW.
- If no issues are found in a category, say "No issues found".
- Always include specific file paths and line numbers.

## Command: scaffold <feature_name>

When asked to scaffold a new feature module, treat `<feature_name>` as the provided argument.

1. Read `src/example-project/server.ts` to match existing route, error handling, and type patterns.
2. Create `src/example-project/<feature_name>.ts` that:
- exports an Express Router
- includes GET (list all), GET by ID, POST (create), PUT (update), DELETE
- follows the same error handling pattern as `server.ts`
- includes TypeScript interfaces for the resource
- uses in-memory `Map` storage matching existing patterns
3. Create `src/example-project/<feature_name>.test.ts` that:
- tests all CRUD operations
- tests error cases (404, 400)
- uses `supertest` and follows existing test style
4. Show how to wire the new router into `server.ts`, but do not auto-modify `server.ts` unless explicitly requested.

Scaffold success criteria:
- New files follow existing codebase patterns.
- Tests pass with `npx jest`.
- TypeScript compiles without errors.

## Command: verify

When asked to verify the project:

1. Run `npm test` and capture output.
2. Run `npm run lint` and capture output.
3. Return this exact format:

```markdown
## Verification Summary
- Tests: PASS / FAIL (X passed, Y failed)
- Lint: PASS / FAIL (X errors, Y warnings)
- Issues: [list any failures with file paths and suggested fixes]
```

Verify success criteria:
- All tests pass.
- Zero lint errors.
- If anything fails, include specific suggested fixes.
