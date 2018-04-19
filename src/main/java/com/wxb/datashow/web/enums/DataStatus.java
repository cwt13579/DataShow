package com.wxb.datashow.web.enums;

/**
 * 
 * @author cwt
 *
 */
public enum DataStatus {
  UNKNOWN("未知"), ENABLED("启用"), DISABLED("禁用"), DELETED("已删除");

  private String note;

  private DataStatus(String note) {
    this.note = note;
  }

  public String getNote() {
    return this.note;
  }

  public Integer getValue() {
    return this.ordinal();
  }

  public String getOrdinalStr() {
    return String.valueOf(this.ordinal());
  }

  public static DataStatus returnType(int ordinal) {
    return DataStatus.values()[ordinal];
  }
}
