package com.demo.common;

import com.jfinal.aop.Interceptor;

public class LoginInterceptor   {
  
}
//public class LoginInterceptor implements Interceptor {
//
// 
//
//	@Override
//	public void intercept(Invocation inv) {
//		BaseController controller = (BaseController) inv.getController();
//		String uri = controller.getUri();
//		System.out.println(uri);
//		if (controller.getLoginUserId() == null) {
//			if(uri.equals("/login")) {
//				 WsRes res = new WsRes();
//				 res.setCode(WsRes.FAIL);
//			     res.setMsg("请登录");
//			} else {
//				controller.redirect("/login");
//			}  
//		}  else {
//			inv.invoke();
//		}
//		
//	}
//}
