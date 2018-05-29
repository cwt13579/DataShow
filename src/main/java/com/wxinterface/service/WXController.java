package com.wxinterface.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.demo.common.model.Finance;
import com.demo.common.model.Label;
import com.demo.common.model.PreOrder;
import com.demo.common.model.Product;
import com.demo.common.model.ProductRule;
import com.demo.common.model.Region;
import com.demo.common.model.StatisticsRecord;
import com.demo.common.model.SysDict;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.common.WsRes;

public class WXController extends BaseController {

  /**
   * 获取刷选产品
   */
  public void getProductBy() {
    WsRes res = new WsRes();
    List<Product> resultList = Product.dao.getProductBy(getAllQueryMap());
    
    for(Product item : resultList) {
    	//添加label
    	List<Label> lableList = Label.dao.getLabelByProductId(item.getId());
    	item.put("lableList", lableList);
    	 //添加interest_way_str
    	String[] interestWays =  item.getInterestWay().split(",");
    	List<String> interestWayStrs = new ArrayList<String>();
    	for(String index : interestWays) {
    		SysDict sysDict = SysDict.dao.findSysDictByValue("InterestWay",Integer.valueOf(index));
    		interestWayStrs.add(sysDict.getDataName());
    	}
    	
    	item.put("interest_way_str", StringUtils.join(interestWayStrs,","));
    }
   
    res.setData(resultList);
    renderJson(res);
  }

  /**
   * 获取帅选规则
   */
  public void getProductRuleBy() {
    WsRes res = new WsRes();

    List<ProductRule> resultList = ProductRule.dao.getProductRuleBy(getQueryMap());

    res.setData(resultList);
    renderJson(res);
  }
  /**
   * 获取理财产品接口
   */
  public void getFinanceList() {
	  WsRes res = new WsRes();
	  List<Finance> resultList = Finance.dao.getFinanceList();
	  res.setData(resultList);
	  renderJson(res);
  }
  /**
   * 预约
   */
  public void submitOrder() {
    WsRes res = new WsRes();
    String orderTel = getRequest().getParameter("orderTel");
    String userName = getRequest().getParameter("userName");
    String orderProduct = getRequest().getParameter("orderProduct");
    String orderArea = getRequest().getParameter("orderArea");

    PreOrder preOrder = new PreOrder();
    preOrder.setOrderArea(Long.valueOf(orderArea));
    preOrder.setOrderProduct(Integer.valueOf(orderProduct));
    preOrder.setOrderTel(orderTel);
    preOrder.setUserName(userName);
    preOrder.setOrderTime(new Date());
    preOrder.setOrderStatus(0);
    preOrder.save();
    renderJson(res);
  }

  public void getTop10() {
	  WsRes res = new WsRes();
	  BigDecimal k1 = BigDecimal.valueOf(0.6);
	  BigDecimal k2 = BigDecimal.valueOf(0.4);
 
	  StatisticsRecord recommendCount = StatisticsRecord.dao.getMaxPersonRecommendCount();
	  int standardRecommendedCount = recommendCount.getRecommendCount();
	  List<StatisticsRecord> resultList = StatisticsRecord.dao.getStatisticsRecordList(k1,k2,standardRecommendedCount);

	  //计算综合得分
	  if(resultList != null && resultList.size() > 0) {
		  for(StatisticsRecord item : resultList) { 
			  item.put("score", item.getBigDecimal("score").setScale(2, BigDecimal.ROUND_UP));
		  }
	  }
	  //根据综合评分排序
	  Collections.sort(resultList, new Comparator<StatisticsRecord>() {
		@Override
		public int compare(StatisticsRecord o1, StatisticsRecord o2) {
			return o2.getBigDecimal("score").compareTo(o1.getBigDecimal("score"));
		}
	  });
	  res.setData(resultList);
	  renderJson(res);
  }
  
  public void getTop5InOrg() {
	  WsRes res = new WsRes();
	  String orgCode = getRequest().getParameter("org_code");
	  if(StringUtils.isBlank(orgCode)) {
		  res.setCode(WsRes.FAIL);
		  res.setMsg("org_code is null");
		  renderJson(res);
		  return;
	  }
	  BigDecimal k1 = BigDecimal.valueOf(0.6);
	  BigDecimal k2 = BigDecimal.valueOf(0.4);
	  int standardRecommendedCount = StatisticsRecord.dao.getMaxPersonRecommendCount().getRecommendCount().intValue();
	  List<StatisticsRecord> resultList = StatisticsRecord.dao.getStatisticsRecordListByOrg(k1,k2,standardRecommendedCount,orgCode);
	  
	  
	  //BigDecimal percent = BigDecimal.valueOf(100);
	  //计算综合得分
	  if(resultList != null && resultList.size() > 0) {
		  for(StatisticsRecord item : resultList) {
			  //BigDecimal v1 = BigDecimal.valueOf(item.getRecommendCount()).divide(BigDecimal.valueOf(standardRecommendedCount),2, BigDecimal.ROUND_HALF_EVEN);
			  //BigDecimal v2 = BigDecimal.valueOf(item.getDouble("transfer_rate"));
			  //BigDecimal value = v1.multiply(k).add( v2.multiply(k)).multiply(percent).setScale(2, BigDecimal.ROUND_UP);
			  //DecimalFormat df = new DecimalFormat("0.00");  
			  //String str = df.format(value);  
			  item.put("score", item.getBigDecimal("score").setScale(2, BigDecimal.ROUND_UP));
		  }
	  }
	 //根据综合评分排序
	  Collections.sort(resultList, new Comparator<StatisticsRecord>() {
		@Override
		public int compare(StatisticsRecord o1, StatisticsRecord o2) {
			return o2.getBigDecimal("score").compareTo(o1.getBigDecimal("score"));
		}
	  });
	  res.setData(resultList);
	  renderJson(res);
  }
  
  public void getAllOrg() {
	  WsRes res = new WsRes();
	  BigDecimal k4 = BigDecimal.valueOf(0.4);
	  BigDecimal k3 = BigDecimal.valueOf(0.3);
	  int standardRecommendedCount = StatisticsRecord.dao.getMaxPersonRecommendCountByOrg().getRecommendCount().intValue();
	  List<StatisticsRecord> resultList = StatisticsRecord.dao.getOrgStatisticsRecordList(standardRecommendedCount,k3,k4);
	  if(resultList != null && resultList.size() > 0) {
		  for(StatisticsRecord item : resultList) {
			  item.put("score", BigDecimal.valueOf(item.getDouble("score")).setScale(2, BigDecimal.ROUND_UP));
		  }
	  }
	  //根据综合评分排序
	  Collections.sort(resultList, new Comparator<StatisticsRecord>() {
		@Override
		public int compare(StatisticsRecord o1, StatisticsRecord o2) {
			return o2.getBigDecimal("score").compareTo(o1.getBigDecimal("score"));
		}
	  });
	  res.setData(resultList);
	  renderJson(res);
  }
  /**
   * 获取地区信息 
   */
  public void regionInvoke() {
    WsRes res = new WsRes();
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<Region> regionList = Region.dao.getAllProvice();
    for (Region region : regionList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(region.getRegionId()));
      map.put("note", region.getRegionName());
      list.add(map);

    }
    res.setData(list);
    renderJson(res);
  }

  /**
   * 数据字典接口
   */
  public void sysDictInvoke() {
    String dataType = getPara("dataType");
    WsRes res = new WsRes();
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<SysDict> dataList = SysDict.dao.getAllData(dataType);
    for (SysDict item : dataList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(item.getDataValue()));
      map.put("note", item.getDataName());
      list.add(map);
    }
    res.setData(list);
    renderJson(res);
  }
  

}
