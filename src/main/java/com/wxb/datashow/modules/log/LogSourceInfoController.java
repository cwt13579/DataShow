package com.wxb.datashow.modules.log;

import com.demo.common.model.log.LogSourceInfo;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.UUIDUtil;
import com.wxb.datashow.common.WsRes;

public class LogSourceInfoController extends BaseController{

	public void index() {
		render("logsourceinfoList.jsp");
	}

	public void logSourceInfoListInvoke() {
		WsRes res = new WsRes();
		Page<LogSourceInfo> page = LogSourceInfo.dao.getAllLogSourceInfo(
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

	public void logSourceInfoAdd() {
		renderJsp("logsourceinfoAdd.jsp");
	}

	@Before({ Tx.class })
	public void logSourceInfoSaveInvoke() {
		WsRes res = new WsRes();
		LogSourceInfo logsourceinfo = getModel(LogSourceInfo.class,"logSourceInfo");
		logsourceinfo.setSrcId(UUIDUtil.getId());
		logsourceinfo.save();

		renderJson(res);
	}

	public void logSourceInfoEdit() throws Exception {
		String id = getPara("src_id");
		LogSourceInfo logsourceinfo = LogSourceInfo.dao.findById(id);
		setAttr("logSourceInfo", logsourceinfo);
		render("logsourceinfoEdit.jsp");
	}

	public void logSourceInfoUpdateInvoke() {
		WsRes res = new WsRes();
		LogSourceInfo logsourceinfo = getModel(LogSourceInfo.class,"logSourceInfo");
		logsourceinfo.update();
		renderJson(res);
	}

	public void logSourceInfoDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("src_id");
		LogSourceInfo logsourceinfo = LogSourceInfo.dao.findById(id);
		logsourceinfo.delete();
		renderJson(res);
	}
}
