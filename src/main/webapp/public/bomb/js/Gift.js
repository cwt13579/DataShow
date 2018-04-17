function Gift(img, x,y, w, h,key,type,point,ct){
	this.dieW;
	this.dieH;
	this.live = 1;
	this.remove = 0;
	this.dp={x:20,y:20}
	DropItem.call(this,img, x,y, w, h,key,type,point);
	this.pGo=this.go;
	this.go=function(step){
		if(!this.live) {
			this.w-=2;
			this.h-=2;
			if(this.w == 0 || this.h == 0) {
				this.remove = 1;
			}
		}else{
			this.pGo(step);
		}
	}
	this.die = function() {
		this.live = 0;
		this.dieW=w;
		this.dieH=h;
	}
}
