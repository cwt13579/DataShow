package com.wxb.datashow.modules.log;

import java.util.UUID;

import com.demo.common.model.log.BizSysInfo;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.UUIDUtil;
import com.wxb.datashow.common.WsRes;

public class BizSysInfoController extends BaseController {

	public void index() {
		render("bizsysList.jsp");
	}

	public void bizsysListInvoke() {
		WsRes res = new WsRes();
		Page<BizSysInfo> page = BizSysInfo.dao.getAllBizSysInfo(
				getPageCurrent(), getPageSize(), getQueryMap());

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

	public void bizsysAdd() {
		renderJsp("bizsysAdd.jsp");
	}

	@Before({ Tx.class })
	public void bizSysInfoSaveInvoke() {
		WsRes res = new WsRes();
		BizSysInfo bizsys = getModel(BizSysInfo.class, "bizSysInfo");
		bizsys.setSysId(UUIDUtil.getId());
		bizsys.save();

		renderJson(res);
	}

	public void bizsysEdit() throws Exception {
		String id = getPara("sys_id");
		BizSysInfo bizsys = BizSysInfo.dao.findById(id);
		setAttr("bizSysInfo", bizsys);
		render("bizsysEdit.jsp");
	}

	public void bizsysUpdateInvoke() {
		WsRes res = new WsRes();
		BizSysInfo bizsys = getModel(BizSysInfo.class, "bizSysInfo");
		bizsys.update();
		renderJson(res);
	}

	public void bizsysDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("sys_id");
		BizSysInfo bizsys = BizSysInfo.dao.findById(id);
		bizsys.delete();
		renderJson(res);
	}
}
