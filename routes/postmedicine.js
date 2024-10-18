const express = require('express');
const router = express.Router();
const pool = require('../public/db');

// GET запрос для отображения формы добавления лекарства
router.get('/', (req, res) => {
    res.render('addmedicine');
});

router.post('/add', async (req, res) => {
    const { atcClassification, medicinalProducts, dosageForms, atcCode, productName, imageOfProduct, symptoms, description } = req.body;

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
