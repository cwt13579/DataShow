package com.wxb.datashow.web.controller;

import com.demo.common.model.SysDict;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class SysDictController extends BaseController{
  public void index() {
    render("sysDictList.jsp");
  }

  public void sysDictListInvoke() {
    WsRes res = new WsRes();
    Page<SysDict> page = SysDict.dao.getAllSysDict(getPageCurrent(), getPageSize(), getQueryMap());
 

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
  
  public void sysDictAdd() {
	  render("sysDictAdd.jsp");
  }
  
  @Before({Tx.class})
  public void sysDictSaveInvoke() {
    WsRes res = new WsRes();
    SysDict sysDict = getModel(SysDict.class, "sysDict");
    sysDict.setStatus(1);
    sysDict.setCreateTime(new java.util.Date ());
    sysDict.save();

    renderJson(res);
  }
  public void sysDictEdit() throws Exception {
	    String id = getPara("id");
	    SysDict sysDict = SysDict.dao.findById(id);
	   
	    setAttr("sysDict", sysDict);
	     render("sysDictEdit.jsp");
	  }

	  public void sysDictUpdateInvoke() {
	    WsRes res = new WsRes();
	    SysDict sysDict = getModel(SysDict.class, "sysDict");
	    sysDict.setStatus(1);
	    sysDict.update();

	    renderJson(res);
	  }
  public void sysDictDeleteInvoke() {
	    WsRes res = new WsRes();
	    String id = getPara("id");
	    SysDict sysDict = SysDict.dao.findById(id);
	    sysDict.delete();
	    renderJson(res);
	  }
}
