const file_input_element = document.getElementById('file-input');
const generate_button = document.getElementById('generate');
const output_element = document.getElementById('output');
var ctx;
var width;
var height;

file_input_element.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setInput(file);
});

generate_button.addEventListener('click', (e) => {
  output_element.innerText = "hello there!\nHow are you?\nhehe";
});

// helpers

function setInput(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var img = new Image
    img.onload = function () {
      ctx = document.createElement("canvas").getContext("2d");
      ctx.drawImage(img, 0, 0);
      width = img.width;
      height = img.height;
      updateDisplay();
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
}

function updateDisplay() {
  
}

function getRed(row, col) {
  return ctx.getImageData(col, row, 1, 1).data[0];
}
function getGreen(row, col) {
  return ctx.getImageData(col, row, 1, 1).data[1];
}
function getBlue(row, col) {
  return ctx.getImageData(col, row, 1, 1).data[2];
}
function getAlpha(row, col) {
  return ctx.getImageData(col, row, 1, 1).data[3];
}

