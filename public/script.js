async function searchMedicine(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const medicineName = form.get('medicineName');

    try {
        const response = await fetch(`/medicine/search/product/${encodeURIComponent(medicineName)}`);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();

       
        if (data.length === 0) {
            document.getElementById('medicineResult').textContent = 'Препарат не найден';
            document.getElementById('drugInfo').innerHTML = ''; // Очистка старых данных
        } else {
            // Отображение информации из таблицы "List of medicines"
            const resultText = `
                This drug is: "${data[0]["Anatomical, therapeutic and chemical classification (ATC)"]}",
                It is called: "${data[0]["Medicinal products"]}",
                It's ATC code: ${data[0]["ATC code"]},
                it's medicinal form: ${data[0]["Dosage forms"]}
            `;
            document.getElementById('medicineResult').textContent = resultText;

            // Отображение информации из таблицы "Drag info"
            const drugInfo = data.map(drug => `
                <div>
                    <h3>${drug["Product name"]}</h3>
                    <img src="${drug["Image of product"]}" alt="${drug["Product name"]}" style="max-width: 200px; height: auto;">
                    <p>${drug["Description"]}</p>
                </div>
            `).join('');
            document.getElementById('drugInfo').innerHTML = drugInfo;
        }
    } catch (error) {
        console.error('Error:', error.message);
        document.getElementById('medicineResult').textContent = 'Request error';
        document.getElementById('drugInfo').innerHTML = ''; // Очистка старых данных
    }
}

// Функция для поиска лекарства по симптомам
async function searchBySymptoms(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const symptoms = form.get('symptoms');

    try {
        const response = await fetch(`/medicine/search/symptoms/${encodeURIComponent(symptoms)}`);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();

        // Проверка наличия данных
        if (data.length === 0) {
            document.getElementById('drugInfo').innerHTML = 'Препарат не найден';
        } else {
            const drugInfo = data.map(drug => `
                <div>
                    <h3>${drug["Product name"]}</h3>
                    <img src="${drug["Image of product"]}" alt="${drug["Product name"]}" style="max-width: 200px; height: auto;">
                    <p>${drug["Description"]}</p>
                </div>
            `).join('');
            document.getElementById('drugInfo').innerHTML = drugInfo;
        }
    } catch (error) {
        console.error('Ошибка:', error.message);
        document.getElementById('drugInfo').innerHTML = 'Произошла ошибка при выполнении запроса';
    }
}

// Присваиваем обработчик событий для формы поиска по названию препарата
document.getElementById('medicineForm').addEventListener('submit', searchMedicine);

// Присваиваем обработчик событий для формы поиска по симптомам
document.getElementById('symptomsForm').addEventListener('submit', searchBySymptoms);
