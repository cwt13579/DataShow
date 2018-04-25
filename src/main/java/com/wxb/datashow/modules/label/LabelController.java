package com.wxb.datashow.modules.label;

import com.demo.common.model.Label;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class LabelController extends BaseController{
  public void index() {
    render("labelList.jsp");
  }

  public void labelListInvoke() {
    WsRes res = new WsRes();
    Page<Label> page = Label.dao.getAllLabel(getPageCurrent(), getPageSize(), getQueryMap());
    // List<Label> list = page.getList();

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

  public void labelAdd() {
    renderJsp("labelAdd.jsp");
  }

  @Before({Tx.class})
  public void labelSaveInvoke() {
    WsRes res = new WsRes();
    Label label = getModel(Label.class, "label");
    label.save();

    renderJson(res);
  }

  public void labelEdit() throws Exception {
    String id = getPara("id");
    Label label = Label.dao.findById(id);
   
    setAttr("label", label);
     render("labelEdit.jsp");
  }

  public void labelUpdateInvoke() {
    WsRes res = new WsRes();
    Label Label = getModel(Label.class, "label");
    Label.update();

    renderJson(res);
  }

  public void LabelDeleteInvoke() {
    WsRes res = new WsRes();
    String id = getPara("id");
    Label label = Label.dao.findById(id);
    label.delete();
    renderJson(res);
  }
}
