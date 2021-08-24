var ctx;
var width;
var height;
var font_size;
var line_height;
var char_per_line;
var max_lightnesss = [];
var char_lightnesss_dict = {};
var monospace_ratio = 1.716; // experimentally obtained ratio for the monospace font (height/width)
// experimentally obtained order of character lightnesss
chars_ordered = ["m","q","p","g","8","w","b","4","d","k","6","9","e","h","x","n","s","a","5","3","0","o","y","2","f","z","v","c","u","t","j","r","7","1","l","i"];

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
const add_alphabet_button = document.getElementById('add-alphabet');
const add_numbers_button = document.getElementById('add-numbers');
// generation elements
const generate_button = document.getElementById('generate');

updatePixelCanvas();

// step 1
file_input_element.addEventListener('change', (e) => {
  const file = e.target.files[0];
  setInput(file);
});

// step 3
add_char_button.addEventListener('click', (e) => {
  var char_row_element = document.createElement("tr");
  char_row_element.innerHTML = "<td><input type=\"text\" class=\"char-input\"></td><td><input type=\"number\" class=\"lightness-input\"></td><td><canvas class=\"pixel-canvas\"></canvas></td>";
  table_body_element.appendChild(char_row_element);
  char_row_element.addEventListener('change', (event) => {
    updatePixelCanvas();
  });
});
reset_char_button.addEventListener('click', (e) => {
  table_body_element.innerHTML = base_table_html;
  updatePixelCanvas();
});
add_alphabet_button.addEventListener('click', (e) => {
  var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  var lightness_difference = 5;
  for (var i = 0; i < chars_ordered.length; i++) {
    if (alphabet.includes(chars_ordered[i])) {
      table_body_element.appendChild(getCharRow(chars_ordered[i], 10 + i * lightness_difference));
    }
  }
  updatePixelCanvas();
});
add_numbers_button.addEventListener('click', (e) => {
  var numbers = ["0","1","2","3","4","5","6","7","8","9"];
  var lightness_difference = 5;
  for (var i = 0; i < chars_ordered.length; i++) {
    if (numbers.includes(chars_ordered[i])) {
      table_body_element.appendChild(getCharRow(chars_ordered[i], 10 + i * lightness_difference));
    }
  }
  updatePixelCanvas();
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
  var lightness_elements = document.getElementsByClassName('lightness-input');
  for (var i = 0; i < lightness_elements.length; i++) {
    max_lightnesss[i] = parseFloat(lightness_elements[i].value);
    var curr_char = char_elements[i].value
    if (curr_char == null || curr_char == "") {
      curr_char = " ";
    } else if (curr_char.length > 1) {
      curr_char = curr_char[0];
    }
    char_lightnesss_dict[max_lightnesss[i]] = curr_char;
  }
  max_lightnesss.sort(function(a, b){return a-b});
}

// update pixel-canvas
function updatePixelCanvas() {
  lightness_input_elements = document.getElementsByClassName('lightness-input'); // parallel arrays
  pixel_canvas_elements = document.getElementsByClassName('pixel-canvas');
  for (var i = 0; i < pixel_canvas_elements.length; i++) {
    var pixel_weight = lightness_input_elements[i].value;
    pixel_canvas_elements[i].style.backgroundColor = `rgb(${pixel_weight},${pixel_weight},${pixel_weight})`;
  }
}

// shortcut helpers
function getCharRow(char_value, lightness_value) {
  var char_row_element = document.createElement("tr");
  char_row_element.innerHTML = `<td><input type=\"text\" class=\"char-input\" value=\"${char_value}\"></td><td><input type=\"number\" class=\"lightness-input\" value=\"${lightness_value}\"></td><td><canvas class=\"pixel-canvas\"></canvas></td>`;
  return char_row_element;
}

// generate helpers

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
  for (var i = 0; i < max_lightnesss.length; i++) {
    if (isNaN(max_lightnesss[i])) {
      alert("Max lightness must be set for all pixels");
      return false;
    }
  }
  return true;
}

function generate_pictext() {
  const body_element = document.getElementById('body');
  body_element.style.backgroundColor = "white";
  var pictext = "";

  // generate character by character
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

  body_element.innerHTML = `<p id=\"output\" style=\"white-space: pre; font-family: monospace; font-size: ${font_size}pt; line-height: ${line_height};\"></p>`;
  const output_element = document.getElementById('output');
  output_element.innerText = pictext;
}

function getChar(row, col) {
  var pixel_lightness = getlightness(row, col);
  // max_lightnesss holds ascending array of keys (with max lightnesss)
  // keys access the character in char_lightnesss_dict
  for (var i = 0; i < max_lightnesss.length; i += 1) {
    if (pixel_lightness <= max_lightnesss[i]) {
      return char_lightnesss_dict[max_lightnesss[i]];
    }
  }
  return char_lightnesss_dict[max_lightnesss[max_lightnesss.length - 1]]
}

function getlightness(row, col) {
  var r = getRed(row, col);
  var g = getGreen(row, col);
  var b = getGreen(row, col);
  return Math.round(0.299*r + 0.587*g + 0.114*b);
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