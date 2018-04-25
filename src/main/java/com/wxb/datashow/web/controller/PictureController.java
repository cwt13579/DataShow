package com.wxb.datashow.web.controller;

import java.io.File;

import com.demo.utils.fileupload.OSSUploadUtil;
import com.jfinal.upload.UploadFile;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class PictureController extends BaseController{

  public void uploadPicture() {
    WsRes res = new WsRes();
    String name = getPara("name");
    //处理图片上传
    UploadFile uf = getFile(name, "uploads");
    File uploadFile = uf.getFile();
    String uploadFileName = uf.getFileName();
    String url = OSSUploadUtil.uploadFile(uploadFile, uploadFileName.substring(uploadFileName.lastIndexOf(".")+1));
    res.setData(url);
    renderJson(res);
  }
}
