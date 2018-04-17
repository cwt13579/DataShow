function GameContext(canvas) {
	var gap = 50;
	var gameStatus = -1; //-1-资源加载中,0-未开始，1-进行中，2-暂停，3-结束
	var pen = canvas.getContext("2d");
	var resources = {};
	var dev = 0;
	var frames = 0;
	var ws;
	var canvas;
	var timers = {};
	var $this = this;
	var staticModels = [];
	var dyModels = [];
	var bgFronts = [];
	var bgModel;
	var bgFlowModel;
	var controlModel;
	var voiceModel;
	var point;
	var whenOver;
	var loopTo;
	var scoreItem;
	var $this = this;
	var allAudios = {};

	this.isRuning = function() {
		return gameStatus == 1;
	}

	this.setScoreItem = function(item) {
		scoreItem = item;
	}

	this.bindBgFrontModels = function(m) {
		bgFronts = m;
	}

	this.bindDyModels = function(m) {
		dyModels = m;
	}
	this.bindStaticModels = function(m) {
		staticModels = m;
	}
	this.bindBgModel = function(m) {
		bgModel = m;
	}
	this.bindBgFlowModel=function(m){
		bgFlowModel=m;
	}
	this.whenOver = function(wo) {
		whenOver = wo;
	}

	this.regTimer = function(key, timer) {
		timers[key] = timer;
	}

	this.status = function() {
		return gameStatus;
	}
	this.dev = function() {
		dev = 1;
	}
	this.getResources = function() {
		return resources;
	}
	this.getWs = function() {
		ws = ws || {
			w: document.body.clientWidth,
			h: document.body.clientHeight
		};
		ws.w = ws.w > 500 ? 500 : ws.w;
		return ws;
	}
	this.loadResources = function(imgs, audios, callback) {
		imgs = imgs || [];
		imgs.push({
			name: 'goOn',
			src: 'r/goOn.png',
			w: 32,
			h: 32
		}, {
			name: 'pause',
			src: 'r/pause.png',
			w: 32,
			h: 32
		});
		var successNum = 0;
		var allLength = imgs.length;
		for(var i in imgs) {
			var img = new Image();
			if(imgs[i].w) {
				img.w = imgs[i].w;
				img.h = imgs[i].h;
			}
			img.onload = function() {
				if(++successNum == allLength) {
					isResourceReady = 1;
					callback();
				}
			}
			var noticed = false;
			img.onerror = function() {
				!noticed && alert("加载资源文件出现异常");
				noticed = true;
			}
			resources[imgs[i].name] = img;
			img.src = imgs[i].src;
			imgs[i].w && (img.width = imgs[i].w);
			imgs[i].h && (img.height = imgs[i].h);
		}
		for(var i in audios) {
			var audio = new Audio();
			if(audios[i].loop) {
				audio.loop = true;
				audio.setAttribute("loop","loop");
			}
			audio.oldPlay=audio.play;
			audio.play=function(){
				return !this.bequiet&&this.oldPlay();
			}
			allAudios[audios[i].name] = audio;
			audio.onloadedmetadata = function() {
				//				if(++successNum == allLength) {
				//					isResourceReady = 1;
				//					callback();
				//				}
			}
			resources[audios[i].name] = audio;
			audio.src = audios[i].src;
		}
	}
	this.ready = function(cvs, framesNumber) {
		canvas = cvs;
		gap = 1000 / framesNumber;
		this.now = new Date().getTime();
		renderStatic(pen, resources);
		gameStatus = 0;
		var p = resources.pause;
//		controlModel = new ControlModel(p, ws.w - p.width - 10, 10, p.width, p.height);
		var v=resources.closeVoice;
		voiceModel = new VoiceModel(v, ws.w - v.width - 10, 10, v.width, v.height);
	}

	var inited = false;
	this.initAudio = function() {
		if(inited) {
			return;
		}
		for(var i in allAudios) {
			var audio = allAudios[i];
			if(!audio.loop) {
				audio.volume = 0;
				audio.play();
			}
		}
		setTimeout(function() {
			for(var i in allAudios) {
				var audio = allAudios[i];
				if(!audio.loop) {
					audio.volume = 1;
				}
			}
		}, 1500);
		inited = true;
	}
	var startTime;
	this.start = function() {
		if(gameStatus != 0) {
			return;
		}
		startTime = new Date().getTime();
		point = 0;
		gameStatus = 1;
		for(var i in timers) {
			timers[i].start && timers[i].start();
		}
		doLoop();
	}
	this.pause = function() {
		gameStatus = 2;
	}
	this.goOn = function() {
		gameStatus = 2;
	}
	this.over = function() {
		gameStatus = 3;
		whenOver && whenOver(point, new Date().getTime() - startTime);
	}

	this.reset = function() {
		gameStatus = 0;
		window.clearTimeout(loopTo);
		renderStatic(pen, resources);
	}

	this.getCanvas = function() {
		return canvas;
	}

	this.hasCollision = function(a, b, fix) {
		var fx = fix,
			fy = fix;
		if(a.dp) {
			fx += a.dp.x;
			fy += a.dp.y;
		}
		if(b.dp) {
			fx += b.dp.x;
			fy += b.dp.y;
		}
		return a.x - b.x < b.w - fx && b.x - a.x < a.w - fx && a.y - b.y < b.h - fy && b.y - a.y < a.h - fy;
	}
	this.goal = function(p) {
		point += p;
	}
	this.getPoint = function() {
		return point;
	}

	function doLoop() {
		if(gameStatus != 1) {
			return;
		}
		$this.now = new Date().getTime();
		doRender();
		loopTo = window.setTimeout(doLoop, gap);
		for(var i in timers) {
			timers[i].go && timers[i].go($this.now);
		}
	}

	function doRender() {
		render(pen, resources);
		dev && showDevInfo($this.now);
	}

	var dev_st = 0; //开始计数的时间
	var dev_fn = 0; //计数周期内的帧数
	var dev_gap = 2000 //2秒判断一次帧数
	var dev_showPl = "-" //显示的频率;
	function showDevInfo(now) {
		if(dev_st == 0) {
			dev_st = now;
		}
		if(now - dev_st > dev_gap) { //下一个计数周期
			dev_st = 0;
			dev_fn = 0;
		}
		dev_fn++;
		frames++;
		pen.font = "12px Helvetica";
		//		pen.textAlign = "left";
		//		pen.textBaseline = "top";
		if(dev_fn != 0 && dev_fn % 6 == 0) {
			dev_showPl = parseInt(dev_fn * 1000 / (now - dev_st));
		}
		pen.fillStyle = "#ffffff";
		pen.fillText("频率:" + dev_showPl + "/s,总帧数:" + frames, ws.w - 120, 6);
	}

	function render(pen, resources) {
		bgFlowModel.draw(pen);
		pen.drawImage(bgModel.img, bgModel.x, bgModel.y, bgModel.w, bgModel.h); //画背景
		bgModel.painted();
		if(gameStatus == 1 || gameStatus == 2) {
			//			pen.drawImage(controlModel.img, controlModel.x, controlModel.y, controlModel.w, controlModel.h); //画控制按钮
		}
		pen.drawImage(voiceModel.img, voiceModel.x, voiceModel.y, voiceModel.w, voiceModel.h); //画声音按钮
		pen.font = "23px Helvetica";
		pen.textAlign = "left";
		pen.textBaseline = "top";
		pen.fillStyle = "#ffffff";
		for(var i in bgFronts) {
			var m = bgFronts[i];
			pen.drawImage(m.img, m.getX(), m.getY(), m.w, m.h);
			m.painted();
		}
		for(var i in dyModels) {
			var m = dyModels[i];
			pen.drawImage(m.img, m.getX(), m.getY(), m.w, m.h);
			m.painted();
		}
		if(scoreItem) {
			pen.drawImage(scoreItem.img, scoreItem.getX(), scoreItem.getY(), scoreItem.w, scoreItem.h);
			scoreItem.score(pen, point);
			scoreItem.painted();
		} else {
			pen.fillText(point, 10, 6);
		}
	}

	function renderStatic(pen, resources) {
		for(var i in staticModels) {
			var m = staticModels[i];
			pen.drawImage(m.img, m.x, m.y, m.w, m.h);
			m.painted();
		}
	}

	function ControlModel(img, x, y, w, h) {
		ImgItem.call(this, img, x, y, w, h);
		canvas.addEventListener("click", function(e) {
			var x = e.clientX,
				y = e.clientY,
				cm = controlModel;
			if(x > cm.x && x < cm.x + cm.w && y > cm.y && y < cm.y + cm.h) {
				controlModel.toggle();
			}
		});
		this.toggle = function() {
			if(gameStatus == 1) {
				gameStatus = 2;
				this.img = resources.goOn;
				render(pen, resources);
			} else if(gameStatus == 2) {
				gameStatus = 1;
				this.img = resources.pause;
				doLoop();
			}
		}
	}
	
	function VoiceModel(img, x, y, w, h) {
		ImgItem.call(this, img, x, y, w, h);
		var voice=true;
		canvas.addEventListener("click", function(e) {
			var x = e.clientX,
				y = e.clientY,
				vm = voiceModel;
			if(x > vm.x && x < vm.x + vm.w && y > vm.y && y < vm.y + vm.h) {
				voiceModel.toggle();
			}
		});
		this.toggle = function() {
			if(voice) {
				voice = false;
				this.img = resources.openVoice;
				for(var i in allAudios){
					allAudios[i].bequiet=true;
					allAudios[i].pause();
				}
			} else{
				voice = true;
				this.img = resources.closeVoice;
				for(var i in allAudios){
					allAudios[i].bequiet=false;
					if(allAudios[i].loop){
						allAudios[i].play();
					}
				}
			}
		}
	}
}