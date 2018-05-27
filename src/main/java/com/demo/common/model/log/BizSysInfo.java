package com.demo.common.model.log;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.log.base.BaseBizSysInfo;
import com.jfinal.plugin.activerecord.Page;

/**
 * Generated by JFinal.
 */
@SuppressWarnings("serial")
public class BizSysInfo extends BaseBizSysInfo<BizSysInfo> {
	public static final BizSysInfo dao = new BizSysInfo() ;
 
	
	 public Page<BizSysInfo> getAllBizSysInfo(int current, int pageSize, Map<String, String> map) {
		    List<String> paramList = new ArrayList<String>();
		    StringBuilder condition = new StringBuilder();
		    String name = map.get("sys_name");

		    String from = "FROM  biz_sys_info a where 1=1 ";
		    condition.append(from);

		    if (!StringUtils.isBlank(name)) {
		      condition.append(" and a.sys_name like ?");
		      paramList.add("%" + name + "%");
		    }

		    Page<BizSysInfo> page =
		        paginate(current, pageSize, "SELECT * ", condition.toString(),
		            paramList.toArray(new Object[] {}));

		    if (page != null && page.getList() != null) {
		      if (current > 1 && page.getList().isEmpty()) {
		        page = getAllBizSysInfo(current - 1, pageSize, map);
		      }
		    }
		    return page;
		  }
	 
	 public List<BizSysInfo> getBizSysInfoList() {
		 return find("select * from biz_sys_info");
	 }
}