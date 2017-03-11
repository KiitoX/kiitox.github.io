const FLEE_RANGE = 50;
const ATTR_RANGE = 100;

function Vehicle(x, y) {
	this.pos = createVector(random(width), random(height));
	this.target = createVector(x, y);
	this.vel = p5.Vector.random2D();
	this.acc = createVector();
	this.r = 4;
	this.maxspeed = 10;
	this.maxforce = 1;

	this.separate = 0;
	this.sep_pos = [];
	this.join = false;
}

Vehicle.prototype.act = function() {
	let rand = random();
	if (rand > 0.8) {
		if (this.join != false) {
			this.target = this.join.pos;
			if(floor(this.pos.x) === floor(this.target.x) && floor(this.pos.y) === floor(this.target.y)) {
				return true;
			}
		} else if (this.separate > 0) {
			this.separate--;
			let pt = this.sep_pos.pop();

			let sep_pass = ceil(this.separate/2);
			this.separate -= sep_pass;

			let pos_pass = this.sep_pos.splice(0, sep_pass);

			let veh = new Vehicle(pt.x, pt.y);
			veh.pos.x = this.pos.x;
			veh.pos.y = this.pos.y;
			veh.separate = sep_pass;
			veh.sep_pos = pos_pass;

			return veh;
		}
	}
}

Vehicle.prototype.update = function() {
	let arrive = this.arrive(this.target);
	let mouse = createVector(mouseX, mouseY);
	let flee = this.flee(mouse);

	arrive.mult(1);
	flee.mult(5);

	this.acc.add(arrive);
	this.acc.add(flee);

	this.pos.add(this.vel);
	this.vel.add(this.acc);
	this.acc.mult(0);
}

Vehicle.prototype.show = function() {
	stroke(fg_colour.value);
	strokeWeight(this.r);
	strokeWeight(slider_dotsize.value);
	point(this.pos.x, this.pos.y);
}

Vehicle.prototype.arrive = function(target) {
	let desired = p5.Vector.sub(target, this.pos);
	let d = desired.mag();
	let speed = this.maxspeed;
	if (d < ATTR_RANGE) {
		speed = map(d, 0, ATTR_RANGE, 0, this.maxspeed);
	}
	desired.setMag(speed);
	let steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxforce);
	return steer;
}

Vehicle.prototype.flee = function(target) {
	let desired = p5.Vector.sub(target, this.pos);
	let d = desired.mag();
	if (d < FLEE_RANGE) {
		desired.setMag(this.maxspeed);
		desired.mult(-1);
		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxforce);
		return steer;
	} else {
		return createVector(0, 0);
	}
}
