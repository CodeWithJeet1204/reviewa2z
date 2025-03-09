import { migrateArticlesToSEO, migrateProductsToSEO, migrateCategoriesToSEO } from '../src/utils/migrations/seoMigration';

async function runMigrations() {
  try {
    console.log('Starting SEO migrations...');

    // Run migrations in sequence
    console.log('Migrating articles...');
    await migrateArticlesToSEO();

    console.log('Migrating products...');
    await migrateProductsToSEO();

    console.log('Migrating categories...');
    await migrateCategoriesToSEO();

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 