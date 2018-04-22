package com.demo.common.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.base.BasePreOrder;
import com.jfinal.plugin.activerecord.Page;

/**
 * Generated by JFinal.
 */
@SuppressWarnings("serial")
public class PreOrder extends BasePreOrder<PreOrder> {
	public static final PreOrder dao = new PreOrder().dao();
	
	 public Page<PreOrder> getAllPreOrder(int current, int pageSize, Map<String, String> map) {
       List<Object> paramList = new ArrayList<Object>();
       StringBuilder condition = new StringBuilder();
       String name = map.get("product_name");

       String from = "FROM  pre_order a where 1=1 ";
       condition.append(from);

       if (!StringUtils.isBlank(name)) {
         condition.append(" and a.order_name like ?");
         paramList.add("%" + name + "%");
       }

       Page<PreOrder> page = paginate(current, pageSize, "SELECT * ", condition.toString(), paramList.toArray(new Object[] {}));

       if (page != null && page.getList() != null) {
         if (current > 1 && page.getList().isEmpty()) {
           page = getAllPreOrder(current - 1, pageSize, map);
         }
       }
       return page;
     }
}