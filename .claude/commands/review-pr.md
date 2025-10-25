# PR Review Preparation

Prepare the codebase for Pull Request review by checking standards, tests, and documentation.

## Instructions

Perform a comprehensive review of recent changes to ensure they meet project standards before creating a PR.

### Steps:

1. **Check Git Status:**
   - Run `git status` to see modified files
   - Run `git diff` to see changes

2. **Validate Code Standards:**
   - ✅ All TypeScript files follow naming conventions (kebab-case)
   - ✅ Imports are organized correctly (external → internal → relative)
   - ✅ No `any` types used
   - ✅ All functions have explicit return types
   - ✅ JSDoc comments on public methods

3. **Architecture Compliance:**
   - ✅ Hexagonal architecture followed (domain/application/infrastructure/presentation)
   - ✅ Pure domain entities (no ORM decorators)
   - ✅ Mappers used between domain and persistence
   - ✅ Controllers are thin (delegate to use cases)
   - ✅ One responsibility per class

4. **Database Changes:**
   - ✅ If schemas changed, migrations were created
   - ✅ Migration tested locally
   - ✅ `context/db-structure.sql` updated
   - ✅ All column names in English

5. **Testing:**
   - ✅ Unit tests for new use cases
   - ✅ Integration tests for repositories
   - ✅ Tests are passing: `npm run test`
   - ✅ Coverage meets minimum threshold: `npm run test:cov`

6. **Linting and Formatting:**
   - ✅ Run `npm run lint` - no errors
   - ✅ Run `npm run format` - code formatted

7. **Documentation:**
   - ✅ README updated if new module added
   - ✅ CLAUDE.md updated if new conventions added
   - ✅ Comments explain complex logic

8. **Create PR Checklist:**
   Generate a summary including:
   - List of modified files
   - Description of changes
   - Breaking changes (if any)
   - Migration commands needed
   - Testing instructions

## Output Format

Provide a summary like:

```markdown
## PR Summary

### Changes Made
- [List of features/fixes]

### Files Modified
- [List with brief description]

### Database Changes
- [Migrations, schema updates]

### Testing
- [How to test the changes]

### Checklist
- [ ] All tests passing
- [ ] Lint passing
- [ ] Migrations tested
- [ ] Documentation updated
- [ ] context/db-structure.sql updated
```

Then ask: "Would you like me to create the PR now?"
