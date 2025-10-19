/**
 * Migration script to convert existing post body fields to internationalized array format
 *
 * This script migrates the body field from the old blockContent format to the new
 * internationalized array format used by sanity-plugin-internationalized-array.
 *
 * Before running:
 * 1. Take a backup of your dataset
 * 2. Test on a development dataset first
 *
 * To run this migration:
 * npx sanity exec migrations/migrate-body-to-i18n.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

// The client must be created using the CLI config
const client = getCliClient();

// Migration configuration
const DOCUMENT_TYPE = 'post';
const FIELD_NAME = 'body';
const DEFAULT_LANGUAGE = 'en'; // Set the existing content to English by default

// Fetch documents that need migration
const fetchDocuments = () =>
  client.fetch(
    `*[_type == $docType && defined(${FIELD_NAME}) && !is_array(${FIELD_NAME}[0]._key)] {
      _id,
      _rev,
      ${FIELD_NAME}
    }`,
    { docType: DOCUMENT_TYPE }
  );

// Transform the body field to internationalized array format
const migrateDocument = (doc: any) => {
  // If body is already an array with _key properties, skip it
  if (Array.isArray(doc[FIELD_NAME]) && doc[FIELD_NAME][0]?._key) {
    console.log(`Skipping ${doc._id} - already migrated`);
    return null;
  }

  // If body is empty or null, skip it
  if (!doc[FIELD_NAME] || (Array.isArray(doc[FIELD_NAME]) && doc[FIELD_NAME].length === 0)) {
    console.log(`Skipping ${doc._id} - empty body`);
    return null;
  }

  // Transform to internationalized array format
  const migratedBody = [
    {
      _key: DEFAULT_LANGUAGE,
      value: doc[FIELD_NAME],
    },
  ];

  return {
    id: doc._id,
    patch: {
      set: {
        [FIELD_NAME]: migratedBody,
      },
      // Optimistic locking
      ifRevisionID: doc._rev,
    },
  };
};

// Execute the migration
const migrate = async () => {
  console.log(`Starting migration of ${DOCUMENT_TYPE} documents...`);

  try {
    const documents = await fetchDocuments();
    console.log(`Found ${documents.length} documents to potentially migrate`);

    if (documents.length === 0) {
      console.log('No documents need migration. Exiting.');
      return;
    }

    // Process documents
    const migrations = documents
      .map(migrateDocument)
      .filter((migration): migration is NonNullable<typeof migration> => migration !== null);

    console.log(`Migrating ${migrations.length} documents...`);

    if (migrations.length === 0) {
      console.log('All documents are already migrated or have empty bodies.');
      return;
    }

    // Create a transaction
    const transaction = client.transaction();

    migrations.forEach(({ id, patch }) => {
      transaction.patch(id, patch);
    });

    // Commit the transaction
    const result = await transaction.commit();
    console.log(`✅ Successfully migrated ${migrations.length} documents`);
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run the migration
migrate()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
