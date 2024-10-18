// const bcrypt = require('bcryptjs');
// const pool = require('./public/db'); 

// async function checkPassword(username, password) {
//     try {
//         const result = await pool.query('SELECT password FROM users WHERE username = $1', [username]);
//         const user = result.rows[0];

//         if (!user) {
//             console.log('User not found');
//             return;
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log(`Password match: ${isMatch}`);
//     } catch (err) {
//         console.error('Error checking password:', err);
//     }
// }

// checkPassword('admin', 'adminpassword');