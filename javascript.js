// STARTSCREEN 

document.addEventListener('DOMContentLoaded', function() {
    var introVideo = document.getElementById('introVideo');
    var map = document.getElementById('map');
    var score = document.getElementById('score');
    var bagel = document.getElementById('bagel');

    // Verstecke Karte, Punktzahl und Bagel beim Laden der Seite
    map.style.display = 'none';
    score.style.display = 'none';
    bagel.style.display = 'none';

    // Fallback: Zeige den Inhalt nach einer bestimmten Zeit
    setTimeout(function() {
        showContent();
    }, 17000); // 17 Sekunden

    // Sobald das Video beendet ist, zeige den Inhalt an
    introVideo.addEventListener('ended', showContent);

    // Funktion zum Anzeigen des Inhalts
    function showContent() {
        // Zeige Karte, Punktzahl und Bagel
        map.style.display = 'block';
        score.style.display = 'block';
        bagel.style.display = 'block';

        // Verstecke den Startbildschirm
        var startscreen = document.getElementById('startscreen');
        startscreen.style.display = 'none';
    }

    // Versuche, das Video zu starten
    introVideo.play().catch(function(error) {
        console.log("Video konnte nicht automatisch gestartet werden:", error);
        showContent(); // Zeige den Inhalt sofort, falls das Video nicht abgespielt werden kann
    });
});



// LEAFLET JS
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    zoomControl: false, // Entfernt die Zoom-Steuerung
    attributionControl: false, // Entfernt das Leaflet Logo unten rechts
    //scrollWheelZoom: false,
    //touchZoom: false,
    maxZoom: 3,
    minZoom: 1,
});

var ring = L.icon({
    iconUrl: 'fragen/quizmap v.1/icons/icon_ring.png',
    iconSize: [120, 120],
    iconAnchor: [60, 60],
    popupAnchor: [-3, -76],
});

//ÄNDERUNG
var completedIcon = L.icon({
    iconUrl: 'fragen/quizmap v.1/icons/icon_ring_cleared.png',
    iconSize: [120, 120],
    iconAnchor: [60, 60],
    popupAnchor: [-3, -76],
});

var wrongIcon = L.icon({
    iconUrl: 'fragen/quizmap v.1/icons/icon_ring_wrong.png',
    iconSize: [120, 120],
    iconAnchor: [60, 60],
    popupAnchor: [-3, -76],
});

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('fragen/quizmap v.1/background/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Grundausrichtung mittig, Zoom Level 1
map.setView([750, 750], 2);

// Infomarker
var customPopupInfo = "<div class='custom-popup'>Everything Everywhere All at Once </br> Kennst du alle Filmreferenzen? </br></br> Wie wird gespielt? </br> </br> Ziehe an der Netzwerkkarte. Wenn du einen der Knotenpunkte antippst, erscheint ein Quizfenster. Errate die richtigen Antworten und sammle so viele Bagels wie möglich! </br> </br> Wenn du die Seite schliesst, verlierst du deine Bagels.</div>";

L.marker([819, 761.5], { icon: ring }).addTo(map).bindPopup(customPopupInfo, {
    className: 'custom-popup'
})

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

//ÄNDERUNG
// Funktion zum Aktualisieren des Marker-Icons je nach Antwort
function updateMarkerIcon(marker, isCorrect) {
    if (isCorrect) {
        marker.setIcon(completedIcon); // Icon für richtige Antwort verwenden
    } else {
        marker.setIcon(wrongIcon); // Icon für falsche Antwort verwenden
    }
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
                handleAnswer(`answer1-${questionId}`, correctAnswerIndex === 0, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer2-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer2-${questionId}`, correctAnswerIndex === 1, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer3-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer3-${questionId}`, correctAnswerIndex === 2, correctAnswerIndex, questionId, marker);
            });
        }

        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        // Überprüfen, ob das zusätzliche Bild bereits hinzugefügt wurde
        if (questionId === 'frage2' && !additionalImage && sessionStorage.getItem('additionalImageAdded-' + questionId) === 'true') {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Data aus Die Goonies.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    });
}

// Frage 1 - Erste Antwort ist korrekt
addQuizMarker(653, 780.5, 'Auf wen spielt Waymonds Gürteltasche an?', ['Data aus Die Goonies', 'Peter aus Ghostbusters', 'Penny aus Inspector Gadget'], 0, 'fragen/quizmap v.1/bilder/Frage2.png', 'frage2');

// Frage 4 - Dritte Antwort ist korrekt
addQuizMarker(803.5, 1062, 'Auf was spielen der Bagel und das Googly-Eye an?', ['Gut und Böse', 'Tag und Nacht', 'Yin und Yang'], 2, 'fragen/quizmap v.1/bilder/Frage4.jpg', 'frage4');

// Frage 5 - Zweite Antwort ist korrekt
addQuizMarker(1039, 751.5, 'In welchem alternativen Universum lernt Evelyn Kung Fu wie Neo, was eine Anspielung auf eine ähnliche Szene in einem anderen Film darstellt?', ['Crouching Tiger, Hidden Dragon', 'The Matrix', 'Enter the Dragon'], 1, 'fragen/quizmap v.1/bilder/Frage5.png', 'frage5');

// Frage 6 - Zweite Antwort ist korrekt
addQuizMarker(508, 553, 'Auf welchen legendären Kung Fu Meister spielt dieser Charakter an?', ['Zenmeister aus Fist of Zen', 'Pai Mei aus Kill Bill', 'Shifu aus Kung Fu Panda'], 1, 'fragen/quizmap v.1/bilder/Frage6.png', 'frage6');


// Funktion zum Speichern der Antworten und Hinzufügen des zusätzlichen Bildes
function handleAnswer(selectedAnswerId, isCorrect, correctAnswerIndex, questionId, marker) { //ÄNDERUNG: Marker hinzufügen
    var selectedAnswer = document.getElementById(selectedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (isCorrect) {
        selectedAnswer.style.backgroundColor = '#64e1c2';
        updateScore(); // Aktualisiere den Score bei richtiger Antwort
    } else {
        selectedAnswer.style.backgroundColor = '#ad9ce9';
        correctAnswer.style.backgroundColor = '#64e1c2';
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

            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 3
    if (questionId === 'frage3') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/SpaceOdyssey.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 4
    if (questionId === 'frage4') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/yin und yang.png';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 5
    if (questionId === 'frage5') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/The Matrix.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 6
    if (questionId === 'frage6') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/kill bill pai mei.png';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);

            // Markiere, dass das zusätzliche Bild hinzugefügt wurde
            sessionStorage.setItem('additionalImageAdded-' + questionId, 'true');
        }
    }

    //ÄNDERUNG
    // Update the marker icon after answering the question
    updateMarkerIcon(marker, isCorrect);
}

function displayStoredAnswer(questionId, correctAnswerIndex) {
    var storedAnswerId = sessionStorage.getItem('quiz-' + questionId);
    var selectedAnswer = document.getElementById(storedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (storedAnswerId === `answer${correctAnswerIndex + 1}-${questionId}`) {
        selectedAnswer.style.backgroundColor = '#64e1c2';
    } else {
        selectedAnswer.style.backgroundColor = '#ad9ce9';
        correctAnswer.style.backgroundColor = '#64e1c2';
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
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 4
    if (questionId === 'frage4') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/yin und yang.png';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 5
    if (questionId === 'frage5') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/The Matrix.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 6
    if (questionId === 'frage6') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/kill bill pai mei.png';
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
                handleAnswer(`answer1-${questionId}`, correctAnswerIndex === 0, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer2-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer2-${questionId}`, correctAnswerIndex === 1, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer3-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer3-${questionId}`, correctAnswerIndex === 2, correctAnswerIndex, questionId, marker);
            });
        }
        document.getElementById(`sound-${questionId}`).addEventListener('click', function () {
            var audio = new Audio(soundUrl);
            audio.play();
            audio.volume = 0.3;
        });
    });
}

// Frage 2 - Erste Antwort ist korrekt
addQuizMarkerSound(730.5, 687.5, 'Zu welchem Game gehört dieser Soundeffekt?', ['Metroid', 'Super Smash Bros.', 'Metal Gear Solid'], 1, 'fragen/quizmap v.1/bilder/Frage1.png', 'frage1', 'fragen/quizmap v.1/audio/SuperSmashBros.mp3');

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
                handleAnswer(`answer1-${questionId}`, correctAnswerIndex === 0, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer2-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer2-${questionId}`, correctAnswerIndex === 1, correctAnswerIndex, questionId, marker);
            });
            document.getElementById(`answer3-${questionId}`).addEventListener('click', function () {
                handleAnswer(`answer3-${questionId}`, correctAnswerIndex === 2, correctAnswerIndex, questionId, marker);
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
addQuizMarkerVideo(593, 966.5, 'Aus welchem Film stammt diese Szene ursprünglich?', ['King Kong', 'Planet der Affen', '2001: Odyssee im Weltraum'], 2, 'fragen/quizmap v.1/video/SpaceOdyssey.mp4', 'frage3');
