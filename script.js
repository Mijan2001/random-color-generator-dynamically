// global section
let toastContainer = null;
let increased = 100;
const defaultColor = {
    red: 221,
    green: 222,
    blue: 238,
};

// default color presets .window.........defaultColor...
const defaultPresetColors = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F3FF33', // Yellow
    '#FF33A1', // Pink
    '#33FFF1', // Cyan
    '#FFB533', // Orange
    '#8D33FF', // Purple
    '#33FF88', // Light Green
    '#FF3380', // Magenta
    '#33A1FF', // Sky Blue
    '#FFC733', // Golden
];

// window onload funcion called
window.onload = () => {
    main();
    updateColorCodeToDom(defaultColor);
    displayColorBoxes(
        document.getElementById('preset-colors'),
        defaultPresetColors,
    );
};

// after clicking bg will be changed................
function main() {
    const generateRandomColorBtn = document.getElementById(
        'generate-random-color',
    );
    generateRandomColorBtn.addEventListener(
        'click',
        handleGenerateRandomColorBtn,
    );

    // range handler section starts ......................
    const colorSliderRed = document.getElementById('color-slider-red');
    const colorSliderGreen = document.getElementById('color-slider-green');
    const colorSliderBlue = document.getElementById('color-slider-blue');

    colorSliderRed.addEventListener(
        'change',
        handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue),
    );
    colorSliderGreen.addEventListener(
        'change',
        handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue),
    );
    colorSliderBlue.addEventListener(
        'change',
        handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue),
    );
    // range handler section ends ............

    const colorModeHexInp = document.getElementById('input-hex');
    colorModeHexInp.addEventListener('keyup', handleColorModeHexInp);

    const copyToClipboardBtn = document.getElementById('copy-to-clipboard');
    copyToClipboardBtn.addEventListener('click', handleCopyToClipboard);
}

// event handlers ........................
function handleGenerateRandomColorBtn() {
    let color = generateDecimalColor();
    updateColorCodeToDom(color);
}

function handleColorModeHexInp(e) {
    let hexColor = e.target.value;
    if (hexColor) {
        this.value = hexColor.toUpperCase();
    }
    if (isValidHex(hexColor)) {
        const color = hexToDecimalColors(hexColor);
        updateColorCodeToDom(color);
    } else {
        alert('Invalid Hex Code');
    }
}

function handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function () {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value),
        };
        updateColorCodeToDom(color);
    };
}

function handleCopyToClipboard() {
    const colorModeRadios = document.getElementsByName('color-mode');
    const node = getCheckedValueFromRadios(colorModeRadios);
    if (node === null) {
        throw new Error('Invalid input radio');
    }

    if (toastContainer !== null) {
        toastContainer.remove();
        toastContainer = null;
    }

    if (node === 'hex') {
        const hexColor = document.getElementById('input-hex').value;
        if (hexColor && isValidHex(hexColor)) {
            navigator.clipboard.writeText(`#{hexColor}`);
            generateToastMessage(`#${hexColor}`);
        } else {
            alert('Invalid Hex Color');
        }
    } else {
        const rgbColor = document.getElementById('input-rgb').value;
        if (rgbColor) {
            navigator.clipboard.writeText(rgbColor);
            generateToastMessage(`${rgbColor}`);
        } else {
            alert('Invalid RGB Color');
        }
    }
}

function generateToastMessage(msg) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-message toast-message-slide-in';
    toastContainer.innerHTML = msg + ' copied';
    toastContainer.addEventListener('click', function () {
        toastContainer.classList.remove('toast-message-slide-in');
        toastContainer.classList.add('toast-message-slide-out');
        toastContainer.addEventListener('animationend', function () {
            toastContainer.remove();
            toastContainer = null;
        });
    });
    document.body.appendChild(toastContainer);
}

// DOM function..............................
function getCheckedValueFromRadios(nodes) {
    let checkedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

// update dom element with calculated value............
function updateColorCodeToDom(color) {
    const hexColor = `${generateHexColor(color)}`;
    const rgbColor = generateRGBColor(color);

    document.getElementById(
        'color-display',
    ).style.backgroundColor = `#${hexColor}`;

    document.getElementById('input-hex').value = hexColor;
    document.getElementById('input-rgb').value = rgbColor;

    document.getElementById('color-slider-red').value = color.red;
    document.getElementById('color-slider-red-label').innerHTML = color.red;
    document.getElementById('color-slider-green').value = color.green;
    document.getElementById('color-slider-green-label').innerHTML = color.green;
    document.getElementById('color-slider-blue').value = color.blue;
    document.getElementById('color-slider-blue-label').innerHTML = color.blue;
}

function generateColorBox(color) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = color;
    div.setAttribute('data-color', color);

    return div;
}

/**
 *
 * @param {object} parent
 * @param {Array} colors
 */
function displayColorBoxes(parent, colors) {
    colors.forEach((color) => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox);
    });
}
// Utils .....................

// decimal color generator...................
function generateDecimalColor() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);
    return {
        red,
        green,
        blue,
    };
}

// randomly hexadecimal color generated.................
function generateHexColor({ red, green, blue }) {
    // let { red, green, blue } = generateDecimalColor();

    function twoCodeColor(value) {
        let hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }
    return `${twoCodeColor(red)}${twoCodeColor(green)}${twoCodeColor(
        blue,
    )}`.toUpperCase();
}

// rgba color code generated......................
function generateRGBColor({ red, green, blue }) {
    return `rgb(${red},${green},${blue})`;
}

// convert hex to decimal.........................
function hexToDecimalColors(hex) {
    let red = parseInt(hex.slice(0, 2), 16);
    let green = parseInt(hex.slice(2, 4), 16);
    let blue = parseInt(hex.slice(4, 6), 16);
    // console.log('hexTorgb : ' + red, green, blue);
    return { red, green, blue };
}

// check valid hexadecimal code here................
function isValidHex(color) {
    if (color.length !== 6) return false;
    return /[0-9A-Fa-f]{6}$/i.test(color);
}
