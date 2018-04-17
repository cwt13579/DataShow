
	function DZD(root,canvas,inited,over) {
		var CT = new GameContext(canvas);
		var ws = CT.getWs();
		var bgModel;
		root.style.width=ws.w+"px";
		root.style.height=ws.h+"px";
		canvas.width=ws.w, canvas.height=ws.h;
		var imgs = giftImgs;
		var audios = giftAudio;
		this.start=function(){
			CT.initAudio();
			CT.start();
			CT.getResources().bgMusic.play();
		}
		this.reset=function(){
			CT.reset();
		}
		CT.loadResources(imgs, audios, function() {
			doInit();
			inited();
		});

		function doInit() {
			var r = CT.getResources();
			var itemTypes = [{
				type: 1,
				weight: 15,
				img: r.gift,
				point: 1
			}, {
				type: 0,
				weight: 10,
				img: r.boom,
				point: 0
			}];
			initSize();
			CT.setScoreItem(new ScoreBoard(r.scoreBoard, CT))
			var staticModels = buildInitModel();
			CT.bindStaticModels(staticModels);
			CT.bindBgModel(new BackGround(r.bg, 0, 0, ws.w, ws.h));
			var flowBg=new FlowBackGround(r.bgFlow, 0, 0, ws.w, ws.h);
			CT.bindBgFlowModel(flowBg);
			var hand = r.hand;
			var px = (ws.w - hand.width) / 2;
			var py = ws.h - hand.height - 10;
			var hero = new Hand(hand, px, py, hand.width, hand.height, CT);
			CT.hero = hero;
			CT.regTimer("dm",new DropManager(CT, itemTypes, hero,flowBg));
			CT.whenOver(function(point,time) {
				CT.getResources().bgMusic.pause();
				over&&over(point,time)
			});
			CT.ready(canvas, 50);
		}

		function buildInitModel() {
			var models = [];
			var r = CT.getResources();
			var hand = r.hand;
			var px = (ws.w - hand.width) / 2;
			var py = ws.h - hand.height - 10;
			//			models.push(new BackGround(r.bg, 0, 0, ws.w, ws.h));
			//			models.push(new Hand(hand, px, py, hand.width, hand.height, CT));
			models.push(new BackGround(r.initBg, 0, 0, ws.w, ws.h))
			return models;
		}

		function initSize() {
			var r = CT.getResources();
		}

	}