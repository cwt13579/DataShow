package com.wxb.datashow.modules.product;

import java.io.File;
import java.io.FileNotFoundException;

import com.demo.common.model.StatisticsRecord;
import com.demo.common.model.SysDict;
import com.demo.utils.fileupload.PoiExt;
import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.upload.UploadFile;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class StatisticsRecordController extends BaseController {
	public void index() {
		render("statisticsRecordList.jsp");
	}

	public void statisticsRecordListInvoke() {
		WsRes res = new WsRes();
		Page<StatisticsRecord> page = StatisticsRecord.dao
				.getAllStatisticsRecord(getPageCurrent(), getPageSize(),
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

	public void statisticsRecordAdd() {
		render("statisticsRecordAdd.jsp");
	}

	@Before({ Tx.class })
	public void statisticsRecordSaveInvoke() {
		WsRes res = new WsRes();
		StatisticsRecord statisticsRecord = getModel(StatisticsRecord.class,
				"statisticsRecord");

		statisticsRecord.save();

		renderJson(res);
	}

	public void StatisticsRecordEdit() throws Exception {
		String id = getPara("id");
		StatisticsRecord statisticsRecord = StatisticsRecord.dao.findById(id);

		setAttr("statisticsRecord", statisticsRecord);
		render("statisticsRecordEdit.jsp");
	}

	public void StatisticsRecordUpdateInvoke() {
		WsRes res = new WsRes();
		StatisticsRecord statisticsRecord = getModel(StatisticsRecord.class,
				"statisticsRecord");

		statisticsRecord.update();

		renderJson(res);
	}

	public void statisticsRecordDeleteInvoke() {
		WsRes res = new WsRes();
		String id = getPara("id");
		StatisticsRecord statisticsRecord = StatisticsRecord.dao.findById(id);
		statisticsRecord.delete();
		renderJson(res);
	}
	
	public void importStasticsRecord()  {
		 WsRes res = new WsRes();
		 UploadFile uf = getFile("excelUpload", "uploads");
		 File uploadFile = uf.getFile();
		 try {
			 PoiExt.ReadExcel(uploadFile, "insert into statistics_record(user_name,user_account,org_code,org_name,recommend_count,apply_count,date) values(?,?,?,?,?,?,?)", 7);

		 }catch(Exception e) {
			 e.printStackTrace();
		 }
		 //render("statisticsRecordList.jsp");
		 redirect("/statisticsRecord");
	}
	
	public void importOrgRecord()  {
		 WsRes res = new WsRes();
		 UploadFile uf = getFile("orgExcelUpload", "uploads");
		 File uploadFile = uf.getFile();
		 try {
			 PoiExt.ReadExcel(uploadFile, "update sys_dict set remark=?,ext1=? where data_type='Org' and data_value=?", 3);

		 }catch(Exception e) {
			 e.printStackTrace();
		 }
		 //render("statisticsRecordList.jsp");
		 redirect("/statisticsRecord/orgIndex");
	}
	
	public void importTemplate() {
		renderFile(new File(""));
	}
	
	public void orgIndex() {
		render("orgList.jsp");
	}
	
	public void orgListInvoke() {
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
