package com.demo.index;

import com.jfinal.aop.Clear;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

/**
 * 本 demo 仅表达最为粗浅的 jfinal 用法，更为有价值的实用的企业级用法
 * 详见 JFinal 俱乐部: http://jfinal.com/club
 * 
 * IndexController
 */
@Clear
public class LoginController extends BaseController {
    public void index() {
        render("login.html");
    }
    public void loginCheck() {
        WsRes res = new WsRes();
        String username = getPara("username");
        String password = getPara("password");
        keepPara("username");
        if (username.equals("admin") && password.equals("123456")) {
              getSession().setAttribute(SESSEION_USER_ID,username);
              getSession().setAttribute(SESSEION_USER_NAME, username);
              res.setCode(WsRes.SUCCESS);
        } else {
              res.setCode(WsRes.FAIL);
              res.setMsg("用户名或密码错误");
        }
        
        renderJson(res);
    }
    
    public void logout() {
        removeSessionAttr( SESSEION_USER_ID );
        removeSessionAttr( SESSEION_USER_NAME );
        render("login.html");
    }
}



