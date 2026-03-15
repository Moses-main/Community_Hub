import 'dotenv/config';
import { pool } from '../server/db.js';
import bcrypt from 'bcrypt';

async function main() {
  const client = await pool.connect();
  try {
    // Step 1: Remove all existing super admins
    const deleted = await client.query(
      `DELETE FROM users WHERE is_super_admin = true RETURNING email`
    );
    console.log(`✅ Deleted ${deleted.rowCount} existing super admin(s):`,
      deleted.rows.map((r: any) => r.email));

    // Step 2: Create fresh super admin
    const password = 'SuperAdmin@2025';
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, is_admin, is_super_admin, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, true, NOW(), NOW())
       RETURNING id, email, first_name, last_name, is_admin, is_super_admin`,
      ['superadmin@wccrm.com', passwordHash, 'Super', 'Admin']
    );

    const user = result.rows[0];
    console.log('\n🎉 SuperAdmin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email       :', user.email);
    console.log('  Password    : SuperAdmin@2025');
    console.log('  ID          :', user.id);
    console.log('  is_admin    :', user.is_admin);
    console.log('  is_super_admin:', user.is_super_admin);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n→  Login at: http://localhost:3000/login');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
