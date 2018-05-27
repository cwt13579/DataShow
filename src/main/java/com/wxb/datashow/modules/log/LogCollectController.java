package com.wxb.datashow.modules.log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import com.demo.common.model.log.LogCollect;
import com.demo.common.model.log.LogCollectMachine;
import com.demo.common.model.log.LogSourceInfo;
import com.demo.common.model.log.SrcCollectMachine;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.UUIDUtil;
import com.wxb.datashow.common.WsRes;

public class LogCollectController extends BaseController {
	public void index() {
		render("logcollectList.jsp");
	}

	public void logCollectListInvoke() {
		WsRes res = new WsRes();
		Page<LogCollect> page = LogCollect.dao.getAllLogCollect(
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

	public void logCollectAdd() {
		renderJsp("logcollectAdd.jsp");
	}

	@Before({ Tx.class })
	public void logCollectSaveInvoke() {
		WsRes res = new WsRes();
		LogCollect logCollect = getModel(LogCollect.class, "logCollect");
		SrcCollectMachine srcCollectMachine = getModel(SrcCollectMachine.class,
				"srcCollectMachine");
		logCollect.setCollectId(UUIDUtil.getId());
		logCollect.save();

		srcCollectMachine.setId(UUIDUtil.getId());
		srcCollectMachine.setCollectId(logCollect.getCollectId());
		srcCollectMachine.save();
		renderJson(res);
	}

	public void logCollectEdit() throws Exception {
		String id = getPara("collect_id");
		LogCollect logCollect = LogCollect.dao.findById(id);
		setAttr("logCollect", logCollect);
		render("logcollectEdit.jsp");
	}

	public void logCollectUpdateInvoke() {
		WsRes res = new WsRes();
		LogCollect logCollect = getModel(LogCollect.class, "logCollect");
		SrcCollectMachine srcCollectMachine = getModel(SrcCollectMachine.class,"srcCollectMachine");
		logCollect.update();
		SrcCollectMachine.dao.deleteByCollectId(logCollect.getCollectId());
		srcCollectMachine.setId(UUIDUtil.getId());
		srcCollectMachine.setCollectId(logCollect.getCollectId());
		srcCollectMachine.save();
		renderJson(res);
	}

	public void logCollectDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("collect_id");
		LogCollect logCollect = LogCollect.dao.findById(id);
		logCollect.delete();
		renderJson(res);
	}

	public void logCollectStartInvoke() {
		WsRes res = new WsRes();
		String id = getPara("collect_id");
		LogCollect logCollect = LogCollect.dao.findById(id);
		// 1.获取input配置文件
		LogSourceInfo logSourceInfo = LogSourceInfo.dao.findById(logCollect.getSrcId());
		SrcCollectMachine srcCollectMachine = SrcCollectMachine.dao.getByCollectId(logCollect.getCollectId());
		LogCollectMachine logCollectMachine = LogCollectMachine.dao.findById(srcCollectMachine.getMachineId());
		logSourceInfo.getSrcType();
		logSourceInfo.getSrcPath();
		// 2.修改配置文件 path/bin/logstash-all.conf
		String configPath = logCollectMachine.getServicePath() + File.separator + "bin"+ File.separator + "logstash-all.conf";
		String lineSeparator = System.getProperty("line.separator");
		
		String fileInputFormat = "file {" + lineSeparator 
				+ "path => [\""+logSourceInfo.getSrcPath()+"\"] " + lineSeparator 
				+ "type => \""+logCollect.getCollectEsType()+"\" "+ lineSeparator 
				+ "start_position => \"beginning\" " + lineSeparator 
				+ "}"+ lineSeparator;
		FileWriter fw = null;
		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(configPath));
			String line = null;
			StringBuilder logstashConf = new StringBuilder();
			String preLine = null;
			while((line=br.readLine())!=null) {
				if(preLine != null && preLine.contains("input")) {
					logstashConf.append(fileInputFormat+lineSeparator);
				} else {
					logstashConf.append(line+lineSeparator);
				}
				preLine = line;
			}
			System.out.println(logSourceInfo.getSrcPath());
			System.out.println(logstashConf);
			fw = new FileWriter(configPath);
			fw.write(logstashConf.toString());
			
		}catch(Exception e) {
			e.printStackTrace();
		}finally{
			try {
				fw.close();
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
		
		renderJson(res);
	}
}
