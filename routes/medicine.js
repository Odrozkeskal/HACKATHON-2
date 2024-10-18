const express = require('express');
const router = express.Router();
const pool = require('../public/db');

// GET запрос для получения списка лекарств
router.get('/', async (req, res) => {
    try {
        const queryString = `SELECT * FROM "Medicines"`;
        const result = await pool.query(queryString);
        res.render('medicinelist', { medicines: result.rows });
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// GET запрос для получения лекарства по ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    const queryString = `SELECT * FROM "Medicines" WHERE id = $1`;

    try {
        const result = await pool.query(queryString, [id]);
        if (result.rows.length === 0) {
            res.status(404).send('Лекарство не найдено');
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Ошибка выполнения запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// GET запрос для поиска лекарства по названию
router.get('/search/product/:productName', async (req, res) => {
    const productName = req.params.productName;

    const queryString = `
        SELECT * FROM "Medicines"
        WHERE "Medicinal products" ILIKE $1
    `;
    const values = [`%${productName}%`];

    try {
        const result = await pool.query(queryString, values);
        if (result.rows.length === 0) {
            res.status(404).send('Лекарство не найдено');
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса', error);
        res.status(500).send('Ошибка сервера');
    }
});

// POST запрос для обновления лекарства
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { 
        atcClassification, 
        medicinalProducts, 
        dosageForms, 
        atcCode, 
        productName, 
        imageOfProduct, 
        symptoms, 
        description 
    } = req.body;

    const updateQuery = `
        UPDATE "Medicines"
        SET 
            "Anatomical, therapeutic and chemical classification (ATC)" = $1,
            "Medicinal products" = $2,
            "Dosage forms" = $3,
            "ATC code" = $4,
            "Product name" = $5,
            "Image of product" = $6,
            "symptoms" = $7,
            "Description" = $8
        WHERE id = $9
    `;
    const values = [atcClassification, medicinalProducts, dosageForms, atcCode, productName, imageOfProduct, symptoms, description, id];

    try {
        await pool.query(updateQuery, values);
        res.redirect('/medicine');
    } catch (err) {
        console.error('Ошибка выполнения запроса', err);
        res.status(500).send('Ошибка сервера');
    }
});

// GET запрос для поиска лекарства по симптомам
router.get('/search/symptoms/:symptoms', async (req, res) => {
    const symptoms = req.params.symptoms;

    const queryString = `
        SELECT * FROM "Medicines"
        WHERE "symptoms" ILIKE $1
    `;
    const values = [`%${symptoms}%`];

    try {
        const result = await pool.query(queryString, values);
        if (result.rows.length === 0) {
            res.status(404).send('Препарат не найден');
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Ошибка выполнения запроса', error);
        res.status(500).send('Ошибка сервера');
    }
});

// GET запрос для отображения формы добавления лекарства
router.get('/add', (req, res) => {
    res.render('addmedicine');
});

// POST запрос для добавления нового лекарства
router.post('/add', async (req, res) => {
    const { 
        atcClassification, 
        medicinalProducts, 
        dosageForms, 
        atcCode, 
        productName, 
        imageOfProduct, 
        symptoms, 
        description 
    } = req.body;

    const insertQuery = `
        INSERT INTO "Medicines" (
            "Anatomical, therapeutic and chemical classification (ATC)", 
            "Medicinal products", 
            "Dosage forms", 
            "ATC code", 
            "Product name", 
            "Image of product", 
            "symptoms", 
            "Description"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    const values = [atcClassification, medicinalProducts, dosageForms, atcCode, productName, imageOfProduct, symptoms, description];

    try {
        await pool.query(insertQuery, values);
        res.redirect('/medicine');
    } catch (err) {
        console.error('Ошибка выполнения запроса', err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;
