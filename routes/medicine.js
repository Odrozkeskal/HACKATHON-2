const express = require('express');
const router = express.Router();
const pool = require('../public/db'); 

// GET запрос для получения списка лекарств
router.get('/', (req, res) => {
    pool.query('SELECT * FROM "List of medicines"', (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.render('medicinelist', { medicines: result.rows });
    });
});

// GET запрос для получения лекарства по ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM "List of medicines" WHERE id = $1', [id], (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса', err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        if (result.rows.length === 0) {
            res.status(404).send('Лекарство не найдено');
        } else {
            res.json(result.rows[0]);
        }
    });
});

// GET запрос для поиска лекарства по названию и вывода информации из обеих таблиц
router.get('/search/product/:productName', async (req, res) => {
    const productName = req.params.productName;
    console.log('Поиск лекарства по ключевому слову:', productName);

    const queryString = `
        SELECT 
            l."Anatomical, therapeutic and chemical classification (ATC)",
            l."Medicinal products",
            l."Dosage forms",
            l."ATC code",
            d."Product name",
            d."Image of product",
            d."symptoms",
            d."Description"
        FROM "List of medicines" l
        JOIN "Drag info" d ON l."Medicinal products" = d."Product name"
        WHERE l."Medicinal products" ILIKE $1
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

// GET запрос для поиска лекарства по симптому
router.get('/search/symptoms/:symptoms', async (req, res) => {
    const symptoms = req.params.symptoms;
    console.log('Поиск лекарства по симптомам:', symptoms);

    const queryString = `
        SELECT * FROM "Drag info"
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

// GET запрос для поиска лекарства по id
router.get('/search/:id', (req, res) => {
    const id = req.params.id; // Получаем значение параметра id из URL

    const queryString = `
        SELECT * FROM "List of medicines"
        WHERE id = $1
    `;
    const values = [id]; 

    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса', err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        if (result.rows.length === 0) {
            res.status(404).send('Лекарство не найдено');
        } else {
            res.json(result.rows[0]);
        }
    });
});

// GET запрос для поиска лекарства по ATC code
router.get('/search-by-atc/:atcCode', (req, res) => {
    const atcCode = req.params.atcCode; // Получаем код ATC из параметра URL

    const queryString = `
        SELECT * FROM "List of medicines"
        WHERE 
            "ATC code" ILIKE '%' || $1 || '%'
    `;
    const values = [atcCode]; // Параметры для подстановки в запрос

    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса', err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json(result.rows);
    });
});

// GET запрос для поиска лекарства по Anatomical, therapeutic and chemical classification (ATC)
router.get('/search-by-atc-classification/:atcClassification', (req, res) => {
    const atcClassification = req.params.atcClassification; // Получаем классификацию ATC из параметра URL

    const queryString = `
        SELECT * FROM "List of medicines"
        WHERE 
            "Anatomical, therapeutic and chemical classification (ATC)" ILIKE '%' || $1 || '%'
    `;
    const values = [atcClassification]; // Параметры для подстановки в запрос

    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса', err);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json(result.rows);
    });
});

// GET запрос для отображения формы добавления лекарства
router.get('/add', (req, res) => {
    res.render('addmedicine');
});


// // PUT запрос для обновления информации о лекарстве
// router.put('/:id', (req, res) => {
//     const id = req.params.id;
//     const { 
//         "Anatomical, therapeutic and chemical classification (ATC)": atcClassification,
//         "Medicinal products": medicinalProducts,
//         "Dosage forms": dosageForms,
//         "ATC code": atcCode 
//     } = req.body;
    
//     const query = {
//         text: 'UPDATE "List of medicines" SET "Anatomical, therapeutic and chemical classification (ATC)" = $1, "Medicinal products" = $2, "Dosage forms" = $3, "ATC code" = $4 WHERE id = $5',
//         values: [atcClassification, medicinalProducts, dosageForms, atcCode, id]
//     };

//     pool.query(query, (err, result) => {
//         if (err) {
//             console.error('Ошибка выполнения запроса', err);
//             res.status(400).send('Ошибка обновления лекарства');
//             return;
//         }
//         res.send('Информация о лекарстве обновлена');
//     });
// });
// Маршрут для получения данных лекарства для редактирования
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const medicineQuery = `
            SELECT 
                l.id,
                l."Anatomical, therapeutic and chemical classification (ATC)" AS "atcClassification",
                l."Medicinal products" AS "medicinalProducts",
                l."Dosage forms" AS "dosageForms",
                l."ATC code" AS "atcCode",
                d."Product name" AS "productName",
                d."Image of product" AS "imageOfProduct",
                d."symptoms",
                d."Description" AS "description"
            FROM "List of medicines" l
            JOIN "Drag info" d ON l."Medicinal products" = d."Product name"
            WHERE l.id = $1
        `;
        const values = [id];
        const result = await pool.query(medicineQuery, values);

        if (result.rows.length === 0) {
            res.status(404).send('Лекарство не найдено');
        } else {
            res.render('editmedicine', { medicine: result.rows[0] });
        }
    } catch (err) {
        console.error('Ошибка выполнения запроса', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для обновления лекарства
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { atcClassification, medicinalProducts, dosageForms, atcCode, productName, imageOfProduct, symptoms, description } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const updateListQuery = `
            UPDATE "List of medicines"
            SET "Anatomical, therapeutic and chemical classification (ATC)" = $1,
                "Medicinal products" = $2,
                "Dosage forms" = $3,
                "ATC code" = $4
            WHERE id = $5
        `;
        const listValues = [atcClassification, medicinalProducts, dosageForms, atcCode, id];
        await client.query(updateListQuery, listValues);

        const updateDragInfoQuery = `
            UPDATE "Drag info"
            SET "Image of product" = $1,
                "symptoms" = $2,
                "Description" = $3
            WHERE "Product name" = $4
        `;
        const dragInfoValues = [imageOfProduct, symptoms, description, medicinalProducts];
        await client.query(updateDragInfoQuery, dragInfoValues);

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
// DELETE запрос для удаления лекарства
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    
    const query = {
        text: 'DELETE FROM "List of medicines" WHERE id = $1',
        values: [id]
    };

    pool.query(query, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса', err);
            res.status(400).send('Ошибка удаления лекарства');
            return;
        }
        res.send('Лекарство успешно удалено');
    });
});

module.exports = router;
