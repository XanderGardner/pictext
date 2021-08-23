var ctx;
var width;
var height;
var font_size;
var line_height;
var char_per_line;
var max_weights = [];
var char_weights_dict = {};
var monospace_ratio = 1.716; // experimentally obtained ratio for the monospace font (height/width)

// step 1 elements
const file_input_element = document.getElementById('file-input');
// step 2 elements
const font_size_element = document.getElementById('font-size');
const line_height_element = document.getElementById('line-height');
const char_per_line_element = document.getElementById('char-per-line');
// step 3 elements
const table_body_element = document.getElementById('input-table-body');
const add_char_button = document.getElementById('add-char');
const reset_char_button = document.getElementById('reset-char');
const base_table_html = table_body_element.innerHTML; // original html; used for reset
// generation elements
const generate_button = document.getElementById('generate');

// step 1
file_input_element.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setInput(file);
});

// step 3
add_char_button.addEventListener('click', (e) => {
  var char_row_element = document.createElement("tr");
  char_row_element.innerHTML = "<td><input type=\"text\" class=\"char-input\"></td><td><input type=\"number\" class=\"weight-input\"></td><td><canvas class=\"pixel-canvas\"></canvas></td>";
  table_body_element.appendChild(char_row_element);
});
reset_char_button.addEventListener('click', (e) => {
  table_body_element.innerHTML = base_table_html;
});

// generation process
generate_button.addEventListener('click', (e) => {
  readInput();
  if (validGenerationInput()) {
    generate_pictext();
  }
});

// helpers

function setInput(file) {
  var fr = new FileReader();
  fr.onload = function () {
    var img = new Image
    img.onload = function () {
      let canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      width = img.width;
      height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = fr.result;
  };
  fr.readAsDataURL(file);
}

function readInput() {
  font_size = parseFloat(font_size_element.value);
  line_height = parseFloat(line_height_element.value);
  char_per_line = parseFloat(char_per_line_element.value);
  var char_elements = document.getElementsByClassName('char-input');
  var weight_elements = document.getElementsByClassName('weight-input');
  for (var i = 0; i < weight_elements.length; i++) {
    max_weights[i] = parseFloat(weight_elements[i].value);
    var curr_char = char_elements[i].value
    if (curr_char == null || curr_char == "") {
      curr_char = " ";
    } else if (curr_char.length > 1) {
      curr_char = curr_char[0];
    }
    char_weights_dict[max_weights[i]] = curr_char;
  }
  max_weights.sort(function(a, b){return a-b});
}

function validGenerationInput() {
  if (ctx == null) {
    alert("No file has been chosen")
    return false;
  }
  if (font_size == null || isNaN(font_size)) {
    alert("Font size must be set");
    return false;
  }
  if (line_height == null || isNaN(line_height)) {
    alert("Line height must be set");
    return false;
  }
  if (char_per_line == null || isNaN(char_per_line)) {
    alert("Characters per line must be set");
    return false;
  }
  for (var i = 0; i < max_weights.length; i++) {
    if (isNaN(max_weights[i])) {
      alert("Max weight must be set for all pixels");
      return false;
    }
  }
  return true;
}

function generate_pictext() {
  const body_element = document.getElementById('body');
  body_element.style.backgroundColor = "white";
  body_element.innerHTML = `<p id=\"output\" style=\"white-space: pre; font-family: monospace; font-size: ${font_size}pt; line-height: ${line_height};\"></p>`;
  const output_element = document.getElementById('output');
  var pictext = "";

  var nth_col = width / char_per_line;
  var nth_row = nth_col * monospace_ratio * line_height;
  for (var row = 0.0; row < height; row += nth_row) {
    var pictext_line = ""
    for (var col = 0.0; col < width; col += nth_col) {
      var rounded_row = Math.floor(row);
      var rounded_col = Math.floor(col);
      pictext_line += getChar(rounded_row, rounded_col);
    }
    console.log("end of line: " + pictext_line);
    pictext += pictext_line + "\n"
  }
  output_element.innerText = pictext;
}

function getChar(row, col) {
  var pixel_weight = getWeight(row, col);
  // max_weights holds ascending array of keys (with max weights)
  // keys access the character in char_weights_dict
  for (var i = 0; i < max_weights.length; i += 1) {
    if (pixel_weight <= max_weights[i]) {
      return char_weights_dict[max_weights[i]];
    }
  }
  return char_weights_dict[max_weights[max_weights.length - 1]]
}

function getWeight(row, col) {
  return (getRed(row,col) + getGreen(row,col) + getBlue(row,col)) / 3;
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