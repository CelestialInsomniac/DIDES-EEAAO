/* LEAFLET JS */
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -5
});

var ring = L.icon({
    iconUrl: 'images/test_leaflet map V1.0/icons/icon_ring.png',
    //shadowUrl: 'leaf-shadow.png',
    iconSize: [120, 120], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [60, 60], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var bounds = [[0, 0], [1500, 1500]];
var image = L.imageOverlay('images/test_leaflet map V1.0/Background_V1.png', bounds).addTo(map);

// Fit the map to the bounds of the image
map.fitBounds(bounds);

// Set the initial view to center of the image, and zoom level 1
map.setView([750, 750], 1);


var customPopupInfo = "<div class='custom-popup'>Wie wird gespielt? \r \n Ziehe die Netzwerkkarte. Wenn du einen Knotenpunkt anklickst, erscheint ein Quizfenster.  Errate die richtige Antwort und sammle so viele Bagels wie möglich! \r Wenn du die Seite neu lädst, verlierst du deine Bagels.</div>";
//var customPopupContent = "<div class='custom-popup'>Das ist ein benutzerdefiniertes Popup.</div>";

//Infomarker
L.marker([910, 780], { icon: ring }).addTo(map).bindPopup(customPopupInfo, {
    className: 'custom-popup'
}).openPopup();




// Function to add a marker with a quiz
function addQuizMarker(lat, lng, question, answers, correctAnswerIndex, imageUrl) {
    var quizContent = `
        <div id="quiz">
            <img src="${imageUrl}" alt="Quiz Image" style="width: 100%; height: auto;">
            <p>${question}</p>
            <button id="answer1" class="answer">${answers[0]}</button>
            <button id="answer2" class="answer">${answers[1]}</button>
            <button id="answer3" class="answer">${answers[2]}</button>
        </div>
    `;

    var marker = L.marker([lat, lng], { icon: ring }).addTo(map)
        .bindPopup(quizContent, {
            className: 'custom-popup'
        }).openPopup();

    // Event listener for the answer buttons
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('answer1').addEventListener('click', function () {
            handleAnswer('answer1', correctAnswerIndex === 0, correctAnswerIndex);
        });
        document.getElementById('answer2').addEventListener('click', function () {
            handleAnswer('answer2', correctAnswerIndex === 1, correctAnswerIndex);
        });
        document.getElementById('answer3').addEventListener('click', function () {
            handleAnswer('answer3', correctAnswerIndex === 2, correctAnswerIndex);
        });
    });
}

function handleAnswer(selectedAnswerId, isCorrect, correctAnswerIndex) {
    if (isCorrect) {
        document.getElementById(selectedAnswerId).style.backgroundColor = '#30D3B6';
    } else {
        document.getElementById(selectedAnswerId).style.backgroundColor = '#EC872A';
        // Highlight the correct answer
        document.querySelectorAll('.answer')[correctAnswerIndex].style.backgroundColor = '#30D3B6';
    }
    // Deactivate all buttons after an answer
    var buttons = document.getElementsByClassName('answer');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

// Quizmarkers
addQuizMarker(703, 600, 'Zu welchem Game gehört dieser Soundeffekt?', ['Super Smash Bros.', 'Metroid', 'Metal Gear Solid'], 0, 'images/test_leaflet map V1.0/fragen/Frage1.png');

//addQuizMarker(525, 820, 'Auf wen spielt Waymonds Gürteltasche an?', ['Data aus Die Goonies', 'Penny aus Inspector Gadget ', 'Peter aus Ghostbusters'], 0, 'images/test_leaflet map V1.0/fragen/Frage2.png');