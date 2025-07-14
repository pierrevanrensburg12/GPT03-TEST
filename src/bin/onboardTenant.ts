import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import crypto from 'crypto';

const args = process.argv.slice(2);
const nameIndex = args.indexOf('--name');
if (nameIndex === -1 || !args[nameIndex + 1]) {
  console.error('Usage: ts-node onboardTenant.ts --name <TENANT_NAME>');
  process.exit(1);
}
const tenantName = args[nameIndex + 1];

const tenantsPath = resolve(__dirname, '../../data/tenants.json');
const adminsPath = resolve(__dirname, '../../data/admin_users.json');

const tenants = JSON.parse(readFileSync(tenantsPath, 'utf-8')) as Array<{id:number,name:string}>;
const nextId = tenants.length ? Math.max(...tenants.map(t => t.id)) + 1 : 1;

tenants.push({ id: nextId, name: tenantName });
writeFileSync(tenantsPath, JSON.stringify(tenants, null, 2));

// Placeholder for schema creation, roles, migrations
console.log(`Creating schema tenant_${nextId} ...`);
console.log('Running migrations...');

const password = crypto.randomBytes(8).toString('hex');
const admins = JSON.parse(readFileSync(adminsPath, 'utf-8')) as Array<any>;
admins.push({ tenantId: nextId, username: 'admin', password });
writeFileSync(adminsPath, JSON.stringify(admins, null, 2));

const loginUrl = `/login?tenant_id=${nextId}`;
const output = { tenant_id: nextId, login_url: loginUrl };
console.log(JSON.stringify(output, null, 2));
