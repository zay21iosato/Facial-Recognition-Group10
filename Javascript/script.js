const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
]).then(webCam);

function webCam() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  setInterval(async () => {
    const detection = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    canvas.getContext("2d").clearRect(0, 0, video.width, video.height,);

    const resizedWindow = faceapi.resizeResults(detection, {
      height: video.height,
      width: video.width,
    });

    faceapi.draw.drawDetections(canvas, resizedWindow);

    resizedWindow.forEach(async (detection) => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box);
      drawBox.draw(canvas);

      // Check if the detected face matches any registered faces in Firebase Storage
      const storageRef = firebase.storage().ref();
      const listRef = storageRef.child("images");
      let labels = [];
      await listRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
          labels.push(itemRef.name);
        });
      });

      const faceMatcher = new faceapi.FaceMatcher(faceapi.loadLabeledImagesFromDisk("/labels"));
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
      if (bestMatch.label !== "unknown" && labels.includes(bestMatch.label + "_captured_image.jpg")) {
        drawBox.label = bestMatch.label;
      }
    });

    console.log(detection);
  }, 100);
});

// Load labels from the labels folder
faceapi.loadLabeledImagesFromDisk("/labels").then((labeledImages) => {
  console.log("Labels loaded:", labeledImages);
}).catch((error) => {
  console.log("Error loading labels:", error);
});
