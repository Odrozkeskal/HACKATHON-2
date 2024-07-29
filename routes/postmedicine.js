// const express = require('express');
// const router = express.Router();
// const pool = require('../public/db');

// router.get('/', (req, res) => {
//     res.render('addmedicine'); // Убедитесь, что ваш файл EJS называется `addmedicine.ejs` и находится в папке `views`
// });

// router.post('/add', (req, res) => {
//     const { atcClassification, medicinalProducts, dosageForms, atcCode } = req.body;

//     const queryString = `
//         INSERT INTO "List of medicines" ("Anatomical, therapeutic and chemical classification (ATC)", "Medicinal products", "Dosage forms", "ATC code")
//         VALUES ($1, $2, $3, $4)
//         RETURNING *
//     `;
//     const values = [atcClassification, medicinalProducts, dosageForms, atcCode];

//     pool.query(queryString, values, (err, result) => {
//         if (err) {
//             console.error('Ошибка выполнения запроса', err);
//             res.status(500).send('Ошибка сервера');
//             return;
//         }
//         res.redirect('/medicine');
//     });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../public/db');

// GET запрос для отображения формы добавления лекарства
router.get('/', (req, res) => {
    res.render('addmedicine'); // Убедитесь, что ваш файл EJS называется `addmedicine.ejs` и находится в папке `views`
});

router.post('/add', async (req, res) => {
    const { atcClassification, medicinalProducts, dosageForms, atcCode, productName, imageOfProduct, symptoms, description } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const insertListQuery = `
            INSERT INTO "List of medicines" ("Anatomical, therapeutic and chemical classification (ATC)", "Medicinal products", "Dosage forms", "ATC code")
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const listValues = [atcClassification, medicinalProducts, dosageForms, atcCode];
        const listResult = await client.query(insertListQuery, listValues);
        const medicineId = listResult.rows[0].id;

        const insertDragInfoQuery = `
            INSERT INTO "Drag info" ("Product name", "Image of product", "symptoms", "Description")
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const dragInfoValues = [productName, imageOfProduct, symptoms, description];
        await client.query(insertDragInfoQuery, dragInfoValues);

        await client.query('COMMIT');
        res.redirect('/medicine');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Ошибка выполнения запроса', err);
        res.status(500).send('Ошибка сервера');
    } finally {
        client.release();
    }
});

module.exports = router;
