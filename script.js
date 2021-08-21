var ctx;
var width;
var height;

// step 1
const file_input_element = document.getElementById('file-input');
file_input_element.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setInput(file);
});

// step 2
const font_size_element = document.getElementById('font-size');
const line_height_element = document.getElementById('line-height');
const char_per_line_element = document.getElementById('char-per-line');

// step 3
const table_body_element = document.getElementById('input-table-body');
const add_char_button = document.getElementById('add-char');
const reset_char_button = document.getElementById('reset-char');
const base_table_html = table_body_element.innerHTML;
add_char_button.addEventListener('click', (e) => {
  table_body_element.innerHTML += "<td><input type=\"text\" class=\"char-input\"></td><td><input type=\"number\" class=\"weight-input\"></td><td><canvas class=\"pixel-canvas\"></canvas></td>";
});
reset_char_button.addEventListener('click', (e) => {
  table_body_element.innerHTML = base_table_html;
});

// generation process
const generate_button = document.getElementById('generate');
generate_button.addEventListener('click', (e) => {
  validateGeneration();
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
function getWeight(row, col) {
  return (getRed(row,col) + getGreen(row,col) + getBlue(row,col)) / 3;
}

function validateGeneration() {
  console.log("Img: " + ctx);
  console.log("Width: " + width);
  console.log("Height" + height);

  console.log("Font size: " + font_size_element.value);
  console.log("line height: " + line_height_element.value);
  console.log("Chars per line: " + char_per_line_element.value);

  // Todo: validate and create data structure for step 3 characters max weights
}