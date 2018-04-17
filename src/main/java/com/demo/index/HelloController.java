package com.demo.index;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import com.wxb.datashow.common.BaseController;

public class HelloController extends BaseController{
  public void index() {
    renderText("index汉字");
  }
  public void sendHz() throws UnsupportedEncodingException {
    //getRequest().setCharacterEncoding("UTF-8");
    String name = getRequest().getParameter("name");
    getRequest().setCharacterEncoding("");
    System.out.println("name="+name);
    String dename = URLDecoder.decode(name);
    System.out.println("dename="+dename);
    renderText("sendHz汉字");
  }
}
