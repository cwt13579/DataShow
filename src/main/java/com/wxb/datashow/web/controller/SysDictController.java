package com.wxb.datashow.web.controller;

import com.demo.common.model.SysDict;
import com.jfinal.plugin.activerecord.Page;
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
}
