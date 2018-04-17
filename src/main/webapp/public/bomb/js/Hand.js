function Hand(img, x, y, w, h, context) {
	var r = context.getResources();
	DragableImg.call(this, img, x, y, w, h, context);
	this.collision = function(o) {
		switch(o.type) {
			case 0:
			if(!this.power){
				context.over();
				r.die.play();
			}else{//无敌
				o.die();
			}
			case 1:
				if(o.live) {
					context.goal(o.point);
					o.die();
					this.shake();
					r.goal.play();
					var t=this;
					o.xGap=t.x-o.x+t.w/2;
					o.yGap=t.y-o.y+t.h/2;
					o.getX=function(){
						return (t.x+t.w/2)-o.xGap*(1-(o.dieW-o.w)/o.dieW);
					}
					o.getY=function(){
						return (t.y+t.h/2)-o.yGap*(1-(o.dieH-o.h)/o.dieH);
					}
				}
		}
	}
	var initShake;
	this.shake=function(){
//		if(!initShake){
//			initShake=new ShakeSupport(this,1,1);
//		    this.painted=initShake.painted;
//		}else{
//			initShake.reShake(1);
//		}
		
	}
}