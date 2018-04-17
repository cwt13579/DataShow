function DropManager(ct,itTypes,hero_,flowBg){
	var items;
	var fronts;
	var hero=hero_;
	var status=0;
	var level=1;
	var times=0;
	var itemSum=0;
	var context=ct;
	var ws=ct.getWs();
	var typeAll;
	var typeNumbers;
	var preCreateTime=0;
	var $this=this;
	this.speed=1;
	buildType(itTypes);
	function buildType(types){
		typeAll=0;
		typeNumbers=[];
		for(var i in types){
			typeAll+=types[i].weight;
			typeNumbers.push(typeAll);
		}
	}
	
	this.start=function(){
		status=1;
		items={'hero':hero_};
		fronts={};
		ct.bindDyModels(items);
		ct.bindBgFrontModels(fronts);
	}
	var bgStar=0;
	var preTime=0;
	this.go=function(now){
		level=ct.getPoint()/10+1;
		var step=preTime==0?1:(now-preTime)/20;//处理浏览器切换到后台后再切出来引起的元素扎堆的问题
		flowBg.speed=this.speed=level*step;
		preTime=now;
		if(!preCreateTime){
			preCreateTime=now;
		}else if(now-preCreateTime>1500/level){//刚开始时，两秒产生一个下坠物
			$this.createItem();
			preCreateTime=now;
			bgStar++;
			if(bgStar==3){
				$this.createStar();
				bgStar=0;
			}
		}
		times++;
		for(var i in items){
			if(items[i].remove||(items[i].x>ws.w||items[i].y>ws.h)){
				this.removeItem(items[i]);
			}else{
				items[i].go&&items[i].go(this.speed);
			}
		}
		for(var i in fronts){
			if(fronts[i].remove||(fronts[i].x>ws.w||fronts[i].y>ws.h)){
				this.removeFronts(fronts[i]);
			}else{
				fronts[i].go&&fronts[i].go(this.speed);
			}
		}
		for(var i in items){
			if(!items[i]){
				continue;
			}
			if(items[i].x>ws.h){
				this.removeItem(items[i]);
			}else if(ct.hasCollision(items[i],hero,10)){//重叠深度大于40才算碰撞
				hero.collision(items[i]);
			}
		}
	}
	
	this.createStar=function(){
		var rd=Math.random();
		var star=context.getResources().bgStar;
		var item=new BgStar(star,0,ws.h/2*rd+30,-star.width*(rd+0.5),star.height*(rd+0.5));
		item.key="j_"+(++itemSum);
		fronts[item.key]=item;
	}
	
	
	this.createItem=function(){
		var rd=Math.random();
//		if(rd<0.1){//35%的概率不产生
//			return;
//		}
		var typeRd=Math.floor(rd*typeAll);
		var ti;
		for(var i in typeNumbers){
			ti=itTypes[i];
			if(typeNumbers[i]>typeRd){
				break;
			}
		}
		rd=Math.random();
		var xRd=Math.floor(rd*(ws.w-ti.img.width-10));
		if(itemSum==1){
			return;
		}
		var itemKey="i_"+(++itemSum);
		if(ti.type==1){
			var di=new Gift(ti.img,xRd,-ti.img.height,ti.img.width,ti.img.height,itemKey,ti.type,ti.point,ct);
		}else if(ti.type==0){
			var di=new Boom(ti.img,xRd,-ti.img.height,ti.img.width,ti.img.height,itemKey,ti.type,ti.point,ct);
		}else{//TODO 其他扩展类型
			return;
		}
		items[itemKey]=di;
	}
	this.removeItem=function(item){
		delete items[item.key];
	}
	
	this.removeFronts=function(item){
		delete fronts[item.key];
	}
}
