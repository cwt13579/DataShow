package com.wxb.datashow.modules.product;

import com.demo.common.model.Product;
import com.jfinal.plugin.activerecord.Page;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class ProductController extends BaseController {

  public void index() {
    render("productList.html");
  }

  public void productListInvoke() {
    WsRes res = new WsRes();
    Page<Product> page = Product.dao.getAllProduct(getPageCurrent(), getPageSize(), getQueryMap());
    // List<Product> list = page.getList();

    if (page != null) {
      res.setCode(WsRes.SUCCESS);
      res.setData(page);
      res.setMsg("成功");
    } else {
      res.setCode(WsRes.FAIL);
      res.setMsg("失败");
    }
    renderJson(res);
  }
}
