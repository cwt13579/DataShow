var giftImgs = [{
	name: "bg",
	src: "r/bg.png"
},{
	name: "bgFlow",
	src: "r/bg_flow.jpg"
}, {
	name: "initBg",
	src: "r/initBg.jpg"
}, {
	name: "hand",
	src: "r/hand.png",
	w: 80,
	h: 138
}, {
	name: "gift",
	src: "r/gift.png",
	w: 80,
	h: 80
}, {
	name: "boom",
	src: "r/boom.png",
	w: 80,
	h: 80
}, {
	name: "bgStar",
	src: "r/bgStar.png",
	w: 180,
	h: 140
}, {
	name: "openVoice",
	src: "r/open_voice.png",
	w:70,
	h:30
}, {
	name: "closeVoice",
	src: "r/close_voice.png",
	w:70,
	h:30
}, {
	name: "scoreBoard",
	src: "r/scoreBoard.png",
	w: 183,
	h: 162
}, {
	name: "help_oper",
	src: "r/help_oper.png"
}, {
	name: "help_word",
	src: "r/help_word.png"
}, {
	name: "topic",
	src: "r/topic.png"
}, {
	name: "startGame",
	src: "r/startGame.png"
}, {
	name: "memo_bg",
	src: "r/memo_bg.png"
}, {
	name: "memo_title",
	src: "r/memo_title.png"
}, {
	name: "memo_close",
	src: "r/memo_close.png"
}, {
	name: "winners_bg",
	src: "r/winners_bg.png"
}, {
	name: "winner_list_bg",
	src: "r/winners_list_bg.png"
}, {
	name: "winner_ask",
	src: "r/winners_ask.png"
}, {
	name: "gift_bg",
	src: "r/gift_bg.png"
}, {
	name: "result_gift",
	src: "r/result_gift.png"
}, {
	name: "open_gift",
	src: "r/open_gift.png"
}, {
	name: "confirm_button",
	src: "r/confirm_button.png"
}, {
	name: "gift_no",
	src: "r/gift_no.png"
}, {
	name: "so_sorry",
	src: "r/so_sorry.png"
}, {
	name: "congratulate",
	src: "r/congratulate.png"
}, {
	name: "play_again",
	src: "r/play_again.png"
}, {
	name: "coupon_bg",
	src: "r/coupon_bg.png"
}, {
	name: "redpacket",
	src: "r/redpacket.png"
}, {
	name: "button_mygift",
	src: "r/button_mygift.png"
}, {
	name: "button_winners",
	src: "r/button_winners.png"
}];

for(var i = 0; i < 10; i++) {
	giftImgs.push({
		name: "number_" + i,
		src: "r/number/" + i + ".png",
		w: 12,
		h: 19
	});
}

var giftAudio = [{
	name: 'bgMusic',
	src: 'r/audio/bg_music.mp3',
	loop:true
}, {
	name: 'goal',
	src: 'r/audio/get_gift.mp3'
}, {
	name: 'die',
	src: 'r/audio/get_bomb.mp3'
}];