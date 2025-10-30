/**
 * Fix a specific corrupted post by clearing invalid data
 *
 * This script will find posts with corrupted data (showing [object Object])
 * and reset those fields to empty strings so you can re-enter the correct data.
 *
 * To run:
 * npx sanity exec migrations/fix-corrupted-post.ts --with-user-token
 */

import { getCliClient } from 'sanity/cli';

const client = getCliClient();

// Function to check if a value is corrupted (contains [object Object])
const isCorrupted = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.includes('[object Object]');
  }
  if (Array.isArray(value)) {
    return value.some((item) => {
      if (typeof item?.value === 'string') {
        return item.value.includes('[object Object]');
      }
      return false;
    });
  }
  return false;
};

// Function to clean corrupted fields
const cleanField = (field: any) => {
  if (!field || !Array.isArray(field)) {
    return field;
  }

  return field.map((item) => {
    if (typeof item?.value === 'string' && item.value.includes('[object Object]')) {
      return {
        ...item,
        value: '', // Reset to empty string
      };
    }
    return item;
  });
};

const fixCorruptedPosts = async () => {
  console.log('🔍 Searching for corrupted posts...\n');

  try {
    // Fetch all posts
    const posts = await client.fetch(`
      *[_type == "post"] {
        _id,
        _rev,
        title,
        smallDescription,
        slug
      }
    `);

    console.log(`Found ${posts.length} posts to check`);

    const corruptedPosts = posts.filter((post: any) => {
      return (
        isCorrupted(post.title) ||
        isCorrupted(post.smallDescription)
      );
    });

    console.log(`\n📝 Found ${corruptedPosts.length} corrupted posts:\n`);

    if (corruptedPosts.length === 0) {
      console.log('✅ No corrupted posts found!');
      return;
    }

    // Show which posts are corrupted
    corruptedPosts.forEach((post: any) => {
      console.log(`  - ${post.slug?.current || post._id}`);
      if (isCorrupted(post.title)) {
        console.log(`    ⚠️  Title is corrupted`);
      }
      if (isCorrupted(post.smallDescription)) {
        console.log(`    ⚠️  Small Description is corrupted`);
      }
    });

    console.log('\n🔧 Fixing corrupted posts...\n');

    // Create transaction to fix posts
    const transaction = client.transaction();

    corruptedPosts.forEach((post: any) => {
      const patches: any = {};

      if (isCorrupted(post.title)) {
        patches.title = cleanField(post.title);
      }

      if (isCorrupted(post.smallDescription)) {
        patches.smallDescription = cleanField(post.smallDescription);
      }

      transaction.patch(post._id, {
        set: patches,
        ifRevisionID: post._rev,
      });
    });

    // Commit the transaction
    await transaction.commit();

    console.log(`✅ Successfully fixed ${corruptedPosts.length} posts!`);
    console.log('\nℹ️  Corrupted fields have been reset to empty strings.');
    console.log('   Please edit these posts in the Studio to add the correct content.\n');

    // List the posts that need manual editing
    console.log('Posts that need manual editing:');
    corruptedPosts.forEach((post: any) => {
      console.log(`  - ${post.slug?.current || post._id}`);
    });
  } catch (error) {
    console.error('❌ Failed to fix corrupted posts:', error);
    throw error;
  }
};

// Run the fix
fixCorruptedPosts()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fix failed:', error);
    process.exit(1);
  });
