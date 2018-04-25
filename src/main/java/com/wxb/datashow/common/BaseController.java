package com.wxb.datashow.common;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import com.jfinal.core.Controller;

public class BaseController extends Controller {
  public final static String SESSEION_USER_ID = "SESSEION_USER_ID";
  public final static String SESSEION_USER_NAME = "SESSEION_USER_NAME";

  public Map<String, String> getQueryMap() {
    Map<String, String> map = new HashMap<String, String>();
    String modelNameAndDot = "qm.";
    Map<String, String[]> parasMap = getRequest().getParameterMap();
    for (Entry<String, String[]> e : parasMap.entrySet()) {
      String paraKey = e.getKey();
      if (paraKey.startsWith(modelNameAndDot)) {
        String paraName = paraKey.substring(modelNameAndDot.length());
        String[] paraValue = e.getValue();
        // 如果有多个参数，只取第一个值
        String value = paraValue[0];
        map.put(paraName, value);
      }
    }

    return map;
  }

  public Map<String, String[]> getAllQueryMap() {
    Map<String, String[]> parasMap = getRequest().getParameterMap();
    return parasMap;
  }
 
 
  protected int getPageCurrent() {
    int current = getParaToInt("current", 0);
    if (current == 0) {
      String key = "page.current." + getUri();
      current = getSessionAttr(key) != null ? Integer.parseInt(getSessionAttr(key).toString()) : 0;
    }
    if (current == 0) {
      // 默认第1页
      current = 1;
    }
    return current;
  }

  public String getUri() {
    return getRequest().getRequestURI();
  }

  public String getLoginUserId() {

    Object sessionUser = getSession().getAttribute(SESSEION_USER_ID);
    if (sessionUser != null) {
      return (String) sessionUser;
    } else {
      return null;
    }
  }

  protected int getPageSize() {
    int size = getParaToInt("size", 0);
    if (size == 0) {
      String key = "page.size." + getUri();
      size = getSessionAttr(key) != null ? Integer.parseInt(getSessionAttr(key).toString()) : 0;
    }
    if (size == 0) {
      // 默认10行
      size = 10;
    }
    return size;
  }
}
