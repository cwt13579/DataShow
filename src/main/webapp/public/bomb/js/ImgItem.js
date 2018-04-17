function ImgItem(img, x, y, w, h) {
	this.img = img;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.changed = 1;
	this.getX=function(){
		return this.x;
	}
	this.getY=function(){
		return this.y;
	}
	this.extended = function(parent) {
		for(var i in this) {
			parent[i] = this[i];
		}
	}
	this.refreshed = function() {
		this.changed = 1;
	}
	this.painted = function() {
		this.changed = 0;
	}
}

function DragableImg(img, x, y, w, h, context) {
	this.context = context;
	var ws=context.getWs();
	ImgItem.call(this, img, x, y, w, h);
	var parent = context.getCanvas();
	bindEvent(this);

	function bindEvent($this) {
		var supportTouch = "ontouchend" in document;
		var startType = supportTouch ? "touchstart" : "mousedown";
		var endType = supportTouch ? "touchend" : "mouseup";
		var moveType = supportTouch ? "touchmove" : "mousemove";
		var moving = 0,
			startX = 0,
			startY = 0,
			px = 0,
			py = 0;
		parent.addEventListener(startType, function(e) {
			if(moving) {
				return;
			}
			if(!context.isRuning()){
				moving=false;
			}
			if(supportTouch) {
				e = e.touches[0];
			}
			px = $this.x, py = $this.y;
			startX = e.clientX, startY = e.clientY;
			moving = 1;
		}, false);
		parent.addEventListener(moveType, function(e) {
			if(!supportTouch && !moving) {
				return;
			}
			if(!context.isRuning()){
				moving=0;
			}
			e.preventDefault();
			e.stopPropagation;
			if(supportTouch) {
				e = e.touches[0];
			}
			$this.x = px + e.clientX - startX;
			$this.y = py + e.clientY - startY;
			$this.x = $this.x < 0 ? 0 : $this.x;
			$this.x = $this.x > (ws.w - $this.w) ? (ws.w - $this.w) : $this.x;
			$this.y = $this.y < 0 ? 0 : $this.y;
			$this.y = $this.y > (ws.h - $this.h) ? (ws.h - $this.h) : $this.y;
			$this.changed = 1;
			return false;
		}, false);
		parent.addEventListener(endType, function(e) {
			if(supportTouch) {
				e = e.changedTouches[0];
			}
			moving = 0;
		}, false);
		parent.addEventListener("touchcancel", function(e) {
			if(supportTouch) {
				e = e.changedTouches[0];
			}
			moving = 0;
		}, false);
	}
}


function ShakeSupport(item,factor,ts){
	var step=0;
	var gain=0;
	var dir=1,dir2=2;
	var times=ts||99999;
	this.painted=function(){
		item.changed = 0;
		if(times<=0){
			return;
		}
		step++;
		if(step%factor==0){
			item.x-=dir;
			item.y-=dir;
			item.w+=dir2;
			item.h+=dir2;
		}
		if(step==factor*8){
			step=0;
			dir=-dir;
			dir2=-dir2;
			times-=0.5;
		}
	}
	this.reShake=function(ts){
		if(times%1==0){
			times=ts;
		}else{
			times=ts-0.5;
		}
	}
}