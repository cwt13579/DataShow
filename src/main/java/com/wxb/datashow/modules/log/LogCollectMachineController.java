package com.wxb.datashow.modules.log;

import com.demo.common.model.log.LogCollectMachine;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.UUIDUtil;
import com.wxb.datashow.common.WsRes;

public class LogCollectMachineController extends BaseController {
	public void index() {
		render("logcollectmachineList.jsp");
	}

	public void logCollectMachineListInvoke() {
		WsRes res = new WsRes();
		Page<LogCollectMachine> page = LogCollectMachine.dao
				.getAllLogCollectMachine(getPageCurrent(), getPageSize(),
						getQueryMap());

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

	public void logCollectMachineAdd() {
		renderJsp("logcollectmachineAdd.jsp");
	}

	@Before({ Tx.class })
	public void logCollectMachineSaveInvoke() {
		WsRes res = new WsRes();
		LogCollectMachine LogCollectMachine = getModel(LogCollectMachine.class,
				"logCollectMachine");
		LogCollectMachine.setMachineId(UUIDUtil.getId());
		LogCollectMachine.save();

		renderJson(res);
	}

	public void logCollectMachineEdit() throws Exception {
		String id = getPara("machine_id");
		LogCollectMachine logCollectMachine = LogCollectMachine.dao
				.findById(id);
		setAttr("logCollectMachine", logCollectMachine);
		render("logcollectmachineEdit.jsp");
	}

	public void logCollectMachineUpdateInvoke() {
		WsRes res = new WsRes();
		LogCollectMachine LogCollectMachine = getModel(LogCollectMachine.class,
				"logCollectMachine");
		LogCollectMachine.update();
		renderJson(res);
	}

	public void logCollectMachineDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("machine_id");
		LogCollectMachine logCollectMachine = LogCollectMachine.dao
				.findById(id);
		logCollectMachine.delete();
		renderJson(res);
	}
}
