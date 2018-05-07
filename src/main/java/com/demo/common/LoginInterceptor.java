package com.demo.common;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

 
public class LoginInterceptor implements Interceptor {

 

	@Override
	public void intercept(Invocation inv) {
		BaseController controller = (BaseController) inv.getController();
		String uri = controller.getUri();
		if(uri.startsWith("/wxservice")) {
			inv.invoke();
			return;
		}
		if (controller.getLoginUserId() == null) {
			if(uri.equals("/login")) {
				 WsRes res = new WsRes();
				 res.setCode(WsRes.FAIL);
			     res.setMsg("请登录");
			} else {
				controller.redirect("/login");
			}  
		}  else {
			inv.invoke();
		}
		
		
	}
}
