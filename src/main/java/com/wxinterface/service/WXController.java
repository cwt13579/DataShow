package com.wxinterface.service;

import java.util.List;

import com.demo.common.model.Product;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class WXController extends BaseController{

  public void getProductBy() {
    WsRes res = new WsRes();
    List<Product> resultList = Product.dao.getProductBy(getQueryMap());
    //这里算法过滤
    res.setData(resultList);
    renderJson(res);
  }
}
