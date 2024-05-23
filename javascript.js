// LEAFLET JS
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    zoomControl: false, // Entfernt die Zoom-Steuerung
    attributionControl: false // Entfernt das Leaflet Logo unten rechts
    
});

var ring = L.icon({
    iconUrl: 'fragen/quizmap v.1/icons/icon_ring.png',
    iconSize: [120, 120],
    iconAnchor: [60, 60],
    popupAnchor: [-3, -76]
});

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('fragen/quizmap v.1/background/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Grundausrichtung mittig, Zoom Level 1
map.setView([750, 750], 1);



// Infomarker
var customPopupInfo = "<div class='custom-popup'>Wie wird gespielt? \r \n Ziehe an der Netzwerkkarte. Wenn du einen der Knotenpunkte antippst, erscheint ein Quizfenster. Errate die richtigen Antworten und sammle so viele Bagels wie möglich! \r Wenn du die Seite schliesst, verlierst du deine Bagels.</div>";

L.marker([910, 780], { icon: ring }).addTo(map).bindPopup(customPopupInfo, {
    className: 'custom-popup'
}).openPopup();


// Score-Element initialisieren
var scoreElement = document.getElementById('score');
if (scoreElement.innerText.trim() === '') {
    var score = 0;
    scoreElement.innerText = score;
} else {
    // Score value extrahieren
    var score = parseInt(scoreElement.innerText);
}

// Funktion zur Aktualisierung des Scores
function updateScore() {
    score++;
    scoreElement.innerText = score;
}



// Funktion Quizmarker Standard
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

        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        // Überprüfen, ob das zusätzliche Bild bereits hinzugefügt wurde
        if (questionId === 'frage2' && !additionalImage && sessionStorage.getItem('additionalImageAdded-' + questionId) === 'true') {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Data aus Die Goonies.jpg';
            additionalImage.style.width = '50%';
            additionalImage.style.height = 'auto';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    });
}

// Frage 1 - Erste Antwort ist korrekt
addQuizMarker(525, 820, 'Auf wen spielt Waymonds Gürteltasche an?', ['Data aus Die Goonies', 'Penny aus Inspector Gadget', 'Peter aus Ghostbusters'], 0, 'fragen/quizmap v.1/bilder/Frage2.png', 'frage2');

// Funktion zum Speichern der Antworten und Hinzufügen des zusätzlichen Bildes
function handleAnswer(selectedAnswerId, isCorrect, correctAnswerIndex, questionId) {
    var selectedAnswer = document.getElementById(selectedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (isCorrect) {
        selectedAnswer.style.backgroundColor = '#30D3B6';
        updateScore(); // Aktualisiere den Score bei richtiger Antwort
    } else {
        selectedAnswer.style.backgroundColor = '#EC872A';
        correctAnswer.style.backgroundColor = '#30D3B6';
    }

    // Antworten speichern
    sessionStorage.setItem('quiz-' + questionId, selectedAnswerId);

    // Deaktivieren der Knöpfe nach Antwort
    var buttons = document.querySelectorAll(`#quiz-${questionId} .answer`);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 2
    if (questionId === 'frage2') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Data aus Die Goonies.jpg';
            additionalImage.style.width = '50%';
            additionalImage.style.height = 'auto';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
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

    // Alle Knöpfe deaktivieren
    var buttons = document.querySelectorAll(`#quiz-${questionId} .answer`);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 2
    if (questionId === 'frage2') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Data aus Die Goonies.jpg';
            additionalImage.style.width = '50%';
            additionalImage.style.height = 'auto';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 3
    if (questionId === 'frage3') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/SpaceOdyssey.jpg';
            additionalImage.style.width = '50%';
            additionalImage.style.height = 'auto';
            additionalImage.style.marginTop = '100px';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }
}



// Funktion Quizmarker mit Sound
function addQuizMarkerSound(lat, lng, question, answers, correctAnswerIndex, imageUrl, questionId, soundUrl) {
    var quizContent = `
        <div id="quiz-${questionId}">
            <img src="${imageUrl}" alt="Quiz Image" style="width: 100%; height: auto;">
            <p>${question}</p>
            <button id="answer1-${questionId}" class="answer">${answers[0]}</button>
            <button id="answer2-${questionId}" class="answer">${answers[1]}</button>
            <button id="answer3-${questionId}" class="answer">${answers[2]}</button>
            <button id="sound-${questionId}" class="sound">Sound abspielen</button>
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
        document.getElementById(`sound-${questionId}`).addEventListener('click', function () {
            var audio = new Audio(soundUrl);
            audio.play();
        });
    });
}

// Frage 2 - Erste Antwort ist korrekt
addQuizMarkerSound(703, 600, 'Zu welchem Game gehört dieser Soundeffekt?', ['Metroid', 'Super Smash Bros.', 'Metal Gear Solid'], 1, 'fragen/quizmap v.1/bilder/Frage1.png', 'frage1', 'fragen/quizmap v.1/audio/SuperSmashBros.mp3');


// Funktion Quizmarker mit Video
function addQuizMarkerVideo(lat, lng, question, answers, correctAnswerIndex, videoUrl, questionId) {
    var quizContent = `
        <div id="quiz-${questionId}">
            <video id="video-${questionId}" controls style="width: 100%; height: auto;">
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
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

            // Video-Pause-Handling
            var video = document.getElementById(`video-${questionId}`);
            video.addEventListener('click', function () {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }
    });
}

// Frage 3 - Dritte Antwort ist korrekt
addQuizMarkerVideo(390, 1273, 'Aus welchem Film stammt diese Szene ursprünglich?', ['King Kong', 'Planet der Affen', '2001: Odyssee im Weltraum'], 2, 'fragen/quizmap v.1/video/SpaceOdyssey.mp4', 'frage3');