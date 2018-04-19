package com.wxb.datashow.common;

public class WsRes {

	private Integer code;
	private Object data;
	private String msg;
	
	public static Integer SUCCESS = 1;
	public static Integer FAIL = 0;
	
	public WsRes() {
	  this.code = SUCCESS;
	  this.msg = "操作成功";
	}
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object value) {
		this.data = value;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	
}
