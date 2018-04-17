function Activity(id){
	var prePath="modules/public/";
	var param={activityId:id};
	param.channel=BU.getUrlParam("channel")||"";
	this.leftLucky=function(cb,err){
		BU.get(BU.getAbsPath(prePath+"lucky/left"),param,function(resp){
			cb(resp);
		},err||commonErr);
	}
	
	this.info=function(cb,err){
		BU.get(BU.getAbsPath(prePath+"activity/info"),param,function(resp){
			cb(resp);
		},err||commonErr,true);
	}
	
	this.winners=function(cb,err){
		BU.get(BU.getAbsPath(prePath+"activity/winners"),param,function(resp){
			cb(resp);
		},err||commonErr,true);
	}
	
	this.aquireLucky=function(cb,err){
		BU.get(BU.getAbsPath(prePath+"lucky/aquire"),param,function(resp){
			cb(resp);
		},err||commonErr,true);
	}
	
	function commonErr(errCode,errMessage){
		alert(errMessage);
	}
}
