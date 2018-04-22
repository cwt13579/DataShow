package com.demo.index;

import com.wxb.datashow.common.BaseController;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * IndexController
 */
public class IndexController extends BaseController {
    public void index() {
        render("index.jsp");
    }

}



