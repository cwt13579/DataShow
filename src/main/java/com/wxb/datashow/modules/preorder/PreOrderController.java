package com.wxb.datashow.modules.preorder;

import com.demo.common.model.PreOrder;
import com.jfinal.aop.Before;
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

  public void preOrderAdd() {
    renderJsp("preOrderAdd.jsp");
  }
  @Before({Tx.class})
  public void preOrderSaveInvoke() {
    WsRes res = new WsRes();
    PreOrder PreOrder = getModel( PreOrder.class);
    PreOrderVo order = getBean(PreOrderVo.class);
    PreOrder.save();
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
}
