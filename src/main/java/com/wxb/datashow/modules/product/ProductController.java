package com.wxb.datashow.modules.product;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.Product;
import com.demo.common.model.ProductRegion;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class ProductController extends BaseController {

  public void index() {
    render("productList.jsp");
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
    renderJsp("productAdd.jsp");
  }

  @Before({Tx.class})
  public void productSaveInvoke() {
    WsRes res = new WsRes();
    Product product = getModel(Product.class, "product");
    product.save();

    String[] regionIds = getParaValues("productRegion.region_id");
    ProductRegion.dao.deleteByProductId(product.getId().longValue());
    for (String item : regionIds) {
      ProductRegion productRegion = new ProductRegion();
      productRegion.setProductId(product.getId().longValue());
      productRegion.setRegionId(Long.valueOf(item));
      productRegion.save();
    }

    renderJson(res);
  }

  public void productEdit() throws Exception {
    String id = getPara("id");
    Product product = Product.dao.findById(id);
    List<ProductRegion> productRegions = ProductRegion.dao.getProductRegionByProductId(id);
    List<Long> regions = new ArrayList<Long>();
    for (ProductRegion item : productRegions) {
      regions.add(item.getRegionId());
    }
    setAttr("product", product);
    setAttr("regions", StringUtils.join(regions,","));
    render("productEdit.jsp");
  }

  public void productUpdateInvoke() {
    WsRes res = new WsRes();
    Product product = getModel(Product.class, "product");
    product.update();

    //处理区域下拉框
    String[] regionIds = getParaValues("productRegion.region_id");
    ProductRegion.dao.deleteByProductId(product.getId().longValue());
    for (String item : regionIds) {
      ProductRegion productRegion = new ProductRegion();
      productRegion.setProductId(product.getId().longValue());
      productRegion.setRegionId(Long.valueOf(item));
      productRegion.save();
    }


    renderJson(res);
  }

  public void productDeleteInvoke() {
    WsRes res = new WsRes();
    String id = getPara("id");
    Product product = Product.dao.findById(id);
    product.delete();
    renderJson(res);
  }
}
