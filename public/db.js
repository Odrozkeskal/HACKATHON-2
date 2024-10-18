const { Pool } = require('pg');

// Строка подключения к базе данных Neon
const pool = new Pool({
    user: 'medicines_owner',
    host: 'ep-tight-fire-a2uwlm4w.eu-central-1.aws.neon.tech',
    database: 'medicines',
    password: 'fc5OxGyiAT4W',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;