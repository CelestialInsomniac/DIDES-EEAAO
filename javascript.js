// LEAFLET JS
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5
});

var ring = L.icon({
    iconUrl: 'images/test_leaflet map V1.0/icons/icon_ring.png',
    iconSize: [120, 120], // size of the icon
    iconAnchor: [60, 60], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('images/test_leaflet map V1.0/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Set the initial view to center of the image, and zoom level 1
map.setView([750, 750], 1);

var customPopupInfo = "<div class='custom-popup'>Wie wird gespielt? \r \n Ziehe die Netzwerkkarte. Wenn du einen Knotenpunkt anklickst, erscheint ein Quizfenster. Errate die richtige Antwort und sammle so viele Bagels wie möglich! \r Wenn du die Seite neu lädst, verlierst du deine Bagels.</div>";

// Infomarker
L.marker([910, 780], { icon: ring }).addTo(map).bindPopup(customPopupInfo, {
    className: 'custom-popup'
}).openPopup();

// Function to add a marker with a quiz
function addQuizMarker(lat, lng, question, answers, correctAnswerIndex, imageUrl, questionId) {
    var quizContent = `
        <div id="quiz-${questionId}">
            <img src="${imageUrl}" alt="Quiz Image" style="width: 100%; height: auto;">
            <p>${question}</p>
            <button id="answer1-${questionId}" class="answer">${answers[0]}</button>
            <button id="answer2-${questionId}" class="answer">${answers[1]}</button>
            <button id="answer3-${questionId}" class="answer">${answers[2]}</button>
        </div>
    `;

    var marker = L.marker([lat, lng], { icon: ring }).addTo(map)
        .bindPopup(quizContent, {
            className: 'custom-popup'
        });

    marker.on('popupopen', function () {
        if (sessionStorage.getItem('quiz-' + questionId) !== null) {
            displayStoredAnswer(questionId, correctAnswerIndex);
        } else {
            document.getElementById(`answer1-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer1-${questionId}`, correctAnswerIndex === 0, correctAnswerIndex, questionId);
            });
            document.getElementById(`answer2-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer2-${questionId}`, correctAnswerIndex === 1, correctAnswerIndex, questionId);
            });
            document.getElementById(`answer3-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer3-${questionId}`, correctAnswerIndex === 2, correctAnswerIndex, questionId);
            });
        }
    });
}

function handleAnswer(selectedAnswerId, isCorrect, correctAnswerIndex, questionId) {
    var selectedAnswer = document.getElementById(selectedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (isCorrect) {
        selectedAnswer.style.backgroundColor = '#30D3B6';
    } else {
        selectedAnswer.style.backgroundColor = '#EC872A';
        correctAnswer.style.backgroundColor = '#30D3B6';
    }

    // Store the answer
    sessionStorage.setItem('quiz-' + questionId, selectedAnswerId);

    // Deactivate all buttons after an answer
    var buttons = document.querySelectorAll(`#quiz-${questionId} .answer`);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function displayStoredAnswer(questionId, correctAnswerIndex) {
    var storedAnswerId = sessionStorage.getItem('quiz-' + questionId);
    var selectedAnswer = document.getElementById(storedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (storedAnswerId === `answer${correctAnswerIndex + 1}-${questionId}`) {
        selectedAnswer.style.backgroundColor = '#30D3B6';
    } else {
        selectedAnswer.style.backgroundColor = '#EC872A';
        correctAnswer.style.backgroundColor = '#30D3B6';
    }

    // Deactivate all buttons
    var buttons = document.querySelectorAll(`#quiz-${questionId} .answer`);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

// Quizmarkers
addQuizMarker(703, 600, 'Zu welchem Game gehört dieser Soundeffekt?', ['Super Smash Bros.', 'Metroid', 'Metal Gear Solid'], 0, 'images/test_leaflet map V1.0/fragen/Frage1.png', 'frage1');
addQuizMarker(525, 820, 'Auf wen spielt Waymonds Gürteltasche an?', ['Data aus Die Goonies', 'Penny aus Inspector Gadget ', 'Peter aus Ghostbusters'], 0, 'images/test_leaflet map V1.0/fragen/Frage2.png', 'frage2');