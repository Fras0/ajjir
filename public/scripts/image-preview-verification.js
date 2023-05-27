const imagePickerElement = document.querySelector("#adding-id-card input");
const imagePreviewElement = document.querySelector("#adding-id-card img");

function updateImagePreview(event) {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.setAttribute("src", "/images/id-card.png");
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile);
}

imagePickerElement.addEventListener("change", updateImagePreview);