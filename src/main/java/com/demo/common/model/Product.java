package com.demo.common.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.demo.common.model.base.BaseProduct;
import com.jfinal.plugin.activerecord.Page;

public class Product extends BaseProduct<Product>
{
    public static final Product dao;
    
    public Page<Product> getAllProduct(final int current, final int pageSize, final Map<String, String> map) {
        final List<Object> paramList = new ArrayList<Object>();
        final StringBuilder condition = new StringBuilder();
        final String name = map.get("product_name");
        final String from = "FROM  product a where 1=1 ";
        condition.append(from);
        if (!StringUtils.isBlank((CharSequence)name)) {
            condition.append(" and a.product_name like ?");
            paramList.add("%" + name + "%");
        }
        Page<Product> page = (Page<Product>)this.paginate(current, pageSize, "SELECT * ", condition.toString(), paramList.toArray(new Object[0]));
        if (page != null && page.getList() != null && current > 1 && page.getList().isEmpty()) {
            page = this.getAllProduct(current - 1, pageSize, map);
        }
        return page;
    }
    
    public List<Product> getProductBy(final Map<String, String[]> map) {
        final List<Object> paramList = new ArrayList<Object>();
        final StringBuilder condition = new StringBuilder();
        final String from = "select DISTINCT a.* FROM  product a inner join product_rule_relation d  on a.id=d.product_id inner join product_rule b on d.rule_id=b.id inner join product_region c on a.id=c.product_id where 1=1 ";
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_amount"))) {
            condition.append(" and a.product_limit >= ?");
            paramList.add(map.get("loan_amount")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_term"))) {
            condition.append(" and b.loan_term <= ?");
            paramList.add(map.get("loan_term")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_workyears"))) {
            condition.append(" and b.loan_workyears <= ?");
            paramList.add(map.get("loan_workyears")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_income"))) {
            condition.append(" and b.loan_income <= ?");
            paramList.add(map.get("loan_income")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_house"))) {
            condition.append(" and FIND_IN_SET( ? , b.loan_house)");
            paramList.add(map.get("loan_house")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_car"))) {
            condition.append(" and FIND_IN_SET( ? , b.loan_car)");
            paramList.add(map.get("loan_car")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_work"))) {
            condition.append(" and FIND_IN_SET( ? , b.loan_work)");
            paramList.add(map.get("loan_work")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_age"))) {
            condition.append(" and b.loan_age <= ?");
            paramList.add(map.get("loan_age")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_area"))) {
            condition.append(" and c.region_id = ?");
            paramList.add(map.get("loan_area")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("product_period"))) {
            condition.append(" and FIND_IN_SET( ? , a.product_period)");
            paramList.add(map.get("product_period")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_credit"))) {
            condition.append(" and FIND_IN_SET( ? , b.loan_credit)");
            paramList.add(map.get("loan_credit")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_bisyears"))) {
            condition.append(" and FIND_IN_SET( ? , b.loan_bisyears)");
            paramList.add(map.get("loan_bisyears")[0]);
        }
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_bisincome"))) {
            condition.append(" and b.loan_bisincome <= ?");
            paramList.add(map.get("loan_bisincome")[0]);
        }
        
        if (!StringUtils.isAllBlank((CharSequence[])map.get("loan_insurance"))) {
        	System.out.println((String[])map.get("loan_insurance"));
            condition.append(" and (  ");
            int count=0;
            for(String insuranceItem : (String[])map.get("loan_insurance")) {
            	System.out.println("insuranceItem="+insuranceItem);
            	if(count==0) {
            		condition.append("  FIND_IN_SET( ? , b.loan_insurance)");
                	paramList.add(insuranceItem);
            	} else {
            		condition.append(" or FIND_IN_SET( ? , b.loan_insurance)");
                	paramList.add(insuranceItem);
            	}
            	count++;
            }
            condition.append("  ) ");
            
        }
        return (List<Product>)this.find(from + condition.toString(), paramList.toArray(new Object[0]));
    }
    
    static {
        dao = (Product)new Product().dao();
    }
}
