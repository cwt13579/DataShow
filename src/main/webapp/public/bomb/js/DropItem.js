function DropItem(img, x, y, w, h, key, type, point) {
	ImgItem.call(this, img, x, y, w, h);
	this.key = key;
	this.speed = 1;
	this.type = type;
	this.point = point;
	this.go = function(step) {
		this.y += this.speed * step;
	}
}

function BgStar(img, x, y, w, h) {
	ImgItem.call(this, img, x, y, w, h);
	this.speed = 1;
	this.go = function(step) {
		this.y += this.speed * step;
		this.x += this.speed * step;
	}
}

