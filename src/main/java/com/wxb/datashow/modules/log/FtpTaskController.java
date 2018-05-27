package com.wxb.datashow.modules.log;

import com.demo.common.model.log.FtpTask;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class FtpTaskController extends BaseController {

	public void index() {
		render("ftpTaskList.jsp");
	}

	public void ftpTaskListInvoke() {
		WsRes res = new WsRes();
		Page<FtpTask> page = FtpTask.dao.getAllFtpTask(getPageCurrent(), getPageSize(), getQueryMap());

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

	public void ftpTaskAdd() {
		renderJsp("ftpTaskAdd.jsp");
	}

	@Before({ Tx.class })
	public void ftpTaskSaveInvoke() {
		WsRes res = new WsRes();
		FtpTask ftptask = getModel(FtpTask.class, "ftpTask");
		ftptask.save();

		renderJson(res);
	}

	public void ftptaskEdit() throws Exception {
		String id = getPara("id");
		FtpTask ftptask = FtpTask.dao.findById(id);
		setAttr("ftpTask", ftptask);
		render("ftpTaskEdit.jsp");
	}

	public void ftptaskUpdateInvoke() {
		WsRes res = new WsRes();
		FtpTask ftptask = getModel(FtpTask.class, "ftpTask");
		ftptask.update();
		renderJson(res);
	}

	public void ftptaskDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("id");
		FtpTask ftptask = FtpTask.dao.findById(id);
		ftptask.delete();
		renderJson(res);
	}

}
