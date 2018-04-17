function BackGround(img, x,y, w, h) {
	ImgItem.call(this,img, x,y, w, h);
	this.painted=new ShakeSupport(this,8).painted;
}

function FlowBackGround(img, x,y, w, h) {
	var rate=img.width/w;
	var cutH=h*rate
	var offsetY=img.height-cutH;
	offSetY=100;
	ImgItem.call(this,img, x,y, w, h);
	this.speed=1;
	this.draw=function(pen){
		var sy=offsetY<0?0:offsetY;
		var sh=offsetY<0?(cutH+offsetY):cutH;
		var dy=offsetY<0?(-offsetY):0;
		var dh=h-dy/rate;
		if(offsetY<0){
			pen.drawImage(img,0,img.height+offsetY,img.width,-offsetY,0,0,w,-offsetY/rate);
		}
		pen.drawImage(img,0,sy,img.width,sh,0,dy/rate,w,dh);
		if(offsetY<-cutH){
			offsetY=img.height-cutH;
		}
		offsetY-=this.speed;
	}
}

