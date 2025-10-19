/**
 * Migration script to convert all text fields to internationalized array format
 *
 * This script migrates title, smallDescription, and body fields from the old format
 * to the new internationalized array format used by sanity-plugin-internationalized-array.
 *
 * Before running:
 * 1. Take a backup of your dataset
 * 2. Test on a development dataset first
 *
 * To run this migration:
 * npx sanity exec migrations/migrate-all-i18n-fields.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

const DEFAULT_LANGUAGE = 'en';

// Define which fields to migrate for each document type
const MIGRATIONS = [
  {
    type: 'post',
    fields: ['title', 'smallDescription', 'body'],
  },
  {
    type: 'category',
    fields: ['title', 'description'],
  },
  {
    type: 'author',
    fields: ['bio'],
  },
];

// Check if a field is already in internationalized format
const isInternationalized = (value: any) => {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value[0]?._key &&
    value[0]?.value !== undefined
  );
};

// Transform a field value to internationalized array format
const internationalizeField = (value: any) => {
  // If already internationalized, return as-is
  if (isInternationalized(value)) {
    return null;
  }

  // If empty or null, skip
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  // Convert to internationalized format
  return [
    {
      _key: DEFAULT_LANGUAGE,
      value: value,
    },
  ];
};

// Fetch documents of a specific type
const fetchDocuments = (type: string) =>
  client.fetch(
    `*[_type == $type] {
      _id,
      _rev,
      ...
    }`,
    { type }
  );

// Process a single document
const processDocument = (doc: any, fields: string[]) => {
  const patches: Record<string, any> = {};
  let hasChanges = false;

  // Process each field
  for (const field of fields) {
    if (doc[field] !== undefined) {
      const internationalizedValue = internationalizeField(doc[field]);
      if (internationalizedValue !== null) {
        patches[field] = internationalizedValue;
        hasChanges = true;
      }
    }
  }

  if (!hasChanges) {
    return null;
  }

  return {
    id: doc._id,
    patch: {
      set: patches,
      ifRevisionID: doc._rev,
    },
  };
};

// Execute migration for a specific document type
const migrateType = async (type: string, fields: string[]) => {
  console.log(`\n📝 Migrating ${type} documents...`);

  try {
    const documents = await fetchDocuments(type);
    console.log(`Found ${documents.length} ${type} documents`);

    if (documents.length === 0) {
      console.log(`No ${type} documents found`);
      return 0;
    }

    const migrations = documents
      .map((doc) => processDocument(doc, fields))
      .filter((migration): migration is NonNullable<typeof migration> => migration !== null);

    console.log(`Need to migrate ${migrations.length} ${type} documents`);

    if (migrations.length === 0) {
      console.log(`All ${type} documents are already migrated`);
      return 0;
    }

    // Create a transaction
    const transaction = client.transaction();

    migrations.forEach(({ id, patch }) => {
      transaction.patch(id, patch);
    });

    // Commit the transaction
    await transaction.commit();
    console.log(`✅ Successfully migrated ${migrations.length} ${type} documents`);

    return migrations.length;
  } catch (error) {
    console.error(`❌ Failed to migrate ${type}:`, error);
    throw error;
  }
};

// Run all migrations
const migrate = async () => {
  console.log('🚀 Starting internationalization migration...\n');
  console.log(`Default language: ${DEFAULT_LANGUAGE}`);

  let totalMigrated = 0;

  try {
    for (const { type, fields } of MIGRATIONS) {
      const count = await migrateType(type, fields);
      totalMigrated += count;
    }

    console.log(`\n✨ Migration completed successfully!`);
    console.log(`Total documents migrated: ${totalMigrated}`);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
};

// Run the migration
migrate()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
