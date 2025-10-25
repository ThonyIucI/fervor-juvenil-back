# Update Database Context

Synchronize `context/db-structure.sql` with the latest migration files.

## Instructions

Read all migration files in `src/database/migrations/` and update `context/db-structure.sql` to reflect the current database schema.

### Steps:

1. **Read all migration files:**
   ```bash
   ls -la src/database/migrations/*.ts
   ```

2. **Analyze the latest migration:**
   - Read the most recent migration file
   - Extract table creations, alterations, and relationships

3. **Update context/db-structure.sql:**
   - Add new tables with their complete structure
   - Update modified tables
   - Add/update comments explaining table purposes
   - Ensure all foreign key relationships are documented
   - Update "Last updated" timestamp

4. **Validate the structure:**
   - Check that all tables have:
     - UUID primary key (v7 from backend)
     - Proper column types
     - Foreign key constraints
     - Indexes where appropriate
   - Ensure naming conventions:
     - Table names: plural, snake_case
     - Column names: English, snake_case
     - No Spanish names

5. **Add relationship summary:**
   - Document all relationships at the bottom
   - Format: `table_a (1) ←→ (N) table_b`

## Output

Show a diff of what changed in `context/db-structure.sql` and confirm the update was successful.

Example:
```
Updated context/db-structure.sql:
+ Added table: products
+ Added relationship: products (N) ←→ (1) categories
+ Updated users table: added avatar_url column
```
