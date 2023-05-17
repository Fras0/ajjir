var video = document.getElementById("camera");
var canvas = document.getElementById("myCanvas");
var camera = false;
let currentStream = null;
var capturedImage = false;
var btnStart = document.getElementById("btnStart");
var btnCapture = document.getElementById("btnCapture");
var ctx = canvas.getContext("2d");

function StartCamera() {
  if (!camera) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(function (stream) {
          currentStream = stream;
          video.srcObject = currentStream;
          video.style.display = "block";
          camera = true;
          btnStart.value = "Stop Camera";
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  } else {
    camera = false;
    currentStream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
    btnStart.value = "Start Camera";
  }
}

async function snapshot() {
  if (camera) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = true;
    var img = canvas.toDataURL("image/png");

    let inputElement = document.getElementById("image");


      const response = await fetch(img);
      // here image is url/location of image
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', {type: blob.type});
      console.log(file);

    // const myFile = new File(["Hello World!"], "myFile.png", {
    //   type: "image/png",
    //   lastModified: new Date(),
    // });

    // Now let's create a DataTransfer to get a FileList
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputElement.files = dataTransfer.files;

    // inputElement.files[0].name = img;
    // console.log(inputElement.file);
    // document.write(`<img src="${img}"/>`);
  } else window.alert("Please start the camera");
}

btnStart.addEventListener("click", StartCamera);
btnCapture.addEventListener("click", snapshot);
