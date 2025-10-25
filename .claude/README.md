# Claude Code Configuration

This directory contains Claude Code configuration files for this project.

## Directory Structure

```
.claude/
├── commands/              # Slash commands
│   ├── new-module.md     # /new-module - Create new module
│   ├── review-pr.md      # /review-pr - Review code before PR
│   ├── test-module.md    # /test-module - Generate tests
│   └── update-db-context.md  # /update-db-context - Sync DB schema
└── README.md             # This file
```

## How to Use

### Slash Commands

Type `/` in Claude Code chat to see available commands:

- `/new-module <name>` - Scaffold a new module with hexagonal architecture
- `/review-pr` - Review code before creating a Pull Request
- `/test-module <name>` - Generate comprehensive tests
- `/update-db-context` - Update context/db-structure.sql from migrations

### Creating Custom Commands

1. Create a new `.md` file in `.claude/commands/`
2. File name becomes the command (e.g., `my-command.md` → `/my-command`)
3. Write instructions for Claude in the file
4. Use markdown for formatting

### Example Custom Command

```markdown
# My Custom Command

Brief description of what this command does.

## Instructions

Step-by-step instructions for Claude to follow:

1. First, do this...
2. Then, do that...
3. Finally, output...
```

## Reference Files

Claude Code also reads these files automatically:

- `CLAUDE.md` - Main project conventions and standards
- `context/db-structure.sql` - Database schema reference
- `src/user/README.md` - Architecture example

## Documentation

For detailed usage instructions, see [CLAUDE_USAGE.md](../CLAUDE_USAGE.md)
