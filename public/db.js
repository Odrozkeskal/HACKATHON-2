const { Pool } = require('pg');

const pool = new Pool({
    user: 'pg',
    host: 'localhost',
    database: 'medicines',
    password: 'root',
    port: 5432
});

module.exports = pool;