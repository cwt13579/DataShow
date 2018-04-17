function GGL(rootDom, bgImgSrc, desc, initCb, openCb) {
	var cLeft,cTop;
	rootDom.innerHTML = "";
	var style = 'position:absolute;top:0px;left:0px;';
	var bgCanvas = document.createElement("canvas")
	bgCanvas.setAttribute('style', style + "z-index:1");
	var frontCanvas = document.createElement("canvas")
	frontCanvas.setAttribute('style', style + "z-index:2");
	rootDom.appendChild(bgCanvas);
	rootDom.appendChild(frontCanvas);
	var fpen = frontCanvas.getContext("2d");
	var bpen = bgCanvas.getContext("2d");
	var bgImg = new Image();
	bgImg.onload = function() {
		buildArea();
	}
	bgImg.src = bgImgSrc;
	var descArea;
	function buildArea() {
		var w = frontCanvas.width = bgCanvas.width = rootDom.clientWidth;
		var h = frontCanvas.height = bgCanvas.height = rootDom.clientHeight;
		bpen.drawImage(bgImg, 0, 0, w, h);
		bpen.font = "26px Helvetica";
		bpen.fillStyle = '#333333';
		bpen.textAlign = "left";
		bpen.textBaseline = "top";
		var metrics = bpen.measureText(desc);  
		bpen.fillText(desc, (w - metrics.width) / 2, (h - 26) / 2);
		descArea={x:(w - metrics.width) / 2,y:(h - 26) / 2,w:metrics.width,h:26}
		fpen.fillStyle = '#bebebe';
		fpen.fillRect(0, 0, w, h);
		fpen.font = "26px Helvetica";
		fpen.fillStyle = '#ffffff';
		fpen.textAlign = "left";
		fpen.textBaseline = "top";
		metrics = fpen.measureText('刮开有奖'); 
		fpen.fillText('刮开有奖', (w - metrics.width) / 2, (h - 26) / 2);
		cLeft=rootDom.offsetLeft;
		cTop=rootDom.offsetTop;
		bindEvent();
		initCb&&initCb();
	}

	function bindEvent() {
		var supportTouch = "ontouchend" in document;
		var startType = supportTouch ? "touchstart" : "mousedown";
		var endType = supportTouch ? "touchend" : "mouseup";
		var moveType = supportTouch ? "touchmove" : "mousemove";
		var moving = 0,preX=0,preY=0;
		window.addEventListener(startType, function(e) {
			moving = 1;
			preX=e.clientX-cLeft;
			preY=e.clientY-cTop;
			preX=preX>0?preX:0;
			preY=preY>0?preY:0;
		}, false);
		frontCanvas.addEventListener(moveType, function(e) {
			if(!moving) {
				return;
			}
			e.preventDefault();
			e.stopPropagation;
			if(supportTouch) {
				e = e.touches[0];
			}
			var x=e.clientX-cLeft,y=e.clientY-cTop;
			var px=x>preX?preX:x,py=y>preY?preY:y;
			var absX=Math.abs(x-preX),absY=Math.abs(y-preY);
			var xBig=absX>absY;
			var big=absX>absY?absX:absY;
			var inc=3;//起始坐标跨度过大时得渐进梯度
			if(absX>inc&&absY>inc){
				var cx=preX,cy=preY;
				var xd=x-preX>0?inc:-inc,yd=y-preY>0?inc:-inc;
				while(big>0){
					cx+=xBig?xd:xd*absX/absY;
					cy+=xBig?yd*absY/absX:yd;
					fpen.clearRect(cx,cy,10,10);
					big-=inc;
				}
			}else{
				fpen.clearRect(px, py,absX+10,absY+10);
			}
			preX=x;
			preY=y;
		}, false);
		window.addEventListener(endType, function(e) {
			moving = 0;
			if(openCb){
				var data = fpen.getImageData(descArea.x, descArea.y, descArea.w, descArea.h).data;
				var j = 0;
				for(var i = 0; i < data.length; i += 4) {
					if(data[i] == 0) j++;
				}
				if(j >= data.length / 6) {//刮开面积大于三分之二  (data.length / 4) * (2/3)
					openCb&&openCb();
					openCb=null;
				}
			}
	},
		false);
		window.addEventListener("touchcancel", function(e) {}, false);
	}
}