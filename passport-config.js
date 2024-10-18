const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./public/db'); // Подключаем ваш модуль для работы с базой данных
require('./passport-config'); // Подключаем файл конфигурации Passport

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            console.log('Attempting login for:', username);
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return done(null, false, { message: 'Неправильное имя пользователя.' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return done(null, false, { message: 'Неправильный пароль.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Серилизация пользователя
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
});

// Десерилизация пользователя
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        console.log('Deserializing user:', user);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
