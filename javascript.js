// STARTSCREEN
document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.getElementById('introVideo');
    const contentDiv = document.getElementById('content');
    const startscreenDiv = document.getElementById('startscreen');
    const soundButton = document.getElementById('soundButton');

    // Event listener für die Benutzerinteraktion (Klick oder Tap)
    document.addEventListener('click', () => {
        // Video abspielen und Ton aktivieren
        introVideo.muted = false;
        introVideo.play().catch(error => {
            console.error('Fehler beim Abspielen des Videos:', error);
        });
    });

    // Event listener für das Ende des Videos
    introVideo.addEventListener('ended', () => {
        // Video-Element ausblenden
        startscreenDiv.style.display = 'none';
        // Inhalts-Div anzeigen
        contentDiv.style.display = 'block';
    });

    // Event listener für den Button-Klick
    soundButton.addEventListener('click', () => {
        // map.html öffnen
        window.location.href = 'map.html';
    });
});


// LEAFLET JS
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5,
    zoomControl: false, // Entfernt die Zoom-Steuerung
    attributionControl: false, // Entfernt das Leaflet Logo unten rechts
    scrollWheelZoom: false,
    touchZoom: false,
    //maxZoom: 3,
    //minZoom: 1,
});

var ring = L.icon({
    iconUrl: 'fragen/quizmap v.1/icons/icon_ring.png',
    iconSize: [120, 120],
    iconAnchor: [60, 60],
    popupAnchor: [-3, -76],
});

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
map.setView([750, 750], 3);

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
addQuizMarker(1039, 751.5, 'In welchem Film lernt ein Charakter auf ähnliche Weise wie Evelyn Kung Fu?', ['Crouching Tiger, Hidden Dragon', 'The Matrix', 'Enter the Dragon'], 1, 'fragen/quizmap v.1/bilder/Frage5.png', 'frage5');

// Frage 6 - Zweite Antwort ist korrekt
addQuizMarker(508, 553, 'Auf welchen legendären Kung Fu Meister spielt dieser Charakter an?', ['Zenmeister aus Fist of Zen', 'Pai Mei aus Kill Bill', 'Shifu aus Kung Fu Panda'], 1, 'fragen/quizmap v.1/bilder/Frage6.png', 'frage6');

// Frage 10 - Erste Antwort ist korrekt
addQuizMarker(935.5, 790, 'In welcher Weise ähnelt der Ansatz von EEAAO in Bezug auf Produktplatzierung dem des Films "Repo Man"?', ['Generische Bezeichnungen für Produkte wie "Soda" und "milk" anstelle von Markennamen.', 'Beide Filme verwenden eine Mischung aus generischen und spezifischen Produktbezeichnungen.', 'Beide Filme haben deutlich erkennbare Markenplatzierungen.'], 0, 'fragen/quizmap v.1/bilder/balm.png', 'frage10');


// Funktion zum Speichern der Antworten und Hinzufügen des zusätzlichen Bildes
function handleAnswer(selectedAnswerId, isCorrect, correctAnswerIndex, questionId, marker) { //ÄNDERUNG: Marker hinzufügen
    var selectedAnswer = document.getElementById(selectedAnswerId);
    var correctAnswer = document.querySelectorAll(`#quiz-${questionId} .answer`)[correctAnswerIndex];

    if (isCorrect) {
        selectedAnswer.style.backgroundColor = '#910000';
        updateScore(); // Aktualisiere den Score bei richtiger Antwort
    } else {
        selectedAnswer.style.backgroundColor = '#101010';
        correctAnswer.style.backgroundColor = '#910000';
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
        selectedAnswer.style.backgroundColor = '#910000';
    } else {
        selectedAnswer.style.backgroundColor = '#101010';
        correctAnswer.style.backgroundColor = '#910000';
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

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 8
    if (questionId === 'frage8') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Paprika.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

    // Zusätzliches Bild im Popup anzeigen, nur für Frage 9
    if (questionId === 'frage9') {
        var popupContent = document.querySelector(`#quiz-${questionId}`);
        var additionalImage = popupContent.querySelector('.additional-image');

        if (!additionalImage) {
            additionalImage = document.createElement('img');
            additionalImage.src = 'fragen/quizmap v.1/bilder/Elvis.jpg';
            additionalImage.classList.add('additional-image');
            popupContent.appendChild(additionalImage);
        }
    }

            // Zusätzliches Bild im Popup anzeigen, nur für Frage 10
            if (questionId === 'frage10') {
                var popupContent = document.querySelector(`#quiz-${questionId}`);
                var additionalImage = popupContent.querySelector('.additional-image');
        
                if (!additionalImage) {
                    additionalImage = document.createElement('img');
                    additionalImage.src = 'fragen/quizmap v.1/bilder/Ratatouille.jpg';
                    additionalImage.classList.add('additional-image');
                    popupContent.appendChild(additionalImage);
                }
            }

        // Zusätzliches Bild im Popup anzeigen, nur für Frage 12
        if (questionId === 'frage12') {
            var popupContent = document.querySelector(`#quiz-${questionId}`);
            var additionalImage = popupContent.querySelector('.additional-image');
    
            if (!additionalImage) {
                additionalImage = document.createElement('img');
                additionalImage.src = 'fragen/quizmap v.1/bilder/Repo_Man.jpg';
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

// Frage 11 - Dritte Antwort ist korrekt
addQuizMarkerSound(818.5, 886.5, 'Welcher Song wurde verwendet und über den gesamten Film verteilt immer wieder abgespielt?', ['Inside Out von Eve 6', 'If You Could Only See von Tonic', 'Absolutely (Story of a Girl) von Nine Days'], 2, 'fragen/quizmap v.1/bilder/EEAAO_Soundtracks2.jpg', 'frage11', 'fragen/quizmap v.1/audio/Nine Days - Absolutely (Story of a Girl).mp3');


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

// Frage 7 - Zweite Antwort ist korrekt
addQuizMarkerVideo(1017, 567, 'Woher Stammen diese Szenen?', ['Tiger and Dragon', 'Michelle Yeohs Auftritte auf dem roten Teppich', 'Sie wurden extra für den Film gedreht'], 1, 'fragen/quizmap v.1/video/EEAAO_Michelle Yeohs.mov', 'frage7');

// Frage 8 - Erste Antwort ist korrekt
addQuizMarkerVideo(1002.7, 966.5, 'In welchem Film gibt es eine solche Szene, in dem "Daniels" als Regisseur aufgeführt wird?', ['Paprika', 'Perfect Blue', 'Inception'], 0, 'fragen/quizmap v.1/video/MetaEnd.mp4', 'frage8');

// Frage 9 - Dritte Antwort ist korrekt
addQuizMarkerVideo(687, 527, 'Welche Musik-Ikone wird hier referenziert?', ['Madonna', 'Prince', 'Elvis Presley'], 2, 'fragen/quizmap v.1/video/Jobu Tupaki.mov', 'frage9');

// Frage 12 - Zweite Antwort ist korrekt
addQuizMarkerVideo(866, 620, 'Auf welchen Film spielt diese Szene an?', ['Das Dschungelbuch', 'Ratatouille', 'Flutsch und weg'], 1, 'fragen/quizmap v.1/video/EEAAO_Racacoonie.mov', 'frage12');