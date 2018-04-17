function Boom(img, x,y, w, h,key,type,point,ct){
	DropItem.call(this,img, x,y, w, h,key,type,point);
	this.painted = new ShakeSupport(this,4).painted;
	this.dp={x:40,y:30};
	this.die = function() {
		this.remove = 1;
	}
}
