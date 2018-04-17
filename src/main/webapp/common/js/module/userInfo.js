$(function () {

    var userInfoImg = [{'imgUrl':'../../common/img/head/head-1.png','imgId':'1'},
        {'imgUrl':'../../common/img/head/head-2.png','imgId':'2'},
        {'imgUrl':'../../common/img/head/head-3.png','imgId':'3'},
        {'imgUrl':'../../common/img/head/head-4.png','imgId':'4'},
        {'imgUrl':'../../common/img/head/head-5.png','imgId':'5'},
        {'imgUrl':'../../common/img/head/head-6.png','imgId':'6'},
        {'imgUrl':'../../common/img/head/head-7.png','imgId':'7'},
        {'imgUrl':'../../common/img/head/head-8.png','imgId':'8'},
        {'imgUrl':'../../common/img/head/head-9.png','imgId':'9'},
        {'imgUrl':'../../common/img/head/head-10.png','imgId':'10'},
        {'imgUrl':'../../common/img/head/head-11.png','imgId':'11'},
        {'imgUrl':'../../common/img/head/head-12.png','imgId':'12'},
        {'imgUrl':'../../common/img/head/head-13.png','imgId':'13'},
        {'imgUrl':'../../common/img/head/head-14.png','imgId':'14'},
        {'imgUrl':'../../common/img/head/head-15.png','imgId':'15'},
        {'imgUrl':'../../common/img/head/head-16.png','imgId':'16'},
        {'imgUrl':'../../common/img/head/head-17.png','imgId':'17'},
        {'imgUrl':'../../common/img/head/head-18.png','imgId':'18'},
        {'imgUrl':'../../common/img/head/head-19.png','imgId':'19'},
        {'imgUrl':'../../common/img/head/head-20.png','imgId':'20'},
        {'imgUrl':'../../common/img/head/head-21.png','imgId':'21'},
        {'imgUrl':'../../common/img/head/head-22.png','imgId':'22'},
        {'imgUrl':'../../common/img/head/head-23.png','imgId':'23'},
        {'imgUrl':'../../common/img/head/head-24.png','imgId':'24'},
        {'imgUrl':'../../common/img/head/head-25.png','imgId':'25'},
        {'imgUrl':'../../common/img/head/head-26.png','imgId':'26'},
        {'imgUrl':'../../common/img/head/head-27.png','imgId':'27'},
        {'imgUrl':'../../common/img/head/head-28.png','imgId':'28'},
        {'imgUrl':'../../common/img/head/head-29.png','imgId':'29'},
        {'imgUrl':'../../common/img/head/head-30.png','imgId':'30'},
        {'imgUrl':'../../common/img/head/head-31.png','imgId':'31'},
        {'imgUrl':'../../common/img/head/head-32.png','imgId':'32'},
        {'imgUrl':'../../common/img/head/head-33.png','imgId':'33'},
        {'imgUrl':'../../common/img/head/head-34.png','imgId':'34'},
        {'imgUrl':'../../common/img/head/head-35.png','imgId':'35'}
    ];
    function  initImg() {
            var imhHtml = '';
            for (var i=0;i<userInfoImg.length;i++){
                imhHtml += '<div class="imgBox">'+
                    '<img  dataId="'+userInfoImg[i].imgId+'" src="'+userInfoImg[i].imgUrl+'">'+
                    '</div>';
            }
            $("#headImgDiv").html(imhHtml);
    }
    initImg();

    /*点击更换头像*/
    $("#headImgDiv").on('click','.imgBox',function () {
        var imgUrl = $(this).children('img').attr('src');
        var imgId = $(this).children('img').attr('dataId');
        $("#changeHeadImg").attr('src',imgUrl);
        $("#changeHeadImg").attr('dataId',imgId);
    })
});



var resultJson = ajaxRequest("loginUser", null, null, null);
var data = resultJson.response.data;
var picUrl = data.picUrl ;
$("#changeHeadImg").attr("src",picUrl);

function savePic(){
	var changeHeadImg = $("#changeHeadImg").attr("src");
	var pic={};
	pic.url=changeHeadImg;
	var resultJson = ajaxRequest("editPic", null, pic, null);
	if(resultJson && resultJson.response.code=='0000'){
		alert("保存成功");
	}
}

validator.focusOutF('#editPassword');
function editPassword(){
	var  isTrue = validator.formClick("#editPassword");
	if(!isTrue){
		return false;
	}
	var oldPassword = $("#oldPassword").val();
	var password = $("#password").val();
	var user = {};
	user.oldPassword=oldPassword;
	user.newPassword = password;
	var resultJson = ajaxRequest("editPassword", null, user, null);
	if(resultJson && resultJson.response.code=='0000'){
		alert("修改成功");
	}
	
}