const file_input_element = document.getElementById('file-input');
var imageData;

file_input_element.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setInput(file);
});

// helpers

function setInput(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var img = new Image
    img.onload = function () {
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.drawImage(img, 0, 0);
      imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      updateDisplay();
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
}

function updateDisplay() {
  
}

