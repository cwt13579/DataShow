package com.wxb.datashow.modules.product;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.Product;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
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

  public void productAdd() {
    renderJsp("productAdd.html");
  }
  @Before({Tx.class})
  public void productSaveInvoke() {
    WsRes res = new WsRes();
    Product product = getModel( Product.class, "product" );
    String[] loanWorks = getParaValues("product.loan_work");
    String[] loanHouses = getParaValues("product.loan_house");
    product.setLoanWork(StringUtils.join(loanWorks,","));
    product.setLoanHouse(StringUtils.join(loanHouses,","));
    product.save();
    renderJson( res );
  }
  public void productEdit() throws Exception {
    String id = getPara("id");
    Product product = Product.dao.findById(id);
    setAttr("product",product);
    render("productEdit.html");
  }
  
  public void productUpdateInvoke() {
    WsRes res = new WsRes();
    Product product = getModel( Product.class, "product" );
    product.update();
    renderJson( res );
  }
}
