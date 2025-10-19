# Sanity Content Migrations

This directory contains migration scripts to update your Sanity content schema.

## Current Migration: Internationalization

These scripts migrate existing content to use the `sanity-plugin-internationalized-array` format for multilingual support.

### What Gets Migrated

- **Posts**: `title`, `smallDescription`, `body`
- **Categories**: `title`, `description`
- **Authors**: `bio`

All existing content will be set to English (`en`) by default.

## Prerequisites

1. **Backup your dataset first!**
   ```bash
   npx sanity dataset export production backup.tar.gz
   ```

2. Make sure you have the Sanity CLI installed and are logged in:
   ```bash
   npm install -g @sanity/cli
   sanity login
   ```

## Running the Migration

### Option 1: Migrate All Fields (Recommended)

This will migrate all internationalized fields across all document types:

```bash
npx sanity exec migrations/migrate-all-i18n-fields.ts --with-user-token
```

### Option 2: Migrate Only Post Body Fields

If you only want to migrate the `body` field of posts:

```bash
npx sanity exec migrations/migrate-body-to-i18n.ts --with-user-token
```

## What the Migration Does

### Before Migration
```json
{
  "_type": "post",
  "title": "My Blog Post",
  "body": [
    {
      "_type": "block",
      "children": [...]
    }
  ]
}
```

### After Migration
```json
{
  "_type": "post",
  "title": [
    {
      "_key": "en",
      "value": "My Blog Post"
    }
  ],
  "body": [
    {
      "_key": "en",
      "value": [
        {
          "_type": "block",
          "children": [...]
        }
      ]
    }
  ]
}
```

## After Migration

1. **Verify the migration** in Sanity Studio at `http://localhost:3000/studio`
2. **Add translations** for Spanish by editing each document and adding Spanish content
3. The migration is **non-destructive** - it only adds the internationalization wrapper

## Adding Spanish Translations

After running the migration:

1. Open a post in Sanity Studio
2. You'll see the English content already filled in
3. Click "Add language" or the language selector
4. Add Spanish translations for each field
5. Save and publish

## Troubleshooting

### "Already migrated" messages
This is normal! The script skips documents that are already in the correct format.

### "Empty body" messages
The script skips documents with no content in the field being migrated.

### Migration fails midway
The script uses transactions, so failed migrations will be rolled back. Check the error message and fix the issue before re-running.

### Need to rollback?
Restore from your backup:
```bash
npx sanity dataset import backup.tar.gz production
```

## Support

If you encounter issues:
1. Check the Sanity Studio console for detailed error messages
2. Verify your schema matches the expected format
3. Ensure the plugin is properly configured in `sanity.config.ts`
