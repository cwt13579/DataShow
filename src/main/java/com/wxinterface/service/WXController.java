package com.wxinterface.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.demo.common.model.Label;
import com.demo.common.model.PreOrder;
import com.demo.common.model.Product;
import com.demo.common.model.ProductRule;
import com.demo.common.model.Region;
import com.demo.common.model.SysDict;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class WXController extends BaseController {

  /**
   * 获取刷选产品
   */
  public void getProductBy() {
    WsRes res = new WsRes();
    List<Product> resultList = Product.dao.getProductBy(getAllQueryMap());
    // 这里算法过滤 匹配规则
    for(Product item : resultList) {
    	List<Label> lableList = Label.dao.getLabelByProductId(item.getId());
    	item.put("lableList", lableList);
    }
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

  /**
   * 预约
   */
  public void submitOrder() {
    WsRes res = new WsRes();
    String orderTel = getRequest().getParameter("orderTel");
    String userName = getRequest().getParameter("userName");
    String orderProduct = getRequest().getParameter("orderProduct");
    String orderArea = getRequest().getParameter("orderArea");

    PreOrder preOrder = new PreOrder();
    preOrder.setOrderArea(Long.valueOf(orderArea));
    preOrder.setOrderProduct(Integer.valueOf(orderProduct));
    preOrder.setOrderTel(orderTel);
    preOrder.setUserName(userName);
    preOrder.setOrderTime(new Date());
    preOrder.setOrderStatus(0);
    preOrder.save();
    renderJson(res);
  }

  /**
   * 获取地区信息 
   */
  public void regionInvoke() {
    WsRes res = new WsRes();
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<Region> regionList = Region.dao.getAllProvice();
    for (Region region : regionList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(region.getRegionId()));
      map.put("note", region.getRegionName());
      list.add(map);

    }
    res.setData(list);
    renderJson(res);
  }

  /**
   * 数据字典接口
   */
  public void sysDictInvoke() {
    String dataType = getPara("dataType");
    WsRes res = new WsRes();
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<SysDict> dataList = SysDict.dao.getAllData(dataType);
    for (SysDict item : dataList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(item.getDataValue()));
      map.put("note", item.getDataName());
      list.add(map);
    }
    res.setData(list);
    renderJson(res);
  }
}
