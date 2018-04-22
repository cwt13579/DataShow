package com.wxinterface.service;

import java.util.Date;
import java.util.List;

import com.demo.common.model.PreOrder;
import com.demo.common.model.Product;
import com.demo.common.model.ProductRule;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class WXController extends BaseController{
 
   /**
    * 获取刷选产品
    */
  public void getProductBy() {
    WsRes res = new WsRes();
     
    List<Product> resultList = Product.dao.getProductBy(getQueryMap());
    //这里算法过滤 匹配规则
    res.setData(resultList);
    renderJson(res);
  }
  /**
   * 获取帅选规则
   */
  public void getProductRuleBy() {
    WsRes res = new WsRes();
     
    List<ProductRule> resultList = ProductRule.dao.getProductRuleBy(getQueryMap());
    
    res.setData(resultList);
    renderJson(res);
  }
  
  public void submitOrder() {
    WsRes res = new WsRes();
    String orderTel = getAttr("orderTel");
    Integer orderProduct = getAttrForInt("orderProduct");
    String orderArea = getAttr("orderArea");
    
    PreOrder preOrder = new PreOrder();
    preOrder.setOrderArea(orderArea);
    preOrder.setOrderProduct(orderProduct);
    preOrder.setOrderTel(orderTel);
    preOrder.setOrderTime(new Date());
    
    preOrder.save();
    renderJson(res);
  }
}
