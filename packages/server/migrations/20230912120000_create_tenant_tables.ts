import { Knex } from 'knex';

export async function up(knex: Knex, tenantId: string): Promise<void> {
  const schema = `tenant_${tenantId}`;

  await knex.raw(`create schema if not exists ${schema}`);

  await knex.schema.withSchema(schema).createTable('lead', (table) => {
    table.uuid('id').primary();
    table.string('phone');
    table.text('source');
    table.text('status');
    table.jsonb('metadata');
    table.uuid('assigned_to');
    table.specificType('tags', 'text[]');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.withSchema(schema).createTable('facebook_assets', (table) => {
    table.bigInteger('page_id').primary();
    table.bigInteger('ad_account_id');
    table.bigInteger('pixel_id');
    table.text('access_token');
    table.timestamp('connected_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.raw(`alter table ${schema}.lead enable row level security`);
  await knex.raw(`alter table ${schema}.facebook_assets enable row level security`);
  await knex.raw(`create policy tenant_access on ${schema}.lead using (true)`);
  await knex.raw(`create policy tenant_access on ${schema}.facebook_assets using (true)`);
  await knex.raw(`create role if not exists tenant_rw`);
  await knex.raw(`create role if not exists tenant_ro`);
}

export async function down(knex: Knex, tenantId: string): Promise<void> {
  const schema = `tenant_${tenantId}`;
  await knex.schema.withSchema(schema).dropTableIfExists('facebook_assets');
  await knex.schema.withSchema(schema).dropTableIfExists('lead');
}
