// Classifier Variable
let classifier; // crea variable para el clasificador de imagenes
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/-eY535zaj/';

// Video
let video; // crea variable para el video
let flippedVideo; // crea variable para el video volteado
// To store the classification
let label = ""; // crea variable para la etiqueta, almacenar clases de etiqueta
let confianza = 0; // crea variable para la confianza
// Audio
let audio;
let bg = [16, 55, 92];

// Load the model first
function preload() { // carga el modelo primero
classifier = ml5.imageClassifier(imageModelURL + 'model.json'); // carga el clasificador de imagenes con la libreria ml5
audio = loadSound('sounds/grito.mp3');
}

function setup() {
createCanvas(windowWidth, windowHeight); // crea el canvas
// Create the video
video = createCapture(VIDEO); // crea el video enciende la camara
video.size(420, 360); // tamaño del video (320 , 320 , 260); // tamaño del video
video.hide(); // ocultar el video

// flippedVideo = ml5.flipImage(video); // voltea el video
// Start classifying
classifyVideo();
}

function draw() {
background(bg);
// Draw the video
image(video, width /3 +25, height /2 -150); // dibuja el video
filter(BLUR, 10);

drawCat();
fill(0);
rect(320 , 260);

// Draw the label
fill(255);
textSize(16);
textAlign(CENTER);
text(label, width / 2, height - 30);
textSize(10);
text(confianza.toFixed(2), 20, height - 30);

if (label == "boca abierta" && confianza > 0.9) {
bg = [random(255), random(255), random(255)]; // Cambia el fondo a un color aleatorio
textSize(25);
textAlign(CENTER);
text('surprise weys', width / 2, height / 5);
}
function drawCat() {
  // Cabeza
  if (label == "boca abierta" || label == "boca cerrada") {
    fill(255, 204, 0);
    ellipse(width / 2, height / 2, 200, 200);
  }

  // Boca y Ojos
  if (label == "boca abierta" && confianza > 0.9) {
    fill(255);
    ellipse(width / 2, height / 2 + 30, 40, 20); // boca abierta

    fill(255);
    ellipse(width / 2 - 30, height / 2 - 10, 30, 30); // ojo izquierdo
    fill(0);
    ellipse(width / 2 - 30, height / 2 - 10, 8, 8); // pupila izq

    fill(255);
    ellipse(width / 2 + 30, height / 2 - 10, 30, 30); // ojo derecha
    fill(0);
    ellipse(width / 2 + 30, height / 2 - 10, 8, 8); // pupila derecho

    // Reproducir el sonido del grito
    if (!audio.isPlaying()) {
      audio.play();
    }
  } else if (label == "boca cerrada" && confianza > 0.9) {
    fill(0);
    rect(width / 2 - 20, height / 2 + 30, 40, 5); // boca cerrada

    ellipse(width / 2 - 30, height / 2 - 10, 40, 10); // ojo izquierdo
    ellipse(width / 2 + 30, height / 2 - 10, 40, 10); // ojo derecho

    // Detener el sonido del grito si se está reproduciendo
    if (audio.isPlaying()) {
      audio.stop();
    }
  }
}
}

// Get a prediction for the current video frame
function classifyVideo() {
classifier.classify(video, gotResult); // clasifica el video
}

// When we get a result
function gotResult(results, error) { // cuando obtengamos un resultado
// If there is an error
if (error) {
console.error(error); // muestra el error en la consola
return;
}

// The results are in an array ordered by confidence.
// console.log(results[0]);
label = results[0].label;
confianza = results[0].confidence;
// Classifiy again!
classifyVideo();
}

document.addEventListener("DOMContentLoaded", function() {
  // Ocultar el preloader después de 2 segundos de que la página se haya cargado completamente
  window.addEventListener("load", function() {
    setTimeout(function() {
      document.getElementById('preloader').style.display = 'none';
    }, 2000); // 2000 milisegundos = 2 segundos
  });
});