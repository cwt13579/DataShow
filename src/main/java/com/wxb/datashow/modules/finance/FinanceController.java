package com.wxb.datashow.modules.finance;

import com.demo.common.model.Finance;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class FinanceController extends BaseController{


	  public void index() {
	    render("financeList.jsp");
	  }

	  public void financeListInvoke() {
	    WsRes res = new WsRes();
	    Page<Finance> page = Finance.dao.getAllFinance(getPageCurrent(), getPageSize(), getQueryMap());

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

	  public void financeAdd() {
	    renderJsp("financeAdd.jsp");
	  }

	  @Before({Tx.class})
	  public void financeSaveInvoke() {
	    WsRes res = new WsRes();
	    Finance finance = getModel(Finance.class, "finance");
	    finance.save();

	    
	    renderJson(res);
	  }

	  public void financeEdit() throws Exception {
	    String id = getPara("id");
	    Finance finance = Finance.dao.findById(id);
	    setAttr("finance",finance); 
	    render("financeEdit.jsp");
	  }

	  public void financeUpdateInvoke() {
	    WsRes res = new WsRes();
	    Finance finance = getModel(Finance.class, "finance");
	    finance.update();
	    renderJson(res);
	  }

	  public void financeDeleteInvoke() {
	    WsRes res = new WsRes();
	    String id = getPara("id");
	    Finance finance = Finance.dao.findById(id);
	    finance.delete();
	    renderJson(res);
	  }
}
