function ScoreBoard(img,ct){
	ImgItem.call(this,img, 0,-15, img.width, img.height);
	var r=ct.getResources();
	this.score=function(pen,score){
		score=score+"";
		while(score.length<3){
			score="0"+score;
		}
		for(var i=0;i<score.length;i++){
			var img=r["number_"+score.charAt(i)];
			pen.drawImage(img, this.x+62+i*(img.width+2), this.y+64, img.width, img.height);
		}
	}
}
