import { sql } from "@vercel/postgres";

export { sql };

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(16) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(128),
      content TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS access_log (
      id SERIAL PRIMARY KEY,
      ip_address VARCHAR(64),
      username VARCHAR(64),
      action VARCHAR(128),
      logged_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS secrets (
      id SERIAL PRIMARY KEY,
      label VARCHAR(64),
      value TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id SERIAL PRIMARY KEY,
      name TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Seed users (password = md5)
  // guest:guest123 => 6a29d43cb0abe1f2f6b4c9f7e82b2e1d (md5)
  // admin:s3cr3t_4dm1n_p4ss
  await sql`
    INSERT INTO users (username, password, role) VALUES
      ('guest',  md5('guest123'),           'user'),
      ('admin',  md5('s3cr3t_4dm1n_p4ss'),  'admin')
    ON CONFLICT (username) DO NOTHING
  `;

  await sql`
    INSERT INTO notes (user_id, title, content)
    SELECT u.id, 'Catatan pertama', 'Ini catatan pertama saya.'
    FROM users u WHERE u.username='guest'
    AND NOT EXISTS (SELECT 1 FROM notes WHERE user_id=u.id)
  `;
  await sql`
    INSERT INTO notes (user_id, title, content)
    SELECT u.id, 'Todo', 'Belajar hacking, ikut CTF, tidur.'
    FROM users u WHERE u.username='guest'
    AND (SELECT COUNT(*) FROM notes WHERE user_id=u.id) < 2
  `;
  await sql`
    INSERT INTO notes (user_id, title, content)
    SELECT u.id, 'Internal memo', 'Dashboard admin bisa diakses di /admin/. Kunci akses disimpan di cookie saat login.'
    FROM users u WHERE u.username='admin'
    AND NOT EXISTS (SELECT 1 FROM notes WHERE user_id=u.id)
  `;
  await sql`
    INSERT INTO notes (user_id, title, content)
    SELECT u.id, 'Security reminder', 'Jangan lupa update filter XSS di halaman feedback!'
    FROM users u WHERE u.username='admin'
    AND (SELECT COUNT(*) FROM notes WHERE user_id=u.id) < 2
  `;

  await sql`
    INSERT INTO access_log (ip_address, username, action) VALUES
      ('127.0.0.1',    'admin', 'login'),
      ('192.168.1.10', 'guest', 'view_note'),
      ('10.0.0.1',     'admin', 'view_dashboard')
    ON CONFLICT DO NOTHING
  `;

  await sql`
    INSERT INTO secrets (label, value) VALUES
      ('admin_xss_key', 'XSS_K3Y_8f3a9c'),
      ('flag',          'BakaCTF{Gam3_0v3r}')
    ON CONFLICT DO NOTHING
  `;
}
