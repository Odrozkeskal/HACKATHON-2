const express = require('express');
const path = require('path');
const pool = require('./public/db'); 
const medicineRouter = require('./routes/medicine');
const addingRouter = require('./routes/postmedicine');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'))); 

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connection to PostgreSQL', err);
    } else {
        console.log('Connection to PostgreSQL successful');
    }
});


app.use('/medicine', medicineRouter);
app.use('/add', addingRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});


app.listen(PORT, () => {
    console.log(`Server runs on: http://localhost:${PORT}`);
});