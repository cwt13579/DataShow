package com.wxb.datashow.modules.preorder;

import java.util.List;

import com.demo.common.model.PreOrder;
import com.jfinal.aop.Before;
import com.jfinal.ext.render.excel.PoiRender;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;
import com.wxinterface.vo.PreOrderVo;

public class PreOrderController extends BaseController{
  public void index() {
    render("preOrderList.jsp");
  }

  public void preOrderListInvoke() {
    WsRes res = new WsRes();
    Page<PreOrder> page = PreOrder.dao.getAllPreOrder(getPageCurrent(), getPageSize(), getQueryMap());
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

  public void preOrderHandleInvoke() {
	  WsRes res = new WsRes();
	  String id = getPara("id");
	  PreOrder preOrder = PreOrder.dao.findById(id);
	  preOrder.set("order_status", 1);
	  preOrder.update();
	  renderJson( res );
  }
  public void preOrderAdd() {
    renderJsp("preOrderAdd.jsp");
  }
  @Before({Tx.class})
  public void preOrderSaveInvoke() {
    WsRes res = new WsRes();
    PreOrder PreOrder = getModel( PreOrder.class);
    PreOrderVo order = getBean(PreOrderVo.class);
 
    renderJson( res );
  }
  public void preOrderEdit() throws Exception {
    String id = getPara("id");
    PreOrder preOrder = PreOrder.dao.findById(id);
    setAttr("preOrder",preOrder);
    render("preOrderEdit.jsp");
  }
  
  public void preOrderUpdateInvoke() {
    WsRes res = new WsRes();
    PreOrder preOrder = getModel( PreOrder.class, "preOrder" );
     
    preOrder.update();
    renderJson( res );
  }
  
  public void preOrderDeleteInvoke() {
    WsRes res = new WsRes();
    String id = getPara("id");
    PreOrder preOrder = PreOrder.dao.findById(id);
    preOrder.delete();
    renderJson( res );
  }
  
  public void exportPreOrder() {
	  String[]  header={"预约编号","预约产品","客户名称","联系电话","预约时间","预约地区"};
      String[]  columns={"id","product_name","user_name","order_tel","order_time","region_name"};
      List<PreOrder> objs= PreOrder.dao.getPreOrders();
      PoiRender  poiRender = PoiRender.me(objs).fileName("preorder.xls").sheetName("预约列表").headers(header).columns(columns).cellWidth(3000);
	  render(poiRender);
  }
}
