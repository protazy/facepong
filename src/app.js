function initGlobs() {
    globs.overlay = document.getElementById("overlay");
    globs.photoCanvas = document.getElementById("photo");
    globs.photoContext = globs.photoCanvas.getContext("2d");
    globs.video = document.getElementById("video");
    globs.coords = document.getElementById("coords");
}

async function loadModels() {
    await faceapi.loadTinyFaceDetectorModel("models");
}

async function showVideo() {
    var video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
        video.srcObject = stream;
        video.play();
    });
}

function startDetectionUpdater() {
    setInterval(update, 100);
}

async function update() {
    takePhoto();
    const allFaces = await detectFaces();
    console.log(allFaces);
    drawDetections(allFaces);
    showFirstFacePosition(allFaces);
}

function takePhoto() {
    globs.photoContext.drawImage(globs.video, 0, 0, 640, 480);
}

async function detectFaces() {
    return faceapi.detectAllFaces(globs.photoCanvas, new faceapi.TinyFaceDetectorOptions());
}

async function drawDetections(allFaces) {
    const displaySize = {width: globs.photoCanvas.width, height: globs.photoCanvas.height};
    faceapi.matchDimensions(globs.overlay, displaySize);

    const resizedDetections = faceapi.resizeResults(allFaces, displaySize);
    faceapi.draw.drawDetections(globs.overlay, resizedDetections);
}

function showFirstFacePosition(allFaces) {
    if (allFaces.length === 0) {
        return;
    }

    let firstFace = allFaces[0];
    globs.coords.innerText = "[" + firstFace.box.x + ", " + firstFace.box.y + "]"
}

async function init() {
    initGlobs();
    await loadModels();
    await showVideo();

    startDetectionUpdater();
}

let globs = {};
init();