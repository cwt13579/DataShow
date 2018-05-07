package com.wxb.datashow.web.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.demo.common.model.Label;
import com.demo.common.model.ProductRule;
import com.demo.common.model.Region;
import com.demo.common.model.SysDict;
import com.wxb.datashow.common.BaseController;
import com.wxb.datashow.web.enums.DataStatus;
import com.wxb.datashow.web.enums.OpResult;
import com.wxb.datashow.web.enums.YesNo;

/**
 * 用于页面Ajax调用获取常量列表
 */
public class EnumController extends BaseController {
  // 数据状态
  public void dataStatusInvoke() {
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    for (DataStatus status : DataStatus.values()) {
      if (DataStatus.ENABLED.equals(status) || DataStatus.DISABLED.equals(status)) {
        Map<String, String> map = new LinkedHashMap<String, String>();
        map.put("value", status.getOrdinalStr());
        map.put("note", status.getNote());
        list.add(map);
      }
    }
    renderJson(list);
  }

  // 成功失败
  public void opResultInvoke() {
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    for (OpResult type : OpResult.values()) {
      if (!OpResult.UNKNOWN.equals(type)) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("value", type.getOrdinalStr());
        map.put("note", type.getNote());
        list.add(map);
      }
    }
    renderJson(list);
  }

  // 是否
  public void yesNoInvoke() {
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    for (YesNo type : YesNo.values()) {
      if (!YesNo.UNKNOWN.equals(type)) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("value", type.getOrdinalStr());
        map.put("note", type.getNote());
        list.add(map);
      }
    }
    renderJson(list);
  }

  // 获取地区信息
  public void regionInvoke() {
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<Region> regionList = Region.dao.getAllProvice();
    for (Region region : regionList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(region.getRegionId()));
      map.put("note", region.getRegionName());
      list.add(map);

    }
    renderJson(list);
  }

  public void sysDictInvoke() {
    String dataType = getPara("dataType");
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<SysDict> dataList = SysDict.dao.getAllData(dataType);
    for (SysDict item : dataList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(item.getDataValue()));
      map.put("note", item.getDataName());
      list.add(map);
    }
    renderJson(list);
  }
  
  // 获取label
  public void labelInvoke() {
    List<Map<String, String>> list = new ArrayList<Map<String, String>>();
    List<Label> regionList = Label.dao.getAllLabel();
    for (Label label : regionList) {
      Map<String, String> map = new HashMap<String, String>();
      map.put("value", String.valueOf(label.getId()));
      map.put("note", label.getLabelName());
      list.add(map);

    }
    renderJson(list);
  }
//获取label
 public void ruleInvoke() {
   List<Map<String, String>> list = new ArrayList<Map<String, String>>();
   List<ProductRule> productRuleList = ProductRule.dao.getProductRuleBy(null);
   for (ProductRule rule : productRuleList) {
     Map<String, String> map = new HashMap<String, String>();
     map.put("value", String.valueOf(rule.getId()));
     map.put("note", rule.getRuleName());
     list.add(map);

   }
   renderJson(list);
 }
  
}
