require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_DATABASE,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          ssl: { rejectUnauthorized: false } // Supabase requires SSL
});

async function checkConnection() {
          try {
                    await client.connect();
                    console.log("✅ MarketHub Database Connected Successfully!");

                    // Sirf time check kar rahe hain
                    const res = await client.query('SELECT NOW()');
                    console.log("🕒 Database Time:", res.rows[0].now);

          } catch (err) {
                    console.error("❌ Database Connection Failed:", err.message);
          } finally {
                    await client.end();
          }
}

checkConnection();