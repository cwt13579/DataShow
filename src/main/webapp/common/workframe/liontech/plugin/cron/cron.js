var Cron=new function(){
	var p=["秒","分","小时","日","周","月","年"];
	this.getDesc=function(cron){
		var array=cron.split(" ");
		var badFormat="格式不正确或暂不支持的解析";
		if(array.length!=6&&array.length!=7){
			return badFormat;
		}
		if(cron.indexOf(".")!=-1){
			return badFormat;
		}
		var week=array[5];
		array[5]=array[4];
		array[4]=week;
		var result="",cur="";
		for(var i=array.length-1;i>=0;i--){
			var preResult=result;
			cur=array[i];
			if(cur=="*"){
//				result+="每"+p[i];
				result+="";
			}else if(!isNaN(cur)){//直接是数字
				if(i==4){
					result+="周"+(parseInt(cur)+1);
				}else{
					result+=cur+p[i];
				}
			}else if(cur.split("/").length==1){
				if(cur.split(",").length!=1){
					if(i==4){
						var temp=cur.split(",");
						cur="";
						for(var pp in temp){
							cur+=parseInt(temp[pp])+1+","
						}
						cur=cur.substring(0,cur.length-1);
						result+="周("+cur+")";
					}else{
						result+="第("+cur+")"+p[i];
					}
				}else if(cur.split("-").length==2){
					cur=cur.split("-");
					if(i==4){
						result+="周"+(parseInt(cur[0])+1)+"到周"+(parseInt(cur[1])+1)+"之间"
					}else{
						result+="第"+cur[0]+p[i]+"到第"+cur[1]+p[i]+"之间"
					}
				}else{
					return badFormat;
				}
			}else if(cur.split("/").length==2){
				cur=cur.split("/");
				if(cur.length!=2){
					return badFormat;
				}
				if(cur[0]=="*"){
					result+="";
				}else if(!isNaN(cur[0])){
					if(i==4){
						result+="从周"+(parseInt(cur[0])+1)+"开始";
					}else{
						result+="从"+cur[0]+p[i]+"开始";
					}
				}else{
					return badFormat;
				}
				if(isNaN(cur[1])){
					return badFormat;
				}
				if(i==4){
					return badFormat;
				}else{
					result+="每隔"+cur[1]+p[i];
				}
			}else{
				return badFormat;
			}
			i&&(preResult!=result)&&(result+=" 的 ");
		}
		if(result.indexOf("-")!=-1){
			return badFormat;
		}
		return result;
	}
}