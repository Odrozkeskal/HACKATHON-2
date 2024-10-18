const bcrypt = require('bcryptjs');
const pool = require('./public/db'); 

async function hashAndUpdatePassword(username, plainPassword) {
    try {
        // Хэшируем пароль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        
        // Обновляем запись в базе данных
        await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);
        
        console.log('Password has been hashed and updated in the database');
    } catch (err) {
        console.error('Error updating password:', err);
    }
}

hashAndUpdatePassword('admin', 'adminpassword'); 