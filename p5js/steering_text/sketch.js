const FONT_MAX = 192;
const FONT_STEP = 10;
const FONT_MIN = FONT_MAX - (16*FONT_STEP);

const BG_COLOUR = '#333333';
const FG_COLOUR = '#44bb66';
const TEXT = 'rainbow';

let form;
let slider_samples;
let slider_dotsize;
let input_text;
let fg_colour;
let bg_colour;

let select_font;

let fonts = {};

let font;
let vehicles;

function preload() {
	for (elem of document.querySelector('select').childNodes) {
		if (elem.tagName === 'OPTION') {
			let path = elem.value;
			let fileNoPath = path.split('\\').pop().split('/').pop();
			let fontFamily = fileNoPath.substr(0, fileNoPath.lastIndexOf('.'));
			elem.style.fontFamily = fontFamily;
			fonts[path] = loadFont(path);
		}
	}
}

function setup() {
	vehicles = [];

	form = document.getElementById('tweakform');
	slider_samples = document.getElementById('samples');
	slider_dotsize = document.getElementById('dotsize');
	input_text = document.getElementById('textfield');
	bg_colour = document.getElementById('bg_colour');
	fg_colour = document.getElementById('fg_colour');

	select_font = document.getElementById('font');

	if (form.attachEvent) {
		form.attachEvent('submit', submit);
		fg_colour.attachEvent('change', (event) => {
			document.documentElement.style.setProperty('--colour', fg_colour.value);
		});
	} else {
		form.addEventListener('submit', submit);
		fg_colour.addEventListener('change', (event) => {
			document.documentElement.style.setProperty('--colour', fg_colour.value);
		});
	}

	createCanvas(800, 400);

	document.getElementById('container').appendChild(document.querySelector('canvas'));

	bg_colour.value = BG_COLOUR;
	fg_colour.value = FG_COLOUR;
	input_text.value = TEXT;
	form.dispatchEvent(new Event('submit', {"cancelable":true}));
}

function draw() {
	background(bg_colour.value);
	for (v of vehicles) {
		let act = v.act();
		if (act == true) {
			//join
			let i = vehicles.indexOf(v);
			vehicles.splice(i, 1);
		} else if (act) {
			//separate
			vehicles.push(act);
		}
		v.update();
		v.show();
	}
}

function submit(event) {
	if (event.preventDefault) event.preventDefault();

	document.documentElement.style.setProperty('--colour', fg_colour.value);
	font = fonts[select_font[select_font.selectedIndex].value];

	let val = input_text.value;
	morph(getPoints(val));

	return false;
}

function morph(points) {
	let ch_target;
	points.sort(() => .5 - Math.random());
	vehicles.sort(() => .5 - Math.random());
	let vDelta = points.length - vehicles.length;
	if (vDelta > 0) {
		// separate
		let separators = points.splice(-vDelta);
		while (separators.length > 0) {
			let pt = separators.pop();
			if(vehicles.length === 0) {
				vehicles.push(new Vehicle(pt.x, pt.y))
			} else {
				let i = floor(random(0, vehicles.length));
				vehicles[i].separate++;
				vehicles[i].sep_pos.push(pt);
			}
		}
	} else if (vDelta < 0) {
		// join
		let joiners = vehicles.splice(vDelta);
		let care = vehicles.length > 0;
		vehicles = vehicles.concat(joiners);
		for (v of joiners) {
			let jveh;
			do {
				jveh = random(vehicles);
			} while (jveh.join && care);
			v.join = jveh;
		}
	}
	for (let i = 0; i < points.length; i++) {
		let pt = points[i]
		vehicles[i].target = createVector(pt.x, pt.y);
	}
}

function getPoints(str) {
	let str_size = FONT_MAX;

	let bounds = font.textBounds(str, 0, 0, str_size);

	while (str_size > FONT_MIN && (bounds.w > width || bounds.h > height)) {
		str_size -= FONT_STEP;
		bounds = font.textBounds(str, 0, 0, str_size);
	}

	let x_pos = ((width - bounds.w) / 2) - bounds.x;
	let y_pos = ((height - bounds.h) / 2) - bounds.y;

	let points = font.textToPoints(str, x_pos, y_pos, str_size, {
		sampleFactor: slider_samples.value
	});

	return points;
}
