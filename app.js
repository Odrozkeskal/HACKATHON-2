const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./public/db'); 
const medicineRouter = require('./routes/medicine');
const addingRouter = require('./routes/postmedicine');

const app = express();
const PORT = process.env.PORT || 3000;

// Установка движка шаблонов EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Middleware для парсинга данных
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public'))); 

// Настройка сессий
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Инициализация Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Инициализация connect-flash
app.use(flash());

// Конфигурация Passport.js
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Проверка роли пользователя
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied');
}

// Передача flash сообщений в шаблоны
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Маршруты
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Вы вышли из системы');
        res.redirect('/login');
    });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
});

// Применяем middleware проверки прав администратора
app.use('/add', ensureAdmin, addingRouter);
app.use('/medicine', medicineRouter);

// Подключение к PostgreSQL
pool.connect(err => {
    if (err) {
        console.error('Ошибка подключения к PostgreSQL:', err);
    } else {
        console.log('Подключение к PostgreSQL успешно');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер работает по адресу: http://localhost:${PORT}`);
});
