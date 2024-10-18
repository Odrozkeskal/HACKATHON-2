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


// //JavaScript для поиска 


//    document.getElementById('searchForm').addEventListener('submit', function(e) {
//        e.preventDefault(); // Предотвращаем отправку формы

//        const query = document.getElementById('searchInput').value.toLowerCase();
//        const items = document.querySelectorAll('.medicine-item');
       
//        items.forEach(item => {
//            const title = item.querySelector('h2').textContent.toLowerCase();
//            const description = item.querySelector('p').textContent.toLowerCase();
           
//            // Проверка наличия ключевого слова в названии или описании
//            if (title.includes(query) || description.includes(query)) {
//                item.style.display = ''; // Показываем элемент
//                item.classList.add('highlight'); // Добавляем класс для выделения
//            } else {
//                item.style.display = 'none'; // Скрываем элемент
//                item.classList.remove('highlight'); // Удаляем класс выделения
//            }
//        });
//    });
document.getElementById('medicineForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const medicineName = document.getElementById('medicineName').value;
    
    fetch(`/medicine/search/product/${encodeURIComponent(medicineName)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('medicineResult');
            resultsContainer.innerHTML = ''; // Очистить предыдущие результаты
            
            data.forEach(medicine => {
                resultsContainer.innerHTML += `
                    <div class="medicine-item">
                        <h2>${medicine["Medicinal products"]}</h2>
                        <p><strong>ATC Classification:</strong> ${medicine["Anatomical, therapeutic and chemical classification (ATC)"]}</p>
                        <p><strong>Dosage Form:</strong> ${medicine["Dosage forms"]}</p>
                        <p><strong>ATC Code:</strong> ${medicine["ATC code"]}</p>
                        <p><strong>Product Name:</strong> ${medicine["Product name"]}</p>
                        <p><strong>Image:</strong> <img src="${medicine["Image of product"]}" alt="Product Image"></p>
                        <p><strong>Symptoms:</strong> ${medicine["symptoms"]}</p>
                        <p><strong>Description:</strong> ${medicine["Description"]}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Ошибка при запросе данных', error);
        });
});

document.getElementById('symptomsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const symptoms = document.getElementById('symptoms').value;
    
    fetch(`/medicine/search/symptoms/${encodeURIComponent(symptoms)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('medicineResult');
            resultsContainer.innerHTML = ''; // Очистить предыдущие результаты
            
            data.forEach(medicine => {
                resultsContainer.innerHTML += `
                    <div class="medicine-item">
                        <h2>${medicine["Product name"]}</h2>
                        <p><strong>ATC Classification:</strong> ${medicine["Anatomical, therapeutic and chemical classification (ATC)"]}</p>
                        <p><strong>Dosage Form:</strong> ${medicine["Dosage forms"]}</p>
                        <p><strong>ATC Code:</strong> ${medicine["ATC code"]}</p>
                        <p><strong>Product Name:</strong> ${medicine["Product name"]}</p>
                        <p><strong>Image:</strong> <img src="${medicine["Image of product"]}" alt="Product Image"></p>
                        <p><strong>Symptoms:</strong> ${medicine["symptoms"]}</p>
                        <p><strong>Description:</strong> ${medicine["Description"]}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Ошибка при запросе данных', error);
        });
});
    